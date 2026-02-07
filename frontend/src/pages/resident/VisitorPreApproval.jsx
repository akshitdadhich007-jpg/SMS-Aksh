import React, { useState } from 'react';
import { Plus, X, Clock, AlertCircle, CheckCircle, User, Phone, MapPin, Calendar, Copy, Eye, EyeOff } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useVisitors } from '../../context/VisitorContext';
import './VisitorPreApproval.css';

const VisitorPreApproval = () => {
  const {
    createApproval,
    getUpcomingApprovals,
    getExpiredApprovals,
    getVisitorHistory,
    cancelApproval,
  } = useVisitors();

  // Mock resident data (in production, get from auth context)
  const residentId = 'RES001';
  const residentName = 'Rajesh Kumar';
  const flatNumber = 'A-301';

  const [activeTab, setActiveTab] = useState('create');
  const [showForm, setShowForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    visitorName: '',
    mobileNumber: '',
    purpose: 'meeting',
    dateOfVisit: '',
    startTime: '10:00',
    endTime: '12:00',
    vehicleNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Get data
  const upcomingApprovals = getUpcomingApprovals(residentId);
  const expiredApprovals = getExpiredApprovals(residentId);
  const history = getVisitorHistory(residentId);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.visitorName.trim()) {
      newErrors.visitorName = 'Visitor name is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter valid 10-digit mobile number';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Purpose is required';
    }

    if (!formData.dateOfVisit) {
      newErrors.dateOfVisit = 'Date is required';
    } else {
      const selectedDate = new Date(formData.dateOfVisit);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dateOfVisit = 'Cannot select past date';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else {
      const [startHour, startMin] = formData.startTime.split(':');
      const [endHour, endMin] = formData.endTime.split(':');
      const startMinutes = parseInt(startHour) * 60 + parseInt(startMin);
      const endMinutes = parseInt(endHour) * 60 + parseInt(endMin);

      if (endMinutes <= startMinutes) {
        newErrors.endTime = 'End time must be after start time';
      }

      if ((endMinutes - startMinutes) > 8 * 60) {
        newErrors.endTime = 'Approval window cannot exceed 8 hours';
      }
    }

    if (formData.vehicleNumber && !/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(formData.vehicleNumber.toUpperCase())) {
      newErrors.vehicleNumber = 'Enter valid vehicle number (e.g., MH02AB1234)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const approval = createApproval(formData, {
        residerId: residentId,
        residentName: residentName,
        flatNumber: flatNumber,
      });

      setSuccessMessage(`Visitor pre-approved! Code: ${approval.approvalCode}`);
      setFormData({
        visitorName: '',
        mobileNumber: '',
        purpose: 'meeting',
        dateOfVisit: '',
        startTime: '10:00',
        endTime: '12:00',
        vehicleNumber: '',
      });
      setErrors({});
      setShowForm(false);

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error creating approval:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Copy approval code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Get purpose label
  const getPurposeLabel = (purpose) => {
    const purposes = {
      meeting: 'Meeting/Work',
      personal: 'Personal Visit',
      delivery: 'Delivery',
      repair: 'Repair/Maintenance',
      guest: 'Guest/Family',
      other: 'Other',
    };
    return purposes[purpose] || purpose;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'expired':
        return 'status-expired';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="visitor-preapproval-page">
      <PageHeader
        title="Visitor Pre-Approval"
        subtitle="Pre-approve visitors before they arrive at the gate"
        icon="👥"
      />

      {successMessage && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="close-message"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="preapproval-container">
        {/* Resident Info Card */}
        <div className="resident-info-card">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Flat Number</span>
              <span className="info-value">{flatNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Resident Name</span>
              <span className="info-value">{residentName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Active Approvals</span>
              <span className="info-value highlight">{upcomingApprovals.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Approved</span>
              <span className="info-value">{upcomingApprovals.length + history.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="preapproval-tabs">
          <button
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('create');
              setShowForm(false);
            }}
          >
            <Plus size={18} />
            New Approval
          </button>
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Clock size={18} />
            Upcoming
            {upcomingApprovals.length > 0 && (
              <span className="badge">{upcomingApprovals.length}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'expired' ? 'active' : ''}`}
            onClick={() => setActiveTab('expired')}
          >
            <AlertCircle size={18} />
            Expired
            {expiredApprovals.length > 0 && (
              <span className="badge error">{expiredApprovals.length}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {/* Create Approval Tab */}
        {activeTab === 'create' && (
          <div className="tab-content">
            {!showForm ? (
              <div className="empty-state">
                <Plus size={48} />
                <h3>Pre-Approve a Visitor</h3>
                <p>Generate a visitor pass before they arrive</p>
                <button
                  className="btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={18} />
                  Create Pre-Approval
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="approval-form">
                <div className="form-section">
                  <h3>Visitor Details</h3>

                  <div className="form-group">
                    <label>
                      <User size={16} />
                      Visitor Name
                    </label>
                    <input
                      type="text"
                      name="visitorName"
                      value={formData.visitorName}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      maxLength="100"
                    />
                    {errors.visitorName && (
                      <span className="error-message">{errors.visitorName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <Phone size={16} />
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                    />
                    {errors.mobileNumber && (
                      <span className="error-message">{errors.mobileNumber}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Purpose of Visit</label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                    >
                      <option value="meeting">Meeting/Work</option>
                      <option value="personal">Personal Visit</option>
                      <option value="delivery">Delivery</option>
                      <option value="repair">Repair/Maintenance</option>
                      <option value="guest">Guest/Family</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.purpose && (
                      <span className="error-message">{errors.purpose}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>
                      <MapPin size={16} />
                      Vehicle Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., MH02AB1234"
                      maxLength="10"
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.vehicleNumber && (
                      <span className="error-message">{errors.vehicleNumber}</span>
                    )}
                  </div>
                </div>

                <div className="form-section">
                  <h3>Visit Timing</h3>

                  <div className="form-group">
                    <label>
                      <Calendar size={16} />
                      Date of Visit
                    </label>
                    <input
                      type="date"
                      name="dateOfVisit"
                      value={formData.dateOfVisit}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.dateOfVisit && (
                      <span className="error-message">{errors.dateOfVisit}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <Clock size={16} />
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                      />
                      {errors.startTime && (
                        <span className="error-message">{errors.startTime}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>
                        <Clock size={16} />
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                      />
                      {errors.endTime && (
                        <span className="error-message">{errors.endTime}</span>
                      )}
                    </div>
                  </div>

                  <div className="time-note">
                    <Clock size={16} />
                    <span>Approval window: {
                      formData.startTime && formData.endTime
                        ? (() => {
                            const [startHour, startMin] = formData.startTime.split(':');
                            const [endHour, endMin] = formData.endTime.split(':');
                            const startMinutes = parseInt(startHour) * 60 + parseInt(startMin);
                            const endMinutes = parseInt(endHour) * 60 + parseInt(endMin);
                            const hours = Math.floor((endMinutes - startMinutes) / 60);
                            const mins = (endMinutes - startMinutes) % 60;
                            return `${hours}h ${mins}m`;
                          })()
                        : '0h'
                    }</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({
                        visitorName: '',
                        mobileNumber: '',
                        purpose: 'meeting',
                        dateOfVisit: '',
                        startTime: '10:00',
                        endTime: '12:00',
                        vehicleNumber: '',
                      });
                      setErrors({});
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Generate Approval Code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Upcoming Approvals Tab */}
        {activeTab === 'upcoming' && (
          <div className="tab-content">
            {upcomingApprovals.length === 0 ? (
              <div className="empty-state">
                <Clock size={48} />
                <p>No upcoming visitors approved</p>
              </div>
            ) : (
              <div className="approvals-list">
                {upcomingApprovals.map(approval => (
                  <div key={approval.id} className="approval-card upcoming">
                    <div className="approval-header">
                      <div className="approval-title">
                        <h4>{approval.visitorName}</h4>
                        <span className={`status-badge ${getStatusColor(approval.status)}`}>
                          {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                        </span>
                      </div>
                      <div className="approval-code-display">
                        <code>{approval.approvalCode}</code>
                        <button
                          className="copy-btn"
                          onClick={() => handleCopyCode(approval.approvalCode)}
                          title="Copy code"
                        >
                          {copiedCode === approval.approvalCode ? (
                            <CheckCircle size={18} />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="approval-details">
                      <div className="detail-item">
                        <span className="detail-label">Mobile</span>
                        <span className="detail-value">{approval.mobileNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Purpose</span>
                        <span className="detail-value">{getPurposeLabel(approval.purpose)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Date & Time</span>
                        <span className="detail-value">
                          {new Date(approval.dateOfVisit).toLocaleDateString()} · {approval.startTime} - {approval.endTime}
                        </span>
                      </div>
                      {approval.vehicleNumber && (
                        <div className="detail-item">
                          <span className="detail-label">Vehicle</span>
                          <span className="detail-value">{approval.vehicleNumber}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="detail-label">Created</span>
                        <span className="detail-value">
                          {new Date(approval.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="approval-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => cancelApproval(approval.id)}
                      >
                        <X size={16} />
                        Cancel Approval
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Expired Approvals Tab */}
        {activeTab === 'expired' && (
          <div className="tab-content">
            {expiredApprovals.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={48} />
                <p>No expired approvals</p>
              </div>
            ) : (
              <div className="approvals-list">
                {expiredApprovals.map(approval => (
                  <div key={approval.id} className="approval-card expired">
                    <div className="approval-header">
                      <div className="approval-title">
                        <h4>{approval.visitorName}</h4>
                        <span className="status-badge status-expired">Expired</span>
                      </div>
                      <code>{approval.approvalCode}</code>
                    </div>

                    <div className="approval-details">
                      <div className="detail-item">
                        <span className="detail-label">Mobile</span>
                        <span className="detail-value">{approval.mobileNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Approval Window Ended</span>
                        <span className="detail-value">
                          {new Date(approval.dateOfVisit).toLocaleDateString()} at {approval.endTime}
                        </span>
                      </div>
                      {approval.entryTime && (
                        <div className="detail-item">
                          <span className="detail-label">Entered At</span>
                          <span className="detail-value">
                            {new Date(approval.entryTime).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="tab-content">
            {history.length === 0 ? (
              <div className="empty-state">
                <User size={48} />
                <p>No visitor history yet</p>
              </div>
            ) : (
              <div className="history-list">
                {history.map(approval => (
                  <div key={approval.id} className="history-card">
                    <div className="history-header">
                      <h4>{approval.visitorName}</h4>
                      <span className="approval-code-small">{approval.approvalCode}</span>
                    </div>

                    <div className="history-details">
                      <div className="detail-item">
                        <span className="detail-label">Mobile</span>
                        <span className="detail-value">{approval.mobileNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Purpose</span>
                        <span className="detail-value">{getPurposeLabel(approval.purpose)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Approved Date</span>
                        <span className="detail-value">
                          {new Date(approval.approvalDate).toLocaleDateString()}
                        </span>
                      </div>
                      {approval.entryTime && (
                        <div className="detail-item">
                          <span className="detail-label">Visited</span>
                          <span className="detail-value">
                            {new Date(approval.entryTime).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                      {approval.exitTime && (
                        <div className="detail-item">
                          <span className="detail-label">Left</span>
                          <span className="detail-value">
                            {new Date(approval.exitTime).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                      {approval.status === 'cancelled' && (
                        <div className="detail-item">
                          <span className="detail-label">Status</span>
                          <span className="detail-value cancelled">Cancelled</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorPreApproval;
