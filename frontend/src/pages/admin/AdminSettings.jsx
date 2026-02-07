import React, { useState } from 'react';
import {
  Building2, DollarSign, Zap, Users, Package2, Bell, DownloadCloud,
  Plus, Edit2, Trash2, ChevronDown
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SettingsTabs from '../../components/ui/SettingsTabs';
import Modal from '../../components/ui/Modal';
import './AdminSettings.css';

const AdminSettings = () => {
  // Society Profile State
  const [societyProfile, setSocietyProfile] = useState({
    name: 'Greenfield Residency',
    address: '123 Oak Street, Downtown City',
    blocks: '3 (A, B, C)',
    totalFlats: '90',
    registrationNo: 'REG-2020-001',
    email: 'admin@greenfield.com',
    phone: '+91-9876543210',
  });

  // Maintenance Settings State
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    monthlyAmount: '5000',
    dueDate: '5',
    lateFee: '500',
    autoBillGeneration: true,
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    enableOnlinePayments: true,
    upi: true,
    card: true,
    netBanking: true,
  });

  // Expense Categories State
  const [expenseCategories, setExpenseCategories] = useState([
    { id: 1, name: 'Security', budget: 15000 },
    { id: 2, name: 'Cleaning', budget: 8000 },
    { id: 3, name: 'Electricity', budget: 20000 },
    { id: 4, name: 'Water', budget: 12000 },
  ]);

  // Roles & Permissions State
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'Admin', permissions: ['All'] },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'Treasurer', permissions: ['Payments', 'Reports'] },
    { id: 3, name: 'Amit Patel', email: 'amit@example.com', role: 'Secretary', permissions: ['Announcements', 'Complaints'] },
  ]);

  // Lost & Found State
  const [lostFoundSettings, setLostFoundSettings] = useState({
    enableFeature: true,
    requireApproval: true,
    pinExpiry: '30',
    enableDisputes: true,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    maintenanceReminders: true,
    emergencyAlerts: true,
    complaintUpdates: true,
    announcementNotifications: true,
    billReminders: true,
    residentUpdates: true,
  });

  // Modal States
  const [modals, setModals] = useState({
    addExpense: false,
    editExpense: false,
    addRole: false,
    editRole: false,
  });

  const [currentEditingItem, setCurrentEditingItem] = useState(null);

  // Form States
  const [expenseForm, setExpenseForm] = useState({ name: '', budget: '' });
  const [roleForm, setRoleForm] = useState({ name: '', email: '', role: 'Admin', permissions: [] });

  // Handlers
  const handleSocietyProfile = (key, value) => {
    setSocietyProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleMaintenanceChange = (key, value) => {
    setMaintenanceSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePaymentChange = (key) => {
    setPaymentSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const openAddExpenseModal = () => {
    setExpenseForm({ name: '', budget: '' });
    setCurrentEditingItem(null);
    setModals(prev => ({ ...prev, addExpense: true }));
  };

  const openEditExpenseModal = (expense) => {
    setExpenseForm({ name: expense.name, budget: expense.budget });
    setCurrentEditingItem(expense);
    setModals(prev => ({ ...prev, editExpense: true }));
  };

  const saveExpense = () => {
    if (currentEditingItem) {
      setExpenseCategories(prev => prev.map(cat =>
        cat.id === currentEditingItem.id ? { ...cat, name: expenseForm.name, budget: parseInt(expenseForm.budget) } : cat
      ));
      setModals(prev => ({ ...prev, editExpense: false }));
    } else {
      const newExpense = {
        id: Math.max(...expenseCategories.map(c => c.id), 0) + 1,
        name: expenseForm.name,
        budget: parseInt(expenseForm.budget),
      };
      setExpenseCategories(prev => [...prev, newExpense]);
      setModals(prev => ({ ...prev, addExpense: false }));
    }
  };

  const deleteExpense = (id) => {
    setExpenseCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLostFoundChange = (key) => {
    setLostFoundSettings(prev => {
      if (typeof prev[key] === 'boolean') {
        return { ...prev, [key]: !prev[key] };
      }
      return prev;
    });
  };

  const tabs = [
    {
      label: 'Society Profile',
      icon: <Building2 size={18} />,
      content: (
        <div>
          <h2>Society Information</h2>
          <div className="settings-form-grid">
            <div>
              <label className="settings-label">Society Name *</label>
              <input
                type="text"
                className="settings-input"
                value={societyProfile.name}
                onChange={(e) => handleSocietyProfile('name', e.target.value)}
              />
            </div>
            <div>
              <label className="settings-label">Registration No. *</label>
              <input
                type="text"
                className="settings-input"
                value={societyProfile.registrationNo}
                onChange={(e) => handleSocietyProfile('registrationNo', e.target.value)}
              />
            </div>
            <div className="grid-full">
              <label className="settings-label">Address *</label>
              <input
                type="text"
                className="settings-input"
                value={societyProfile.address}
                onChange={(e) => handleSocietyProfile('address', e.target.value)}
              />
            </div>
            <div>
              <label className="settings-label">Blocks/Wings</label>
              <input
                type="text"
                className="settings-input"
                value={societyProfile.blocks}
                onChange={(e) => handleSocietyProfile('blocks', e.target.value)}
                placeholder="e.g., 3 (A, B, C)"
              />
            </div>
            <div>
              <label className="settings-label">Total Flats</label>
              <input
                type="number"
                className="settings-input"
                value={societyProfile.totalFlats}
                onChange={(e) => handleSocietyProfile('totalFlats', e.target.value)}
              />
            </div>
            <div>
              <label className="settings-label">Contact Email *</label>
              <input
                type="email"
                className="settings-input"
                value={societyProfile.email}
                onChange={(e) => handleSocietyProfile('email', e.target.value)}
              />
            </div>
            <div>
              <label className="settings-label">Contact Phone *</label>
              <input
                type="tel"
                className="settings-input"
                value={societyProfile.phone}
                onChange={(e) => handleSocietyProfile('phone', e.target.value)}
              />
            </div>
          </div>
          <div className="settings-button-group">
            <button className="settings-button settings-button-primary">
              Save Society Profile
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Maintenance',
      icon: <DollarSign size={18} />,
      content: (
        <div>
          <h2>Maintenance Settings</h2>
          <div className="settings-form-grid">
            <div>
              <label className="settings-label">Monthly Amount (₹) *</label>
              <input
                type="number"
                className="settings-input"
                value={maintenanceSettings.monthlyAmount}
                onChange={(e) => handleMaintenanceChange('monthlyAmount', e.target.value)}
              />
            </div>
            <div>
              <label className="settings-label">Due Date (Day of Month) *</label>
              <input
                type="number"
                className="settings-input"
                value={maintenanceSettings.dueDate}
                onChange={(e) => handleMaintenanceChange('dueDate', e.target.value)}
                min="1"
                max="31"
              />
            </div>
            <div>
              <label className="settings-label">Late Fee (₹)</label>
              <input
                type="number"
                className="settings-input"
                value={maintenanceSettings.lateFee}
                onChange={(e) => handleMaintenanceChange('lateFee', e.target.value)}
              />
            </div>
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Auto Bill Generation</h3>
              <p>Automatically generate maintenance bills each month</p>
            </div>
            <button
              className={`toggle-switch ${maintenanceSettings.autoBillGeneration ? 'active' : ''}`}
              onClick={() => handleMaintenanceChange('autoBillGeneration', !maintenanceSettings.autoBillGeneration)}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
          <div className="settings-button-group">
            <button className="settings-button settings-button-primary">
              Save Maintenance Settings
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Payments',
      icon: <DollarSign size={18} />,
      content: (
        <div>
          <h2>Payment Configuration</h2>
          <div className="settings-alert settings-alert-info">
            <span>ℹ️</span>
            <span>Configure online payment methods available to residents</span>
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Enable Online Payments</h3>
              <p>Allow residents to pay bills online</p>
            </div>
            <button
              className={`toggle-switch ${paymentSettings.enableOnlinePayments ? 'active' : ''}`}
              onClick={() => handlePaymentChange('enableOnlinePayments')}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
          {paymentSettings.enableOnlinePayments && (
            <>
              <div className="settings-divider"></div>
              <h3 style={{ marginTop: 0 }}>Available Payment Methods</h3>
              <div className="settings-item">
                <div className="setting-info">
                  <h3>UPI</h3>
                  <p>Google Pay, PhonePe, PayTM, etc.</p>
                </div>
                <input
                  type="checkbox"
                  className="settings-checkbox"
                  checked={paymentSettings.upi}
                  onChange={() => handlePaymentChange('upi')}
                />
              </div>
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Credit/Debit Card</h3>
                  <p>Visa, Mastercard, RuPay</p>
                </div>
                <input
                  type="checkbox"
                  className="settings-checkbox"
                  checked={paymentSettings.card}
                  onChange={() => handlePaymentChange('card')}
                />
              </div>
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Net Banking</h3>
                  <p>All major Indian banks</p>
                </div>
                <input
                  type="checkbox"
                  className="settings-checkbox"
                  checked={paymentSettings.netBanking}
                  onChange={() => handlePaymentChange('netBanking')}
                />
              </div>
            </>
          )}
          <div className="settings-button-group">
            <button className="settings-button settings-button-primary">
              Save Payment Settings
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Expenses',
      icon: <Zap size={18} />,
      content: (
        <div>
          <h2>Expense Categories</h2>
          <div className="settings-alert settings-alert-info">
            <span>ℹ️</span>
            <span>Manage categories for society expenses and set monthly budgets</span>
          </div>
          <div className="expense-table-wrapper">
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Monthly Budget</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenseCategories.map(category => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>₹{category.budget.toLocaleString()}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => openEditExpenseModal(category)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteExpense(category.id)}
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
          <button
            className="settings-button settings-button-primary"
            onClick={openAddExpenseModal}
            style={{ marginTop: '16px' }}
          >
            <Plus size={16} style={{ marginRight: '6px' }} />
            Add Category
          </button>
        </div>
      ),
    },
    {
      label: 'Roles',
      icon: <Users size={18} />,
      content: (
        <div>
          <h2>Roles & Permissions</h2>
          <div className="settings-alert settings-alert-info">
            <span>ℹ️</span>
            <span>Manage admin users and their permissions</span>
          </div>
          <div className="roles-table-wrapper">
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.permissions.join(', ')}</td>
                    <td>
                      <button className="action-btn edit-btn" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete-btn" title="Remove">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="settings-button settings-button-primary" style={{ marginTop: '16px' }}>
            <Plus size={16} style={{ marginRight: '6px' }} />
            Add Admin User
          </button>
        </div>
      ),
    },
    {
      label: 'Lost & Found',
      icon: <Package2 size={18} />,
      content: (
        <div>
          <h2>Lost & Found Settings</h2>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Enable Lost & Found Feature</h3>
              <p>Allow residents to post lost or found items</p>
            </div>
            <button
              className={`toggle-switch ${lostFoundSettings.enableFeature ? 'active' : ''}`}
              onClick={() => handleLostFoundChange('enableFeature')}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
          {lostFoundSettings.enableFeature && (
            <>
              <div className="settings-divider"></div>
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Require Claim Approval</h3>
                  <p>Admin must approve items before claiming</p>
                </div>
                <input
                  type="checkbox"
                  className="settings-checkbox"
                  checked={lostFoundSettings.requireApproval}
                  onChange={() => handleLostFoundChange('requireApproval')}
                />
              </div>
              <div className="settings-item">
                <div className="setting-info">
                  <h3>Enable Dispute Handling</h3>
                  <p>Allow dispute resolution for claimed items</p>
                </div>
                <input
                  type="checkbox"
                  className="settings-checkbox"
                  checked={lostFoundSettings.enableDisputes}
                  onChange={() => handleLostFoundChange('enableDisputes')}
                />
              </div>
              <div>
                <label className="settings-label">PIN Expiry (Days)</label>
                <input
                  type="number"
                  className="settings-input"
                  value={lostFoundSettings.pinExpiry}
                  onChange={(e) => setLostFoundSettings(prev => ({ ...prev, pinExpiry: e.target.value }))}
                  min="1"
                />
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  PIN code for item claim expires after this many days
                </p>
              </div>
            </>
          )}
          <div className="settings-button-group">
            <button className="settings-button settings-button-primary">
              Save Lost & Found Settings
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Notifications',
      icon: <Bell size={18} />,
      content: (
        <div>
          <h2>Alert Preferences</h2>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Maintenance Reminders</h3>
              <p>Send reminder emails before maintenance due date</p>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={notificationSettings.maintenanceReminders}
              onChange={() => handleNotificationChange('maintenanceReminders')}
            />
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Emergency Alerts</h3>
              <p>Receive critical emergency notifications</p>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={notificationSettings.emergencyAlerts}
              onChange={() => handleNotificationChange('emergencyAlerts')}
            />
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Complaint Updates</h3>
              <p>Get notified about new complaints and resolutions</p>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={notificationSettings.complaintUpdates}
              onChange={() => handleNotificationChange('complaintUpdates')}
            />
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Announcement Notifications</h3>
              <p>Notify about new announcements posted</p>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={notificationSettings.announcementNotifications}
              onChange={() => handleNotificationChange('announcementNotifications')}
            />
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Bill Reminders</h3>
              <p>Send payment reminders to residents</p>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={notificationSettings.billReminders}
              onChange={() => handleNotificationChange('billReminders')}
            />
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Resident Updates</h3>
              <p>Notify about resident registrations and changes</p>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={notificationSettings.residentUpdates}
              onChange={() => handleNotificationChange('residentUpdates')}
            />
          </div>
        </div>
      ),
    },
    {
      label: 'Reports',
      icon: <DownloadCloud size={18} />,
      content: (
        <div>
          <h2>Reports & Data Export</h2>
          <div className="settings-alert settings-alert-info">
            <span>ℹ️</span>
            <span>Download financial reports and resident data for analysis and record keeping</span>
          </div>
          <div className="reports-section">
            <h3>Financial Reports</h3>
            <div className="report-grid">
              <button className="report-btn">
                <DownloadCloud size={20} />
                <span>Maintenance Collection Report</span>
              </button>
              <button className="report-btn">
                <DownloadCloud size={20} />
                <span>Expense Report</span>
              </button>
              <button className="report-btn">
                <DownloadCloud size={20} />
                <span>Payment Summary</span>
              </button>
              <button className="report-btn">
                <DownloadCloud size={20} />
                <span>Outstanding Dues</span>
              </button>
            </div>
          </div>
          <div className="reports-section">
            <h3>Data Export</h3>
            <div className="report-grid">
              <button className="report-btn">
                <DownloadCloud size={20} />
                <span>Export All Residents</span>
              </button>
              <button className="report-btn">
                <DownloadCloud size={20} />
                <span>Export Complaints</span>
              </button>
              <button className="report-btn">
                <DownloadCloud size={20} />
                <span>Export Announcements</span>
              </button>
              <button className="report-btn">
                <DownloadCloud size={20} />
                <span>Export Vehicles & Visitors</span>
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Appearance',
      icon: <span style={{ fontSize: '16px' }}>🎨</span>,
    },
  ];

  return (
    <div className="admin-settings-page">
      <PageHeader 
        title="Settings" 
        subtitle="Manage all system configurations, society profile, and administrator permissions"
      />
      <div className="settings-wrapper">
        <SettingsTabs tabs={tabs} />
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={modals.addExpense}
        title="Add Expense Category"
        onClose={() => setModals(prev => ({ ...prev, addExpense: false }))}
      >
        <div className="modal-form">
          <div>
            <label className="settings-label">Category Name *</label>
            <input
              type="text"
              className="settings-input"
              value={expenseForm.name}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Security"
            />
          </div>
          <div>
            <label className="settings-label">Monthly Budget (₹) *</label>
            <input
              type="number"
              className="settings-input"
              value={expenseForm.budget}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div className="settings-button-group" style={{ marginTop: '20px' }}>
            <button className="settings-button settings-button-primary" onClick={saveExpense}>
              Add Category
            </button>
            <button
              className="settings-button settings-button-secondary"
              onClick={() => setModals(prev => ({ ...prev, addExpense: false }))}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={modals.editExpense}
        title="Edit Expense Category"
        onClose={() => setModals(prev => ({ ...prev, editExpense: false }))}
      >
        <div className="modal-form">
          <div>
            <label className="settings-label">Category Name *</label>
            <input
              type="text"
              className="settings-input"
              value={expenseForm.name}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="settings-label">Monthly Budget (₹) *</label>
            <input
              type="number"
              className="settings-input"
              value={expenseForm.budget}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, budget: e.target.value }))}
            />
          </div>
          <div className="settings-button-group" style={{ marginTop: '20px' }}>
            <button className="settings-button settings-button-primary" onClick={saveExpense}>
              Save Changes
            </button>
            <button
              className="settings-button settings-button-secondary"
              onClick={() => setModals(prev => ({ ...prev, editExpense: false }))}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSettings;
