import { db } from './config';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';

const COLLECTION = 'app_settings';

const defaultAdminSettings = {
  societyProfile: {
    name: '',
    address: '',
    blocks: '',
    totalFlats: '0',
    registrationNo: '',
    email: '',
    phone: '',
  },
  maintenanceSettings: {
    monthlyAmount: '0',
    dueDate: '1',
    lateFee: '0',
    autoBillGeneration: false,
  },
  paymentSettings: {
    enableOnlinePayments: false,
    upi: false,
    card: false,
    netBanking: false,
  },
  expenseCategories: [],
  adminUsers: [],
  lostFoundSettings: {
    enableFeature: false,
    requireApproval: false,
    enableDisputes: false,
  },
  notificationSettings: {
    maintenanceReminders: false,
    emergencyAlerts: false,
    complaintUpdates: false,
    announcementNotifications: false,
    billReminders: false,
    residentUpdates: false,
  },
};

const defaultResidentSettings = {
  profileData: {
    name: '',
    phone: '',
    email: '',
    flatNo: '',
  },
  notificationSettings: {
    maintenanceNotifications: true,
    complaintUpdates: true,
    announcementNotifications: true,
  },
  paymentPreferences: {
    defaultPaymentMode: 'upi',
    autoReminder: true,
  },
  securityData: {
    lastPasswordChange: '',
    lastLogin: '',
  },
};

const defaultSecuritySettings = {
  profileData: {
    name: '',
    shiftStart: '08:00',
    shiftEnd: '20:00',
    contact: '',
  },
  accessControls: {
    visitorEntry: true,
    vehicleEntry: true,
    deliveryEntry: true,
  },
  alertSettings: {
    emergencySound: true,
    nightMode: false,
  },
};

const mergeWithDefaults = (defaults, value) => ({
  ...defaults,
  ...(value || {}),
});

export const subscribeAdminSettings = (societyId, callback) => {
  if (!societyId) {
    callback(defaultAdminSettings);
    return () => {};
  }

  const ref = doc(db, COLLECTION, `admin_${societyId}`);
  return onSnapshot(ref, (snapshot) => {
    if (!snapshot.exists()) {
      callback(defaultAdminSettings);
      return;
    }

    const data = snapshot.data();
    callback({
      societyProfile: mergeWithDefaults(defaultAdminSettings.societyProfile, data.societyProfile),
      maintenanceSettings: mergeWithDefaults(defaultAdminSettings.maintenanceSettings, data.maintenanceSettings),
      paymentSettings: mergeWithDefaults(defaultAdminSettings.paymentSettings, data.paymentSettings),
      expenseCategories: Array.isArray(data.expenseCategories) ? data.expenseCategories : [],
      adminUsers: Array.isArray(data.adminUsers) ? data.adminUsers : [],
      lostFoundSettings: mergeWithDefaults(defaultAdminSettings.lostFoundSettings, data.lostFoundSettings),
      notificationSettings: mergeWithDefaults(defaultAdminSettings.notificationSettings, data.notificationSettings),
    });
  }, () => callback(defaultAdminSettings));
};

export const saveAdminSettings = (societyId, updates) => {
  const ref = doc(db, COLLECTION, `admin_${societyId}`);
  return setDoc(ref, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
};

export const subscribeResidentSettings = (uid, callback) => {
  if (!uid) {
    callback(defaultResidentSettings);
    return () => {};
  }

  const ref = doc(db, COLLECTION, `resident_${uid}`);
  return onSnapshot(ref, (snapshot) => {
    if (!snapshot.exists()) {
      callback(defaultResidentSettings);
      return;
    }
    const data = snapshot.data();
    callback({
      profileData: mergeWithDefaults(defaultResidentSettings.profileData, data.profileData),
      notificationSettings: mergeWithDefaults(defaultResidentSettings.notificationSettings, data.notificationSettings),
      paymentPreferences: mergeWithDefaults(defaultResidentSettings.paymentPreferences, data.paymentPreferences),
      securityData: mergeWithDefaults(defaultResidentSettings.securityData, data.securityData),
    });
  }, () => callback(defaultResidentSettings));
};

export const saveResidentSettings = (uid, updates) => {
  const ref = doc(db, COLLECTION, `resident_${uid}`);
  return setDoc(ref, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
};

export const subscribeSecuritySettings = (uid, callback) => {
  if (!uid) {
    callback(defaultSecuritySettings);
    return () => {};
  }

  const ref = doc(db, COLLECTION, `security_${uid}`);
  return onSnapshot(ref, (snapshot) => {
    if (!snapshot.exists()) {
      callback(defaultSecuritySettings);
      return;
    }
    const data = snapshot.data();
    callback({
      profileData: mergeWithDefaults(defaultSecuritySettings.profileData, data.profileData),
      accessControls: mergeWithDefaults(defaultSecuritySettings.accessControls, data.accessControls),
      alertSettings: mergeWithDefaults(defaultSecuritySettings.alertSettings, data.alertSettings),
    });
  }, () => callback(defaultSecuritySettings));
};

export const saveSecuritySettings = (uid, updates) => {
  const ref = doc(db, COLLECTION, `security_${uid}`);
  return setDoc(ref, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
};
