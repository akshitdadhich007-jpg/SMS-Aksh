import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const VisitorContext = createContext();

export const useVisitors = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error("useVisitors must be used within VisitorProvider");
  }
  return context;
};

export const VisitorProvider = ({ children }) => {
  const [approvals, setApprovals] = useState([]);
  const [visitorHistory, setVisitorHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize from API
  const refreshApprovals = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(user);

      let res;
      if (user?.role === 'security') {
        res = await api.get('/api/security/preapproved');
      } else if (user?.role === 'resident') {
        res = await api.get('/api/resident/visitor-preapproval');
      }

      if (res?.data) {
        setApprovals(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch approvals", err);
    }
  };

  useEffect(() => {
    refreshApprovals();
  }, []);

  /**
   * Add new visitor pre-approval
   * Only residents can call this (residentName/flatNumber from props)
   */
  const createApproval = async (visitorData, residentInfo) => {
    try {
      const payload = {
        visitorName: visitorData.visitorName,
        mobileNumber: visitorData.mobileNumber,
        purpose: visitorData.purpose,
        vehicleNumber: visitorData.vehicleNumber || "",
        dateOfVisit: visitorData.dateOfVisit,
        startTime: visitorData.startTime,
        endTime: visitorData.endTime
      };
      const res = await api.post('/api/resident/visitor-preapproval', payload);
      await refreshApprovals();
      return res.data;
    } catch (err) {
      console.error("Error creating approval", err);
      throw err;
    }
  };

  /**
   * Get upcoming approvals for a resident
   */
  const getUpcomingApprovals = () => {
    const now = new Date();
    return approvals.filter((approval) => {
      const visitDate = new Date(approval.date_of_visit);
      const [endHour] = approval.end_time.split(":");
      const endDateTime = new Date(visitDate);
      endDateTime.setHours(parseInt(endHour), 0, 0, 0);

      return (
        endDateTime > now &&
        approval.status === "approved" &&
        !approval.entry_time
      );
    });
  };

  /**
   * Get expired approvals for a resident
   */
  const getExpiredApprovals = () => {
    const now = new Date();
    return approvals.filter((approval) => {
      const visitDate = new Date(approval.date_of_visit);
      const [endHour] = approval.end_time.split(":");
      const endDateTime = new Date(visitDate);
      endDateTime.setHours(parseInt(endHour), 0, 0, 0);

      return endDateTime <= now && !approval.exit_time && approval.status !== 'cancelled';
    });
  };

  /**
   * Get visitor history for a resident
   */
  const getVisitorHistory = () => {
    return approvals
      .filter(
        (a) => a.exit_time || a.status === "cancelled" || a.status === "used"
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  /**
   * Get approval by approval code (for security to verify)
   */
  const getApprovalByCode = (approvalCode) => {
    const approval = approvals.find((a) => a.approval_code === approvalCode);
    if (!approval) return null;

    const now = new Date();
    const visitDate = new Date(approval.date_of_visit);
    const [startHour, startMin] = approval.start_time.split(":");
    const [endHour, endMin] = approval.end_time.split(":");

    const startDateTime = new Date(visitDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMin), 0, 0);

    const endDateTime = new Date(visitDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMin), 0, 0);

    return {
      ...approval,
      isWithinTimeWindow: now >= startDateTime && now <= endDateTime,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      visitorName: approval.visitor_name,
      mobileNumber: approval.mobile_number,
      residentName: (approval.residents?.name || "Unknown"),
      flatNumber: (approval.residents?.flat || ""),
      approvalCode: approval.approval_code,
    };
  };

  /**
   * Get approval by mobile number (for security to search)
   */
  const getApprovalsByMobile = (mobileNumber) => {
    return approvals.filter(
      (a) =>
        a.mobile_number === mobileNumber &&
        a.status === "approved" &&
        !a.exit_time,
    );
  };

  /**
   * Mark visitor entry (security action)
   */
  const markEntry = async (approvalId) => {
    try {
      await api.post(`/api/security/preapproved/mark-entry/${approvalId}`);
      await refreshApprovals();
    } catch (err) {
      console.error("Failed to mark entry", err);
      throw err;
    }
  };

  /**
   * Mark visitor exit (security action)
   */
  const markExit = async (approvalId) => {
    try {
      await api.post(`/api/security/preapproved/mark-exit/${approvalId}`);
      await refreshApprovals();
    } catch (err) {
      console.error("Failed to mark exit", err);
      throw err;
    }
  };

  /**
   * Cancel approval (resident action)
   */
  const cancelApproval = async (approvalId) => {
    try {
      await api.delete(`/api/resident/visitor-preapproval/${approvalId}`);
      await refreshApprovals();
    } catch (err) {
      console.error("Failed to cancel approval", err);
      throw err;
    }
  };

  /**
   * Get analytics data (admin)
   */
  const getAnalyticsData = () => {
    const totalApprovals = approvals.length;
    const approvedCount = approvals.filter(
      (a) => a.status === "approved",
    ).length;
    const cancelledCount = approvals.filter(
      (a) => a.status === "cancelled",
    ).length;
    const entriesCompleted = approvals.filter(
      (a) => a.entryTime && a.exitTime,
    ).length;

    // Visitor frequency by mobile
    const visitorFrequency = {};
    approvals.forEach((a) => {
      visitorFrequency[a.mobileNumber] =
        (visitorFrequency[a.mobileNumber] || 0) + 1;
    });

    // Purpose distribution
    const purposeDistribution = {};
    approvals.forEach((a) => {
      purposeDistribution[a.purpose] =
        (purposeDistribution[a.purpose] || 0) + 1;
    });

    // Daily trends (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailyTrends = {};

    approvals.forEach((a) => {
      const createdDate = new Date(a.createdAt);
      if (createdDate >= thirtyDaysAgo) {
        const dateKey = createdDate.toISOString().split("T")[0];
        dailyTrends[dateKey] = (dailyTrends[dateKey] || 0) + 1;
      }
    });

    return {
      totalApprovals,
      approvedCount,
      cancelledCount,
      entriesCompleted,
      visitorFrequency,
      purposeDistribution,
      dailyTrends,
      avgEntryTime: calculateAvgEntryTime(),
    };
  };

  /**
   * Calculate average time between approval and entry
   */
  const calculateAvgEntryTime = () => {
    const entriesWithTime = approvals.filter((a) => a.entryTime);
    if (entriesWithTime.length === 0) return 0;

    const totalMinutes = entriesWithTime.reduce((sum, a) => {
      const approvalTime = new Date(a.createdAt);
      const entryTime = new Date(a.entryTime);
      const minutes = (entryTime - approvalTime) / (1000 * 60);
      return sum + minutes;
    }, 0);

    return Math.round(totalMinutes / entriesWithTime.length);
  };

  /**
   * Get all pre-approved visitors (security search)
   */
  const getPreApprovedVisitors = () => {
    const now = new Date();
    return approvals
      .filter((a) => {
        if (a.status !== "approved" || a.exit_time || a.status === "used" || a.status === "cancelled") return false;

        const visitDate = new Date(a.date_of_visit);
        const [startHour] = a.start_time.split(":");
        const [endHour] = a.end_time.split(":");

        const startDateTime = new Date(visitDate);
        startDateTime.setHours(parseInt(startHour), 0, 0, 0);

        const endDateTime = new Date(visitDate);
        endDateTime.setHours(parseInt(endHour), 0, 0, 0);

        return now <= endDateTime; // Hasn't expired yet
      })
      .sort((a, b) => new Date(a.date_of_visit) - new Date(b.date_of_visit));
  };

  /**
   * Audit log: Get suspicious activities
   */
  const getSuspiciousActivities = () => {
    return approvals.filter((approval) => {
      // Multiple visitors from same phone in single day
      const samePhoneDay = approvals.filter((a) => {
        const aDate = a.dateOfVisit;
        const bDate = approval.dateOfVisit;
        return a.mobileNumber === approval.mobileNumber && aDate === bDate;
      }).length;

      // Entry after end time window
      const entryAfterWindow =
        approval.entryTime && approval.endTime
          ? new Date(approval.entryTime).getTime() >
          new Date(`${approval.dateOfVisit}T${approval.endTime}`).getTime()
          : false;

      // Extended stay (more than 2 hours after end time)
      const extendedStay = approval.exitTime
        ? new Date(approval.exitTime).getTime() -
        new Date(`${approval.dateOfVisit}T${approval.endTime}`).getTime() >
        2 * 60 * 60 * 1000
        : false;

      return samePhoneDay > 2 || entryAfterWindow || extendedStay;
    });
  };

  const value = {
    approvals,
    refreshApprovals,
    createApproval,
    getUpcomingApprovals,
    getExpiredApprovals,
    getVisitorHistory,
    getApprovalByCode,
    getApprovalsByMobile,
    markEntry,
    markExit,
    cancelApproval,
    getPreApprovedVisitors
  };

  return (
    <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>
  );
};
