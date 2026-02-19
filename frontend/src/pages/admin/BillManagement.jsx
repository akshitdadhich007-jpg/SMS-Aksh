import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge, Button, StatCard } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';

const BillManagement = () => {
    const toast = useToast();
    const [bills, setBills] = useState([
        { id: 1, month: 'Feb 2026', totalAmount: 450000, collected: 250000, status: 'Pending' },
        { id: 2, month: 'Jan 2026', totalAmount: 450000, collected: 445000, status: 'Completed' },
        { id: 3, month: 'Dec 2025', totalAmount: 450000, collected: 450000, status: 'Completed' },
        { id: 4, month: 'Nov 2025', totalAmount: 440000, collected: 440000, status: 'Completed' },
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [viewModal, setViewModal] = useState(null);
    const [form, setForm] = useState({ month: '', totalAmount: '' });

    const handleGenerate = (e) => {
        e.preventDefault();
        const newBill = {
            id: Date.now(),
            month: form.month,
            totalAmount: parseInt(form.totalAmount),
            collected: 0,
            status: 'Pending'
        };
        setBills(prev => [newBill, ...prev]);
        toast.success(`Bill generated for ${form.month}!`, 'Bill Created');
        setModalOpen(false);
        setForm({ month: '', totalAmount: '' });
    };

    return (
        <>
            <PageHeader
                title="Maintenance & Bills"
                subtitle="Overview of society billing"
                action={<Button variant="primary" onClick={() => setModalOpen(true)}>+ Generate New Bill</Button>}
            />

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard label="Total Billed (Feb)" value="₹ 4.5L" trend={0} />
                <StatCard label="Collected" value="₹ 2.5L" trend={12} trendLabel="vs last month" />
                <StatCard label="Pending" value="₹ 2.0L" trend={-5} trendLabel="remaining" />
            </div>

            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Billing History</h3>
                    <Button variant="secondary" size="sm" onClick={() => toast.success('Billing report exported as CSV!', 'Export Complete')}>📥 Export Report</Button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Month</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Total Amount</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Collection Status</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Status</th>
                                <th style={{ padding: '16px', width: '100px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>{bill.month}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 'bold' }}>₹{bill.totalAmount.toLocaleString()}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ flex: 1, height: '6px', background: 'var(--bg-light)', borderRadius: '3px', maxWidth: '100px' }}>
                                                <div style={{ width: `${(bill.collected / bill.totalAmount) * 100}%`, height: '100%', background: 'var(--brand-blue)', borderRadius: '3px' }}></div>
                                            </div>
                                            <span style={{ fontSize: '12px' }}>{Math.round((bill.collected / bill.totalAmount) * 100)}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <StatusBadge status={bill.status === 'Completed' ? 'Paid' : 'Pending'} />
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <Button variant="secondary" size="sm" onClick={() => setViewModal(bill)}>View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Generate Bill Modal */}
            <Modal isOpen={modalOpen} title="Generate New Bill" onClose={() => setModalOpen(false)}>
                <form className="modal-form" onSubmit={handleGenerate}>
                    <div className="form-group">
                        <label>Billing Month</label>
                        <input type="text" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} placeholder="e.g. Mar 2026" required />
                    </div>
                    <div className="form-group">
                        <label>Total Amount (₹)</label>
                        <input type="number" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} placeholder="e.g. 450000" required />
                    </div>
                    <div className="modal-actions">
                        <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Generate Bill</Button>
                    </div>
                </form>
            </Modal>

            {/* View Bill Details Modal */}
            <Modal isOpen={!!viewModal} title={`Bill Details — ${viewModal?.month}`} onClose={() => setViewModal(null)}>
                {viewModal && (
                    <div className="detail-grid">
                        <div className="detail-label">Month</div>
                        <div className="detail-value">{viewModal.month}</div>
                        <div className="detail-label">Total Amount</div>
                        <div className="detail-value" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>₹{viewModal.totalAmount.toLocaleString()}</div>
                        <div className="detail-label">Collected</div>
                        <div className="detail-value" style={{ color: 'var(--success)' }}>₹{viewModal.collected.toLocaleString()}</div>
                        <div className="detail-label">Pending</div>
                        <div className="detail-value" style={{ color: 'var(--danger)' }}>₹{(viewModal.totalAmount - viewModal.collected).toLocaleString()}</div>
                        <div className="detail-label">Collection %</div>
                        <div className="detail-value">{Math.round((viewModal.collected / viewModal.totalAmount) * 100)}%</div>
                        <div className="detail-label">Status</div>
                        <div className="detail-value"><StatusBadge status={viewModal.status === 'Completed' ? 'Paid' : 'Pending'} /></div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default BillManagement;
