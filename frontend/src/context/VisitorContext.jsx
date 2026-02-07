import React, { createContext, useContext, useState, useEffect } from 'react';

const VisitorContext = createContext();

export const useVisitors = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitors must be used within VisitorProvider');
  }
  return context;
};

export const VisitorProvider = ({ children }) => {
  // Approval codes are 6-digit unique codes (e.g., "VPA001", "VPA002")
  const [approvals, setApprovals] = useState([]);
  const [visitorHistory, setVisitorHistory] = useState([]);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedApprovals = localStorage.getItem('visitorApprovals');
    const savedHistory = localStorage.getItem('visitorHistory');
    
    if (savedApprovals) {
      setApprovals(JSON.parse(savedApprovals));
    }
    if (savedHistory) {
      setVisitorHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save approvals to localStorage
  useEffect(() => {
    localStorage.setItem('visitorApprovals', JSON.stringify(approvals));
  }, [approvals]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('visitorHistory', JSON.stringify(visitorHistory));
  }, [visitorHistory]);

  /**
   * Generate unique approval code
   * Format: VPA + 6 digits
   */
  const generateApprovalCode = () => {
    const existingCodes = approvals.map(a => parseInt(a.approvalCode.slice(3)));
    const nextNumber = Math.max(...existingCodes, 0) + 1;
    return `VPA${String(nextNumber).padStart(6, '0')}`;
  };

  /**
   * Add new visitor pre-approval
   * Only residents can call this (residentName/flatNumber from props)
   */
  const createApproval = (visitorData, residentInfo) => {
    const approval = {
      id: Date.now().toString(),
      approvalCode: generateApprovalCode(),
      visitorName: visitorData.visitorName,
      mobileNumber: visitorData.mobileNumber,
      purpose: visitorData.purpose,
      vehicleNumber: visitorData.vehicleNumber || null,
      approvalDate: new Date().toISOString().split('T')[0],
      startTime: visitorData.startTime,
      endTime: visitorData.endTime,
      dateOfVisit: visitorData.dateOfVisit,
      residentName: residentInfo.residentName,
      flatNumber: residentInfo.flatNumber,
      residerId: residentInfo.residerId,
      status: 'approved', // approved, expired, cancelled
      createdAt: new Date().toISOString(),
      entryTime: null,
      exitTime: null,
      securityVerifiedBy: null,
    };

    setApprovals([...approvals, approval]);
    return approval;
  };

  /**
   * Get upcoming approvals for a resident
   */
  const getUpcomingApprovals = (residerId) => {
    const now = new Date();
    return approvals.filter(approval => {
      if (approval.residerId !== residerId) return false;
      
      const visitDate = new Date(approval.dateOfVisit);
      const [endHour] = approval.endTime.split(':');
      const endDateTime = new Date(visitDate);
      endDateTime.setHours(parseInt(endHour), 0, 0, 0);
      
      return endDateTime > now && approval.status === 'approved' && !approval.entryTime;
    });
  };

  /**
   * Get expired approvals for a resident
   */
  const getExpiredApprovals = (residerId) => {
    const now = new Date();
    return approvals.filter(approval => {
      if (approval.residerId !== residerId) return false;
      
      const visitDate = new Date(approval.dateOfVisit);
      const [endHour] = approval.endTime.split(':');
      const endDateTime = new Date(visitDate);
      endDateTime.setHours(parseInt(endHour), 0, 0, 0);
      
      return endDateTime <= now && !approval.exitTime;
    });
  };

  /**
   * Get visitor history for a resident
   */
  const getVisitorHistory = (residerId) => {
    return approvals.filter(a => 
      a.residerId === residerId && (a.exitTime || a.status === 'cancelled')
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  /**
   * Get approval by approval code (for security to verify)
   */
  const getApprovalByCode = (approvalCode) => {
    const approval = approvals.find(a => a.approvalCode === approvalCode);
    if (!approval) return null;

    const now = new Date();
    const visitDate = new Date(approval.dateOfVisit);
    const [startHour, startMin] = approval.startTime.split(':');
    const [endHour, endMin] = approval.endTime.split(':');
    
    const startDateTime = new Date(visitDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMin), 0, 0);
    
    const endDateTime = new Date(visitDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMin), 0, 0);

    return {
      ...approval,
      isWithinTimeWindow: now >= startDateTime && now <= endDateTime,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    };
  };

  /**
   * Get approval by mobile number (for security to search)
   */
  const getApprovalsByMobile = (mobileNumber) => {
    return approvals.filter(a => 
      a.mobileNumber === mobileNumber && 
      a.status === 'approved' && 
      !a.exitTime
    );
  };

  /**
   * Mark visitor entry (security action)
   */
  const markEntry = (approvalId, securityOfficerId, securityOfficerName) => {
    setApprovals(prevApprovals =>
      prevApprovals.map(approval =>
        approval.id === approvalId
          ? {
              ...approval,
              entryTime: new Date().toISOString(),
              securityVerifiedBy: {
                id: securityOfficerId,
                name: securityOfficerName,
              },
            }
          : approval
      )
    );

    // Add to history
    const approval = approvals.find(a => a.id === approvalId);
    if (approval) {
      setVisitorHistory([
        ...visitorHistory,
        {
          id: approvalId,
          type: 'entry',
          approvalCode: approval.approvalCode,
          visitorName: approval.visitorName,
          timestamp: new Date().toISOString(),
          verifiedBy: securityOfficerName,
        },
      ]);
    }
  };

  /**
   * Mark visitor exit (security action)
   */
  const markExit = (approvalId, securityOfficerId, securityOfficerName) => {
    setApprovals(prevApprovals =>
      prevApprovals.map(approval =>
        approval.id === approvalId
          ? {
              ...approval,
              exitTime: new Date().toISOString(),
            }
          : approval
      )
    );

    // Add to history
    const approval = approvals.find(a => a.id === approvalId);
    if (approval) {
      setVisitorHistory([
        ...visitorHistory,
        {
          id: `${approvalId}-exit`,
          type: 'exit',
          approvalCode: approval.approvalCode,
          visitorName: approval.visitorName,
          timestamp: new Date().toISOString(),
          verifiedBy: securityOfficerName,
        },
      ]);
    }
  };

  /**
   * Cancel approval (resident action)
   */
  const cancelApproval = (approvalId) => {
    setApprovals(prevApprovals =>
      prevApprovals.map(approval =>
        approval.id === approvalId
          ? {
              ...approval,
              status: 'cancelled',
            }
          : approval
      )
    );
  };

  /**
   * Get analytics data (admin)
   */
  const getAnalyticsData = () => {
    const totalApprovals = approvals.length;
    const approvedCount = approvals.filter(a => a.status === 'approved').length;
    const cancelledCount = approvals.filter(a => a.status === 'cancelled').length;
    const entriesCompleted = approvals.filter(a => a.entryTime && a.exitTime).length;
    
    // Visitor frequency by mobile
    const visitorFrequency = {};
    approvals.forEach(a => {
      visitorFrequency[a.mobileNumber] = 
        (visitorFrequency[a.mobileNumber] || 0) + 1;
    });

    // Purpose distribution
    const purposeDistribution = {};
    approvals.forEach(a => {
      purposeDistribution[a.purpose] = 
        (purposeDistribution[a.purpose] || 0) + 1;
    });

    // Daily trends (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailyTrends = {};
    
    approvals.forEach(a => {
      const createdDate = new Date(a.createdAt);
      if (createdDate >= thirtyDaysAgo) {
        const dateKey = createdDate.toISOString().split('T')[0];
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
    const entriesWithTime = approvals.filter(a => a.entryTime);
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
      .filter(a => {
        if (a.status !== 'approved' || a.exitTime) return false;
        
        const visitDate = new Date(a.dateOfVisit);
        const [startHour] = a.startTime.split(':');
        const [endHour] = a.endTime.split(':');
        
        const startDateTime = new Date(visitDate);
        startDateTime.setHours(parseInt(startHour), 0, 0, 0);
        
        const endDateTime = new Date(visitDate);
        endDateTime.setHours(parseInt(endHour), 0, 0, 0);
        
        return now <= endDateTime; // Hasn't expired yet
      })
      .sort((a, b) => new Date(a.dateOfVisit) - new Date(b.dateOfVisit));
  };

  /**
   * Audit log: Get suspicious activities
   */
  const getSuspiciousActivities = () => {
    return approvals.filter(approval => {
      // Multiple visitors from same phone in single day
      const samePhoneDay = approvals.filter(a => {
        const aDate = a.dateOfVisit;
        const bDate = approval.dateOfVisit;
        return a.mobileNumber === approval.mobileNumber && aDate === bDate;
      }).length;

      // Entry after end time window
      const entryAfterWindow = approval.entryTime && approval.endTime
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
    visitorHistory,
    generateApprovalCode,
    createApproval,
    getUpcomingApprovals,
    getExpiredApprovals,
    getVisitorHistory,
    getApprovalByCode,
    getApprovalsByMobile,
    markEntry,
    markExit,
    cancelApproval,
    getAnalyticsData,
    getPreApprovedVisitors,
    getSuspiciousActivities,
  };

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
};
