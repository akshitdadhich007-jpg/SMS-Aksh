import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { 
    AlertTriangle, Ambulance, Flame, ShieldAlert, Phone, MapPin, 
    Clock, CheckCircle, Radio, Megaphone, User, Activity, Siren, 
    Stethoscope, PhoneCall, Edit2
} from 'lucide-react';

const EmergencyManagement = () => {
    // Mock Data
    const [stats] = useState({
        activeSOS: 3,
        medical: 1,
        fire: 0,
        security: 2
    });

    const [alerts, setAlerts] = useState([
        { id: 'SOS-2026-89', type: 'Medical', reporter: 'Sarah Jenkins (B-402)', location: 'Tower B, 4th Floor', time: '10:42 AM', status: 'Active' },
        { id: 'SOS-2026-88', type: 'Security', reporter: 'Guard Post 1', location: 'Main Gate', time: '09:15 AM', status: 'Resolved' },
        { id: 'SOS-2026-87', type: 'Fire', reporter: 'System Sensor', location: 'Basement Parking', time: 'Yesterday', status: 'Resolved' },
        { id: 'SOS-2026-86', type: 'Medical', reporter: 'Rajiv Malhotra (A-101)', location: 'Clubhouse', time: 'Yesterday', status: 'Resolved' },
        { id: 'SOS-2026-85', type: 'Security', reporter: 'Anonymous', location: 'Park Area', time: '2 days ago', status: 'Resolved' },
    ]);

    const [contacts] = useState([
        { name: 'Ambulance', number: '108', type: 'Medical', icon: Ambulance, color: '#ef4444' },
        { name: 'Fire Brigade', number: '101', type: 'Fire', icon: Flame, color: '#f97316' },
        { name: 'Police Station', number: '100', type: 'Security', icon: ShieldAlert, color: '#3b82f6' },
        { name: 'City Hospital', number: '022-2456-7890', type: 'Medical', icon: Stethoscope, color: '#ef4444' },
        { name: 'Main Gate Security', number: '+91 98765 43210', type: 'Security', icon: User, color: '#6b7280' },
        { name: 'Electrician', number: '+91 98765 43211', type: 'Maintenance', icon: Activity, color: '#f59e0b' },
    ]);

    const [broadcastMessage, setBroadcastMessage] = useState('');

    const handleResolve = (id) => {
        if(window.confirm('Mark this alert as resolved?')) {
            setAlerts(prev => prev.map(a => a.id === id ? {...a, status: 'Resolved'} : a));
        }
    };

    // Styles matching ComplaintManagement
    const styles = {
        pageContainer: {
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            padding: '0 24px',
        },
        headerSection: {
            marginBottom: '32px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '32px'
        },
        statCard: {
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '140px',
            position: 'relative',
            overflow: 'hidden',
            gap: '12px'
        },
        statHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        statLabel: {
            color: '#6b7280',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            margin: 0,
            lineHeight: 1
        },
        iconBox: (color) => ({
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }),
        mainContentGrid: {
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
            alignItems: 'start'
        },
        sectionCard: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
        },
        sectionHeader: {
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f9fafb'
        },
        sectionTitle: {
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        contactItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid #f3f4f6',
            transition: 'background-color 0.2s'
        },
        broadcastPanel: {
            padding: '24px',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '12px',
            marginTop: '24px'
        }
    };

    return (
        <div className="emergency-page" style={styles.pageContainer}>
            {/* Header */}
            <div style={styles.headerSection}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#111827' }}>Emergency Control Center</h1>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Real-time monitoring and rapid response dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid" style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={styles.iconBox('#ef4444')}><Siren size={24} /></div>
                        <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', backgroundColor: '#fef2f2', padding: '2px 8px', borderRadius: '10px' }}>URGENT</span>
                    </div>
                    <div>
                        <span style={styles.statLabel}>Active SOS</span>
                        <h3 style={styles.statValue}>{stats.activeSOS}</h3>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={styles.iconBox('#3b82f6')}><Stethoscope size={24} /></div>
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Today</span>
                    </div>
                    <div>
                        <span style={styles.statLabel}>Medical</span>
                        <h3 style={styles.statValue}>{stats.medical}</h3>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={styles.iconBox('#f97316')}><Flame size={24} /></div>
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>This Month</span>
                    </div>
                    <div>
                        <span style={styles.statLabel}>Fire Alerts</span>
                        <h3 style={styles.statValue}>{stats.fire}</h3>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={styles.iconBox('#6366f1')}><ShieldAlert size={24} /></div>
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Active Patrols</span>
                    </div>
                    <div>
                        <span style={styles.statLabel}>Security</span>
                        <h3 style={styles.statValue}>{stats.security}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="emergency-content-grid" style={styles.mainContentGrid}>
                
                {/* Left Column: Live Alerts */}
                <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                        <h3 style={styles.sectionTitle}>
                            <Radio size={18} className="animate-pulse text-red-500" />
                            Live Emergency Feed
                        </h3>
                        <Button variant="outline" size="sm">Download Report</Button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <tr>
                                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Alert ID</th>
                                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Type</th>
                                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Reported By</th>
                                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Location</th>
                                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Time</th>
                                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '16px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.map((alert) => (
                                    <tr key={alert.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '16px', fontWeight: '500' }}>{alert.id}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ 
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                                                backgroundColor: alert.type === 'Medical' ? '#eff6ff' : alert.type === 'Fire' ? '#fff7ed' : '#fef2f2',
                                                color: alert.type === 'Medical' ? '#1d4ed8' : alert.type === 'Fire' ? '#c2410c' : '#b91c1c'
                                            }}>
                                                {alert.type === 'Medical' && <Activity size={12} />}
                                                {alert.type === 'Fire' && <Flame size={12} />}
                                                {alert.type === 'Security' && <ShieldAlert size={12} />}
                                                {alert.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', color: '#374151' }}>{alert.reporter}</td>
                                        <td style={{ padding: '16px', color: '#4b5563' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={14} /> {alert.location}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#6b7280', fontSize: '13px' }}>{alert.time}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ 
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                                                backgroundColor: alert.status === 'Active' ? '#fef2f2' : '#ecfdf5',
                                                color: alert.status === 'Active' ? '#ef4444' : '#10b981',
                                                border: `1px solid ${alert.status === 'Active' ? '#fecaca' : '#a7f3d0'}`
                                            }}>
                                                {alert.status === 'Active' && <span className="animate-pulse">●</span>}
                                                {alert.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            {alert.status === 'Active' && (
                                                <Button 
                                                    style={{ fontSize: '12px', padding: '6px 12px', height: 'auto', backgroundColor: '#10b981', borderColor: '#10b981', color: 'white' }}
                                                    onClick={() => handleResolve(alert.id)}
                                                >
                                                    Mark Resolved
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Contacts + Broadcast */}
                <div>
                    {/* Emergency Contacts */}
                    <div style={styles.sectionCard}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}><PhoneCall size={18} /> Quick Contacts</h3>
                            <Button variant="ghost" style={{ padding: '4px' }}><Edit2 size={16} /></Button>
                        </div>
                        <div>
                            {contacts.map((contact, index) => (
                                <div key={index} style={styles.contactItem}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ 
                                            width: '40px', height: '40px', borderRadius: '8px', 
                                            backgroundColor: `${contact.color}15`, color: contact.color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <contact.icon size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>{contact.name}</div>
                                            <div style={{ color: '#6b7280', fontSize: '13px' }}>{contact.number}</div>
                                        </div>
                                    </div>
                                    <Button size="sm" style={{ padding: '6px 10px', height: '32px', borderRadius: '6px' }}>
                                        <Phone size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Broadcast Panel */}
                    <div style={styles.broadcastPanel}>
                        <h3 style={{ ...styles.sectionTitle, color: '#be123c', marginBottom: '16px' }}>
                            <Megaphone size={18} /> Broadcast Emergency Alert
                        </h3>
                        <div style={{ marginBottom: '16px' }}>
                            <textarea 
                                placeholder="Type emergency message here... This will be sent to all residents immediately."
                                style={{ 
                                    width: '100%', height: '100px', padding: '12px', borderRadius: '8px',
                                    border: '1px solid #fecdd3', resize: 'none', fontSize: '14px', outline: 'none'
                                }}
                                value={broadcastMessage}
                                onChange={(e) => setBroadcastMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#881337' }}>
                                    <input type="checkbox" defaultChecked /> Push Notif
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#881337' }}>
                                    <input type="checkbox" defaultChecked /> SMS
                                </label>
                            </div>
                            <Button style={{ backgroundColor: '#e11d48', border: 'none', color: 'white' }}>
                                Send Alert
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmergencyManagement;
