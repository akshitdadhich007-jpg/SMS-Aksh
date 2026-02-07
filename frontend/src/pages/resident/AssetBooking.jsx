import React, { useState } from 'react';
import { Calendar, Clock, Check, AlertCircle, Plus, X } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import './AssetBooking.css';

const AssetBooking = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('available');

  const [bookingForm, setBookingForm] = useState({
    assetId: '',
    date: '',
    timeSlot: '',
    duration: '2',
    purpose: '',
  });

  // Available assets
  const assets = [
    {
      id: 1,
      name: 'Clubhouse',
      icon: '🏛️',
      capacity: '50 persons',
      charges: '₹500/hour',
      description: 'Perfect for gatherings, celebrations, and community events',
    },
    {
      id: 2,
      name: 'Community Hall',
      icon: '🎪',
      capacity: '100 persons',
      charges: '₹800/hour',
      description: 'Large hall for weddings, seminars, and major events',
    },
    {
      id: 3,
      name: 'Gym',
      icon: '💪',
      capacity: '20 persons',
      charges: 'Free (included in maintenance)',
      description: 'Equipped gym facility for residents',
    },
    {
      id: 4,
      name: 'Guest Room',
      icon: '🛏️',
      capacity: '2 persons',
      charges: '₹300/night',
      description: 'Comfortable guest room for visitors',
    },
  ];

  // Mock bookings data
  const [upcomingBookings] = useState([
    {
      id: 1,
      assetName: 'Clubhouse',
      date: '2026-02-14',
      timeSlot: '6:00 PM - 8:00 PM',
      status: 'Approved',
      resident: 'You',
      purpose: 'Birthday Party',
    },
    {
      id: 2,
      assetName: 'Community Hall',
      date: '2026-02-20',
      timeSlot: '10:00 AM - 1:00 PM',
      status: 'Pending',
      resident: 'You',
      purpose: 'Wedding Reception',
    },
  ]);

  const [pastBookings] = useState([
    {
      id: 3,
      assetName: 'Gym',
      date: '2026-01-15',
      timeSlot: '6:00 AM - 7:00 AM',
      status: 'Completed',
      resident: 'You',
      purpose: 'Personal Use',
    },
    {
      id: 4,
      assetName: 'Guest Room',
      date: '2026-01-10',
      timeSlot: '1 Night',
      status: 'Completed',
      resident: 'You',
      purpose: 'Guest Stay',
    },
  ]);

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setBookingForm((prev) => ({ ...prev, assetId: asset.id }));
    setShowBookingModal(true);
  };

  const handleBookingChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitBooking = () => {
    if (!bookingForm.date || !bookingForm.timeSlot) {
      alert('Please select date and time slot');
      return;
    }
    console.log('Booking submitted:', bookingForm);
    alert('Booking request submitted! Awaiting admin approval.');
    setShowBookingModal(false);
    setBookingForm({ assetId: '', date: '', timeSlot: '', duration: '2', purpose: '' });
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      Approved: 'status-approved',
      Pending: 'status-pending',
      Rejected: 'status-rejected',
      Completed: 'status-completed',
    };
    return <span className={`status-badge ${statusClass[status]}`}>{status}</span>;
  };

  return (
    <div className="asset-booking-page">
      <PageHeader
        title="Asset Booking"
        subtitle="Book community assets like clubhouse, hall, gym, and guest room"
      />

      {/* Tab Navigation */}
      <div className="booking-tabs">
        <button
          className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          📦 Available Assets
        </button>
        <button
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          📅 Upcoming Bookings ({upcomingBookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          ✅ Past Bookings ({pastBookings.length})
        </button>
      </div>

      {/* Available Assets */}
      {activeTab === 'available' && (
        <div className="assets-grid">
          {assets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <div className="asset-icon">{asset.icon}</div>
              <h3>{asset.name}</h3>
              <p className="asset-capacity">👥 {asset.capacity}</p>
              <p className="asset-charges">💰 {asset.charges}</p>
              <p className="asset-description">{asset.description}</p>
              <button
                className="booking-btn"
                onClick={() => handleAssetSelect(asset)}
              >
                <Plus size={16} /> Request Booking
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Bookings */}
      {activeTab === 'upcoming' && (
        <div className="bookings-list">
          {upcomingBookings.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} />
              <p>No upcoming bookings</p>
            </div>
          ) : (
            upcomingBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <h4>{booking.assetName}</h4>
                  <p>
                    <Calendar size={16} /> {booking.date}
                  </p>
                  <p>
                    <Clock size={16} /> {booking.timeSlot}
                  </p>
                  <p className="purpose">Purpose: {booking.purpose}</p>
                </div>
                <div className="booking-status">{getStatusBadge(booking.status)}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Past Bookings */}
      {activeTab === 'past' && (
        <div className="bookings-list">
          {pastBookings.length === 0 ? (
            <div className="empty-state">
              <Check size={48} />
              <p>No past bookings</p>
            </div>
          ) : (
            pastBookings.map((booking) => (
              <div key={booking.id} className="booking-card past">
                <div className="booking-info">
                  <h4>{booking.assetName}</h4>
                  <p>
                    <Calendar size={16} /> {booking.date}
                  </p>
                  <p>
                    <Clock size={16} /> {booking.timeSlot}
                  </p>
                  <p className="purpose">Purpose: {booking.purpose}</p>
                </div>
                <div className="booking-status">{getStatusBadge(booking.status)}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedAsset && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Book {selectedAsset.name}</h2>
              <button className="close-btn" onClick={() => setShowBookingModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="asset-details">
                <p>
                  <strong>Capacity:</strong> {selectedAsset.capacity}
                </p>
                <p>
                  <strong>Charges:</strong> {selectedAsset.charges}
                </p>
              </div>

              <div className="form-group">
                <label>Select Date *</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => handleBookingChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Select Time Slot *</label>
                <select
                  value={bookingForm.timeSlot}
                  onChange={(e) => handleBookingChange('timeSlot', e.target.value)}
                >
                  <option value="">-- Select Time Slot --</option>
                  <option value="6:00 AM - 8:00 AM">6:00 AM - 8:00 AM</option>
                  <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                  <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                  <option value="8:00 PM - 10:00 PM">8:00 PM - 10:00 PM</option>
                </select>
              </div>

              <div className="form-group">
                <label>Purpose (Optional)</label>
                <textarea
                  value={bookingForm.purpose}
                  onChange={(e) => handleBookingChange('purpose', e.target.value)}
                  placeholder="e.g., Birthday party, wedding, meeting, etc."
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowBookingModal(false)}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleSubmitBooking}>
                <Plus size={16} /> Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetBooking;
