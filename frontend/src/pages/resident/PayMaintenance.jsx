import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { CreditCard, Landmark, Smartphone } from 'lucide-react';

const PayMaintenance = () => {
    const [selectedMethod, setSelectedMethod] = useState('UPI');
    const totalAmount = 2500; // Mock total amount

    const methods = [
        { id: 'UPI', label: 'UPI / GPay / PhonePe', sub: 'Instant payment, no extra charges', icon: <Smartphone size={24} className="text-blue-600" /> },
        { id: 'Card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: <CreditCard size={24} className="text-blue-600" /> },
        { id: 'NetBanking', label: 'Net Banking', sub: 'All major banks supported', icon: <Landmark size={24} className="text-blue-600" /> },
    ];

    return (
        <div className="max-w-3xl">
            <PageHeader title="Pay Maintenance" subtitle="Select a payment method to proceed" />

            <Card>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '24px',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: '24px'
                }}>
                    <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Total Payable</span>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--brand-dark)' }}>₹{totalAmount.toLocaleString()}</span>
                </div>

                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Select Payment Method</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    {methods.map((method) => (
                        <label
                            key={method.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '20px',
                                border: `1px solid ${selectedMethod === method.id ? 'var(--brand-blue)' : 'var(--border)'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                background: selectedMethod === method.id ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <input
                                type="radio"
                                name="method"
                                value={method.id}
                                checked={selectedMethod === method.id}
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                style={{ accentColor: 'var(--brand-blue)', width: '20px', height: '20px' }}
                            />
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '48px',
                                height: '48px',
                                background: 'var(--bg-light)',
                                borderRadius: '8px',
                                color: 'var(--brand-blue)'
                            }}>
                                {method.icon}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '16px' }}>{method.label}</span>
                                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>{method.sub}</span>
                            </div>
                        </label>
                    ))}
                </div>

                <Button size="lg" style={{ width: '100%', height: '48px', fontSize: '16px' }}>
                    Pay ₹{totalAmount.toLocaleString()}
                </Button>
            </Card>
        </div>
    );
};

export default PayMaintenance;
