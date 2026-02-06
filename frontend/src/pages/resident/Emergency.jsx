import React from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { Phone, Shield, User, Flame, HeartPulse, Siren } from 'lucide-react';

const Emergency = () => {
    return (
        <>
            <PageHeader title="Emergency Contacts" subtitle="Quick access to important numbers" />

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Society Emergency */}
                <Card className="card-highlight" style={{ borderColor: 'var(--warning)', background: '#fffbeb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '50%', color: '#d97706' }}>
                            <Shield size={28} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#92400e' }}>Main Gate Security</h3>
                            <div style={{ fontSize: '14px', color: '#b45309', marginTop: '4px' }}>24/7 Available</div>
                        </div>
                    </div>
                    <a href="tel:+919876543210" style={{ textDecoration: 'none' }}>
                        <Button style={{ width: '100%', background: '#d97706', border: 'none', display: 'flex', gap: '8px', justifyContent: 'center', padding: '12px' }}>
                            <Phone size={18} /> Call Now
                        </Button>
                    </a>
                    <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>+91 98765 43210</div>
                </Card>

                {/* Society Office */}
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ padding: '12px', background: 'var(--bg-light)', borderRadius: '50%', color: 'var(--brand-blue)' }}>
                            <User size={28} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>Society Manager</h3>
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>9:00 AM - 6:00 PM</div>
                        </div>
                    </div>
                    <a href="tel:+919876543211" style={{ textDecoration: 'none' }}>
                        <Button variant="secondary" style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center', padding: '12px' }}>
                            <Phone size={18} /> Call Manager
                        </Button>
                    </a>
                    <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>+91 98765 43211</div>
                </Card>

                {/* Local Services */}
                <Card>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Local Emergency Services</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Siren size={20} color="#dc2626" />
                                <span style={{ fontWeight: '600' }}>Police</span>
                            </div>
                            <a href="tel:100" style={{ color: '#dc2626', fontWeight: '700', textDecoration: 'none', fontSize: '16px' }}>100</a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Flame size={20} color="#ea580c" />
                                <span style={{ fontWeight: '600' }}>Fire Brigade</span>
                            </div>
                            <a href="tel:101" style={{ color: '#ea580c', fontWeight: '700', textDecoration: 'none', fontSize: '16px' }}>101</a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <HeartPulse size={20} color="#db2777" />
                                <span style={{ fontWeight: '600' }}>Ambulance</span>
                            </div>
                            <a href="tel:102" style={{ color: '#db2777', fontWeight: '700', textDecoration: 'none', fontSize: '16px' }}>102</a>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Emergency;
