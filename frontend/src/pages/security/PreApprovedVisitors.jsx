import React, { useState, useEffect } from 'react';
import { Search, Clock, Check, X, AlertCircle, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import {
  getPreApprovalByCode,
  markPreApprovalEntry,
  markPreApprovalExit,
  subscribeToAllPreApprovals,
  approvePreApprovalBySecurity,
  rejectPreApprovalBySecurity,
} from '../../firebase/visitorService';
import '../resident/VisitorPreApproval.css';

const PreApprovedVisitors = () => {
  const securityOfficerId = 'SEC001';
  const securityOfficerName = 'Vikram Singh';
  const securityOfficerShift = 'Morning (6 AM - 2 PM)';

  const [searchType, setSearchType] = useState('code');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [allApprovals, setAllApprovals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAllPreApprovals((approvals) => {
      setAllApprovals(approvals);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setSelectedApproval(null);
      return;
    }

    setLoading(true);
    try {
      if (searchType === 'code') {
        getPreApprovalByCode(searchQuery.toUpperCase(), (approval) => {
          setSearchResults(approval ? [approval] : []);
          setSelectedApproval(approval || null);
          setLoading(false);
        });
      } else {
        const results = allApprovals.filter(a => a.phone && a.phone.includes(searchQuery));
        setSearchResults(results);
        if (results.length > 0) {
          setSelectedApproval(results[0]);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setLoading(false);
    }
  };

  const handleMarkEntry = async (approvalId, approval) => {
    try {
      await markPreApprovalEntry(approvalId);
      setSelectedApproval({ ...approval, status: 'checked_in', entryTime: new Date() });
      console.log('Entry marked successfully');
    } catch (error) {
      console.error('Failed to mark entry:', error);
    }
  };

  const handleMarkExit = async (approvalId, approval) => {
    try {
      await markPreApprovalExit(approvalId);
      setSelectedApproval({ ...approval, status: 'checked_out', exitTime: new Date() });
      console.log('Exit marked successfully');
    } catch (error) {
      console.error('Failed to mark exit:', error);
    }
  };

  const handleAllow = async (approvalId, approval) => {
    try {
      await approvePreApprovalBySecurity(approvalId, securityOfficerName);
      setSelectedApproval({ ...approval, status: 'approved' });
      console.log('Visitor pre-approval allowed by security');
    } catch (error) {
      console.error('Failed to allow pre-approval:', error);
    }
  };

  const handleDeny = async (approvalId, approval) => {
    try {
      await rejectPreApprovalBySecurity(approvalId, 'Denied at gate by security', securityOfficerName);
      setSelectedApproval({ ...approval, status: 'denied' });
      console.log('Visitor pre-approval denied by security');
    } catch (error) {
      console.error('Failed to deny pre-approval:', error);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Verification';
      case 'approved':
        return 'Allowed';
      case 'checked_in':
        return 'Checked In';
      case 'checked_out':
        return 'Checked Out';
      case 'denied':
        return 'Denied';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const getTimeWindowStatus = (approval) => {
    if (!approval) return null;
    const now = new Date();
    const visitDate = new Date(approval.dateOfVisit);
    const [startHour, startMin] = approval.startTime.split(':');
    const [endHour, endMin] = approval.endTime.split(':');
    
    const startDateTime = new Date(visitDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMin), 0, 0);
    const endDateTime = new Date(visitDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMin), 0, 0);

    if (now < startDateTime) {
      const minUntilStart = Math.round((startDateTime - now) / (1000 * 60));
      return { status: 'upcoming', message: `Visitor can enter in ${minUntilStart} minutes`, color: 'warning' };
    }
    if (now <= endDateTime) {
      const minUntilEnd = Math.round((endDateTime - now) / (1000 * 60));
      return { status: 'valid', message: `Approval valid for ${minUntilEnd} more minutes`, color: 'valid' };
    }
    const minsPastEnd = Math.round((now - endDateTime) / (1000 * 60));
    return { status: 'expired', message: `Approval expired ${minsPastEnd} minutes ago`, color: 'invalid' };
  };

  const getDuration = (approval) => {
    const [startHour, startMin] = approval.startTime.split(':');
    const [endHour, endMin] = approval.endTime.split(':');
    const startMinutes = parseInt(startHour) * 60 + parseInt(startMin);
    const endMinutes = parseInt(endHour) * 60 + parseInt(endMin);
    const duration = endMinutes - startMinutes;
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };

  const getStayDuration = (approval) => {
    if (!approval.entryTime || !approval.exitTime) return null;
    const duration = new Date(approval.exitTime) - new Date(approval.entryTime);
    const mins = Math.floor(duration / (1000 * 60));
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hours > 0 ? `${hours}h ${remainingMins}m` : `${remainingMins}m`;
  };

  return (
    <div className="security-preapproved-page">
      <PageHeader
        title="Pre-Approved Visitors"
        subtitle="Verify and manage visitor entry/exit"
        icon="🔍"
      />

      <div className="security-container">
        <div className="resident-info-card">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Security Officer</span>
              <span className="info-value">{securityOfficerName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Shift</span>
              <span className="info-value">{securityOfficerShift}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Approved Waiting</span>
              <span className="info-value highlight">{allApprovals.filter(a => a.status === 'pending').length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time</span>
              <span className="info-value">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-group">
              <label htmlFor="search-type">Search By</label>
              <select
                id="search-type"
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchQuery('');
                  setSearchResults(null);
                  setSelectedApproval(null);
                }}
              >
                <option value="code">Approval Code</option>
                <option value="mobile">Mobile Number</option>
              </select>
            </div>

            <div className="search-group">
              <label htmlFor="search-query">
                {searchType === 'code' ? 'Code' : 'Mobile Number'}
              </label>
              <input
                id="search-query"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchType === 'code' ? 'e.g., VPA000001' : 'e.g., 9876543210'}
                maxLength={searchType === 'code' ? 9 : 10}
              />
            </div>

            <button type="submit" className="btn-search" disabled={loading}>
              <Search size={18} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {searchResults !== null && searchResults.length === 0 && (
          <div className="verification-result invalid">
            <div className="verification-header">
              <AlertCircle size={20} style={{ color: '#DC2626' }} />
              <h3>Not Found</h3>
              <span className="verification-status invalid">Invalid</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              No pre-approved visitor found with this {searchType === 'code' ? 'code' : 'mobile number'}.
            </p>
          </div>
        )}

        {searchResults && searchResults.length > 0 && searchResults.map(approval => {
          const timeStatus = getTimeWindowStatus(approval);
          return (
            <div key={approval.id} className={`verification-result ${timeStatus?.color}`}>
              <div className="verification-header">
                {timeStatus?.color === 'valid' ? (
                  <Check size={20} style={{ color: '#16A34A' }} />
                ) : timeStatus?.color === 'warning' ? (
                  <AlertCircle size={20} style={{ color: '#D97706' }} />
                ) : (
                  <X size={20} style={{ color: '#DC2626' }} />
                )}
                <h3>{approval.visitorName}</h3>
                <span className={`verification-status ${timeStatus?.color}`}>
                  {timeStatus?.status.toUpperCase()}
                </span>
              </div>

              <div className="verification-details">
                <div className="detail-item">
                  <span className="detail-label">Approval Code</span>
                  <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                    {approval.approvalCode}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mobile Number</span>
                  <span className="detail-value">{approval.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Resident</span>
                  <span className="detail-value">
                    {approval.residentName} · Flat {approval.residentFlat || approval.flatNumber || '-'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Purpose</span>
                  <span className="detail-value">{approval.purpose}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date & Time Window</span>
                  <span className="detail-value">
                    {new Date(approval.dateOfVisit).toLocaleDateString()} · {approval.startTime} - {approval.endTime}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{getDuration(approval)}</span>
                </div>
              </div>

              {timeStatus && (
                <div className={`time-window-status ${timeStatus.color}`}>
                  <Clock size={16} />
                  {timeStatus.message}
                </div>
              )}

              {approval.status === 'pending' && (
                <div className="vpa-card-actions" style={{ marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn-mark-entry"
                    onClick={() => handleAllow(approval.id, approval)}
                  >
                    <Check size={16} />
                    Allow
                  </button>
                  <button
                    type="button"
                    className="btn-mark-exit"
                    onClick={() => handleDeny(approval.id, approval)}
                  >
                    <X size={16} />
                    Deny
                  </button>
                </div>
              )}

              <div className="entry-exit-section" style={{ marginTop: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Visitor Movement
                </h4>

                <div className="entry-exit-field">
                  <label>Entry Time</label>
                  {approval.status === 'checked_in' || approval.status === 'checked_out' ? (
                    <div className="entry-exit-time">
                      <span>
                        {approval.entryTime ? new Date(approval.entryTime).toLocaleTimeString() : 'N/A'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Verified by {securityOfficerName}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-mark-entry"
                      onClick={() => handleMarkEntry(approval.id, approval)}
                      disabled={approval.status !== 'approved' || (timeStatus?.color !== 'valid' && timeStatus?.color !== 'warning')}
                    >
                      <Check size={16} />
                      Mark Entry
                    </button>
                  )}
                </div>

                {(approval.status === 'checked_in' || approval.status === 'checked_out') && (
                  <div className="entry-exit-field">
                    <label>Exit Time</label>
                    {approval.status === 'checked_out' && approval.exitTime ? (
                      <div className="entry-exit-time">
                        <span>{new Date(approval.exitTime).toLocaleTimeString()}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Stay: {getStayDuration(approval)}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn-mark-exit"
                        onClick={() => handleMarkExit(approval.id, approval)}
                      >
                        <X size={16} />
                        Mark Exit
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {searchResults === null && (
          <div>
            <div className="security-tabs">
              <div
                className="tab-btn active"
                style={{
                  cursor: 'default',
                  padding: '14px 16px',
                  color: '#4F46E5',
                  borderBottomColor: '#4F46E5',
                  background: 'var(--card)',
                  border: 'none',
                }}
              >
                <Users size={18} />
                All Pre-Approved Visitors
                {allApprovals.length > 0 && (
                  <span className="badge">{allApprovals.length}</span>
                )}
              </div>
            </div>

            <div className="tab-content">
              {allApprovals.length === 0 ? (
                <div className="empty-state">
                  <Users size={48} />
                  <p>No pre-approved visitors at the moment</p>
                </div>
              ) : (
                <div className="approvals-list">
                  {allApprovals.map(approval => {
                    const timeStatus = getTimeWindowStatus(approval);
                    return (
                      <div
                        key={approval.id}
                        className="approval-card"
                        onClick={() => {
                          setSelectedApproval(approval);
                          setSearchQuery(approval.approvalCode);
                          setSearchType('code');
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="approval-header">
                          <div className="approval-title">
                            <h4>{approval.visitorName}</h4>
                            <span className={`status-badge status-${approval.status === 'checked_out' ? 'approved' : approval.status === 'denied' || approval.status === 'cancelled' ? 'cancelled' : approval.status === 'pending' ? 'pending' : 'approved'}`}>
                              {getStatusLabel(approval.status)}
                            </span>
                          </div>
                          <div className="approval-code-display">
                            <code>{approval.approvalCode}</code>
                          </div>
                        </div>

                        <div className="approval-details">
                          <div className="detail-item">
                            <span className="detail-label">Flat</span>
                            <span className="detail-value">{approval.residentFlat || approval.flatNumber || '-'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Resident</span>
                            <span className="detail-value">{approval.residentName}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Time Window</span>
                            <span className="detail-value">
                              {approval.startTime} - {approval.endTime}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Purpose</span>
                            <span className="detail-value">{approval.purpose}</span>
                          </div>
                        </div>

                        {approval.status === 'pending' && (
                          <div className="vpa-card-actions" style={{ marginTop: '10px' }}>
                            <button
                              type="button"
                              className="btn-mark-entry"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAllow(approval.id, approval);
                              }}
                            >
                              <Check size={16} />
                              Allow
                            </button>
                            <button
                              type="button"
                              className="btn-mark-exit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeny(approval.id, approval);
                              }}
                            >
                              <X size={16} />
                              Deny
                            </button>
                          </div>
                        )}

                        {approval.status === 'checked_in' || approval.status === 'checked_out' ? (
                          <div className="entry-exit-section" style={{ marginTop: '12px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              ✓ Entered at {approval.entryTime ? new Date(approval.entryTime).toLocaleTimeString() : 'N/A'}
                              {approval.status === 'checked_out' && approval.exitTime && ` • Exited at ${new Date(approval.exitTime).toLocaleTimeString()}`}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreApprovedVisitors;
