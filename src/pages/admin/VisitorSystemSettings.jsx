import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { Button, Card } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import {
  subscribeToVisitorSettings,
  updateVisitorSettings,
} from '../../firebase/visitorService';

const VisitorSystemSettings = () => {
  const toast = useToast();
  const { user } = useAuth();
  const role = user?.role || '';
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToVisitorSettings(setSettings);
    return () => unsubscribe && unsubscribe();
  }, []);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const updated = await updateVisitorSettings({
        society_name: settings.society_name,
        require_resident_approval: settings.require_resident_approval,
        enable_qr_pass: settings.enable_qr_pass,
        enable_photo_capture: settings.enable_photo_capture,
        enable_vehicle_tracking: settings.enable_vehicle_tracking,
        enable_otp_verification: settings.enable_otp_verification,
        allow_walkin_visitors: settings.allow_walkin_visitors,
        auto_approve_delivery: settings.auto_approve_delivery,
        max_visitors_per_flat: Number(settings.max_visitors_per_flat || 0),
        visitor_pass_expiry_hours: Number(settings.visitor_pass_expiry_hours || 0),
      });
      setSettings(updated);
      toast.success('Visitor system settings updated.');
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (role !== 'admin') {
    return <Card><div style={{ padding: 20 }}>Unauthorized: admin role required.</div></Card>;
  }

  return (
    <div>
      <PageHeader title="Visitor System Settings" subtitle="Admin control panel for visitor policies" />
      {!settings ? (
        <Card><div style={{ padding: 20 }}>Loading settings...</div></Card>
      ) : (
        <Card>
          <div style={{ padding: 20, display: 'grid', gap: 14 }}>
            <div className="form-group"><label>Society Name</label><input value={settings.society_name} onChange={(e) => setSettings((p) => ({ ...p, society_name: e.target.value }))} /></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['require_resident_approval', 'Require Resident Approval'],
                ['enable_qr_pass', 'QR Visitor Pass'],
                ['enable_photo_capture', 'Photo Capture'],
                ['enable_vehicle_tracking', 'Vehicle Tracking'],
                ['enable_otp_verification', 'OTP Verification'],
                ['allow_walkin_visitors', 'Allow Walk-in Visitors'],
                ['auto_approve_delivery', 'Auto Approve Delivery'],
              ].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                  <input type="checkbox" checked={Boolean(settings[key])} onChange={() => toggle(key)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label>Max Visitors Per Flat</label>
                <input type="number" min="1" value={settings.max_visitors_per_flat} onChange={(e) => setSettings((p) => ({ ...p, max_visitors_per_flat: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Visitor Pass Expiry Hours</label>
                <input type="number" min="1" value={settings.visitor_pass_expiry_hours} onChange={(e) => setSettings((p) => ({ ...p, visitor_pass_expiry_hours: e.target.value }))} />
              </div>
            </div>

            <div>
              <Button variant="primary" onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VisitorSystemSettings;
