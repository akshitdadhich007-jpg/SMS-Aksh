import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Calendar, Clock, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import './AssetBooking.css';

const AdminAssetBooking = () => {
  const [activeTab, setActiveTab] = useState('assets');
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [assetForm, setAssetForm] = useState({
    name: '',
    capacity: '',
    charges: '',
    bookingRules: '',
    description: '',
  });

  const [assets, setAssets] = useState([
    {
      id: 1,
      name: 'Clubhouse',
      capacity: '50',
      charges: '500',
      bookingRules: 'Max 3 hours per day',
      description: 'Community gathering space',
    },
    {
      id: 2,
      name: 'Community Hall',
      capacity: '100',
      charges: '800',
      bookingRules: 'Max 6 hours per day',
      description: 'Large event space',
    },
  ]);

  const [bookingRequests] = useState([
    {
      id: 1,
      assetName: 'Clubhouse',
      resident: 'Rajesh Kumar',
      date: '2026-02-14',
      timeSlot: '6:00 PM - 8:00 PM',
      purpose: 'Birthday Party',
      status: 'Pending',
      requestedOn: '2026-02-10',
    },
    {
      id: 2,
      assetName: 'Community Hall',
      resident: 'Priya Sharma',
      date: '2026-02-20',
      timeSlot: '10:00 AM - 1:00 PM',
      purpose: 'Wedding Reception',
      status: 'Pending',
      requestedOn: '2026-02-05',
    },
    {
      id: 3,
      assetName: 'Gym',
      resident: 'Amit Patel',
      date: '2026-02-12',
      timeSlot: '6:00 AM - 7:00 AM',
      purpose: 'Personal Use',
      status: 'Approved',
      requestedOn: '2026-02-08',
    },
  ]);

  const handleOpenAssetModal = (asset = null) => {
    if (asset) {
      setAssetForm(asset);
      setEditingAsset(asset.id);
    } else {
      setAssetForm({ name: '', capacity: '', charges: '', bookingRules: '', description: '' });
      setEditingAsset(null);
    }
    setShowAssetModal(true);
  };

  const handleAssetChange = (field, value) => {
    setAssetForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAsset = () => {
    if (!assetForm.name || !assetForm.capacity) {
      alert('Please fill required fields');
      return;
    }
    if (editingAsset) {
      setAssets((prev) =>
        prev.map((a) => (a.id === editingAsset ? { ...assetForm, id: editingAsset } : a))
      );
      alert('Asset updated successfully!');
    } else {
      setAssets((prev) => [...prev, { ...assetForm, id: Date.now() }]);
      alert('Asset created successfully!');
    }
    setShowAssetModal(false);
  };

  const handleDeleteAsset = (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      alert('Asset deleted successfully!');
    }
  };

  const handleApproveBooking = (id) => {
    console.log('Booking approved:', id);
    alert('Booking approved! Resident will be notified.');
  };

  const handleRejectBooking = (id) => {
    console.log('Booking rejected:', id);
    alert('Booking rejected! Resident will be notified.');
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      Approved: 'status-approved',
      Pending: 'status-pending',
      Rejected: 'status-rejected',
    };
    return <span className={`status-badge ${statusClass[status]}`}>{status}</span>;
  };

  return (
    <div className="admin-asset-booking-page">
      <PageHeader
        title="Assets & Bookings"
        subtitle="Manage community assets and approve booking requests"
      />

      {/* Tab Navigation */}
      <div className="booking-tabs">
        <button
          className={`tab-btn ${activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => setActiveTab('assets')}
        >
          🏢 Manage Assets
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📋 Booking Requests ({bookingRequests.filter((b) => b.status === 'Pending').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 Booking History
        </button>
      </div>

      {/* Manage Assets */}
      {activeTab === 'assets' && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Community Assets</h3>
            <button
              className="btn-primary"
              onClick={() => handleOpenAssetModal()}
            >
              <Plus size={16} /> Add New Asset
            </button>
          </div>

          <div className="assets-table-wrapper">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Capacity</th>
                  <th>Charges</th>
                  <th>Booking Rules</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <strong>{asset.name}</strong>
                    </td>
                    <td>{asset.capacity} persons</td>
                    <td>₹{asset.charges}/hour</td>
                    <td>{asset.bookingRules || '-'}</td>
                    <td>{asset.description || '-'}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOpenAssetModal(asset)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteAsset(asset.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Requests */}
      {activeTab === 'requests' && (
        <div className="admin-section">
          <h3>Pending Booking Requests</h3>

          {bookingRequests.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} />
              <p>No booking requests</p>
            </div>
          ) : (
            <div className="requests-list">
              {bookingRequests.map((request) => (
                <div
                  key={request.id}
                  className={`request-card ${request.status === 'Pending' ? 'pending' : ''}`}
                >
                  <div className="request-info">
                    <h4>{request.assetName}</h4>
                    <p>
                      <strong>Resident:</strong> {request.resident}
                    </p>
                    <p>
                      <Calendar size={14} /> {request.date}
                    </p>
                    <p>
                      <Clock size={14} /> {request.timeSlot}
                    </p>
                    <p>
                      <strong>Purpose:</strong> {request.purpose}
                    </p>
                    <p className="requested-on">Requested on: {request.requestedOn}</p>
                  </div>

                  <div className="request-actions">
                    {getStatusBadge(request.status)}
                    {request.status === 'Pending' && (
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => handleApproveBooking(request.id)}
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleRejectBooking(request.id)}
                        >
                          <X size={16} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking History */}
      {activeTab === 'history' && (
        <div className="admin-section">
          <h3>All Bookings (History)</h3>
          <div className="requests-list">
            {bookingRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-info">
                  <h4>{request.assetName}</h4>
                  <p>
                    <strong>Resident:</strong> {request.resident}
                  </p>
                  <p>
                    <Calendar size={14} /> {request.date}
                  </p>
                  <p>
                    <Clock size={14} /> {request.timeSlot}
                  </p>
                  <p>
                    <strong>Purpose:</strong> {request.purpose}
                  </p>
                </div>
                <div className="request-status">{getStatusBadge(request.status)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asset Modal */}
      {showAssetModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>{editingAsset ? 'Edit Asset' : 'Create New Asset'}</h2>
              <button className="close-btn" onClick={() => setShowAssetModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Asset Name *</label>
                <input
                  type="text"
                  value={assetForm.name}
                  onChange={(e) => handleAssetChange('name', e.target.value)}
                  placeholder="e.g., Clubhouse, Community Hall"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity (persons) *</label>
                  <input
                    type="number"
                    value={assetForm.capacity}
                    onChange={(e) => handleAssetChange('capacity', e.target.value)}
                    placeholder="e.g., 50"
                  />
                </div>
                <div className="form-group">
                  <label>Charges (₹/hour)</label>
                  <input
                    type="number"
                    value={assetForm.charges}
                    onChange={(e) => handleAssetChange('charges', e.target.value)}
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Booking Rules</label>
                <input
                  type="text"
                  value={assetForm.bookingRules}
                  onChange={(e) => handleAssetChange('bookingRules', e.target.value)}
                  placeholder="e.g., Max 3 hours per day, Only on weekends"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={assetForm.description}
                  onChange={(e) => handleAssetChange('description', e.target.value)}
                  placeholder="Describe the asset..."
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAssetModal(false)}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleSaveAsset}>
                {editingAsset ? 'Update Asset' : 'Create Asset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssetBooking;
