import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader, Card, StatusBadge, Button, StatCard } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { subscribeToAllBills, subscribeBillingStats, generateBill, deleteBill } from '../../firebase/billService';
import Modal from '../../components/ui/Modal';
import { Trash2, Eye } from 'lucide-react';
import './BillManagement.css';

const BillManagement = () => {
    const toast = useToast();
    const [bills, setBills] = useState([]);
    const [stats, setStats] = useState({
        totalBilled: 0,
        totalCollected: 0,
        totalPending: 0,
        billCount: 0,
        collectionPercentage: 0
    });
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewModal, setViewModal] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [form, setForm] = useState({ 
        billMonth: new Date().toLocaleString('en-US', { month: '2-digit' }),
        billYear: new Date().getFullYear(),
        totalAmount: '',
        dueDate: '',
        description: ''
    });

    // Subscribe to all bills and stats
    useEffect(() => {
        const unsubBills = subscribeToAllBills((data) => {
            setBills(data);
            setLoading(false);
        });
        
        const unsubStats = subscribeBillingStats((statsData) => {
            setStats(statsData);
        });
        
        return () => {
            unsubBills();
            unsubStats();
        };
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!form.totalAmount || !form.dueDate) {
            toast.error('Please fill all required fields', 'Error');
            return;
        }

        setIsGenerating(true);
        try {
            await generateBill({
                billMonth: form.billMonth,
                billYear: form.billYear,
                totalAmount: parseInt(form.totalAmount),
                dueDate: form.dueDate,
                description: form.description,
                payments: []
            });
            toast.success(`Bill for ${form.billMonth}/${form.billYear} generated successfully!`, 'Bill Created');
            setModalOpen(false);
            setForm({ 
                billMonth: new Date().toLocaleString('en-US', { month: '2-digit' }),
                billYear: new Date().getFullYear(),
                totalAmount: '',
                dueDate: '',
                description: ''
            });
        } catch (err) {
            toast.error('Failed to generate bill', 'Error');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (billId) => {
        if (window.confirm('Are you sure you want to delete this bill?')) {
            try {
                await deleteBill(billId);
                toast.success('Bill deleted successfully', 'Deleted');
            } catch (err) {
                toast.error('Failed to delete bill', 'Error');
            }
        }
    };

    const getCollectionStats = (bill) => {
        const payments = bill.payments || [];
        const totalCollected = payments.filter(p => p.status === 'Paid').length;
        return {
            collected: totalCollected,
            total: 50, // Assuming 50 residents
            percentage: Math.round((totalCollected / 50) * 100)
        };
    };

    return (
        <>
            <PageHeader
                title="Maintenance & Bills"
                subtitle="Manage billing cycles and track collections"
                action={<Button variant="primary" onClick={() => setModalOpen(true)}>+ Generate New Bill</Button>}
            />

            {/* Stats Cards */}
            <div className="bill-stats-grid">
                <StatCard 
                    label="Total Billed" 
                    value={`₹ ${(stats.totalBilled / 100000).toFixed(1)}L`} 
                    trend={stats.billCount} 
                    trendLabel={`${stats.billCount} bills`}
                />
                <StatCard 
                    label="Total Collected" 
                    value={`₹ ${(stats.totalCollected / 100000).toFixed(1)}L`} 
                    trend={stats.collectionPercentage}
                    trendLabel="collection %"
                />
                <StatCard 
                    label="Pending Amount" 
                    value={`₹ ${(stats.totalPending / 100000).toFixed(1)}L`} 
                    trend={-Math.round((stats.totalPending / stats.totalBilled) * 100)}
                    trendLabel="of total"
                />
            </div>

            {/* Billing History Table */}
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Billing Cycles</h3>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {loading ? 'Loading...' : `${bills.length} bill${bills.length !== 1 ? 's' : ''}`}
                    </span>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading bills...</div>
                ) : bills.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        No bills generated yet. Create one to get started!
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="bill-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Period</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Total Amount</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Collections</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Status</th>
                                    <th style={{ padding: '16px', width: '100px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map((bill) => {
                                    const collStats = getCollectionStats(bill);
                                    return (
                                        <tr key={bill.id} className="bill-table-row" style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
                                                {bill.billMonth}/{bill.billYear}
                                            </td>
                                            <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                                ₹{bill.totalAmount.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ flex: 1, height: '6px', background: 'var(--bg-light)', borderRadius: '3px', maxWidth: '100px' }}>
                                                        <div style={{ 
                                                            width: `${collStats.percentage}%`, 
                                                            height: '100%', 
                                                            background: 'var(--brand-blue)', 
                                                            borderRadius: '3px' 
                                                        }}></div>
                                                    </div>
                                                    <span style={{ fontSize: '12px', minWidth: '40px' }}>{collStats.percentage}%</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <StatusBadge status={collStats.percentage === 100 ? 'Resolved' : 'Pending'} />
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button 
                                                        onClick={() => setViewModal(bill)}
                                                        style={{
                                                            background: '#eff6ff',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '6px',
                                                            borderRadius: '4px',
                                                            color: '#3b82f6',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            transition: 'background 0.2s'
                                                        }}
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(bill.id)}
                                                        style={{
                                                            background: '#fef2f2',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '6px',
                                                            borderRadius: '4px',
                                                            color: '#ef4444',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            transition: 'background 0.2s'
                                                        }}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Generate Bill Modal */}
            <Modal isOpen={modalOpen} title="Generate New Bill" onClose={() => setModalOpen(false)}>
                <form className="modal-form" onSubmit={handleGenerate}>
                    <div className="form-group">
                        <label>Billing Month</label>
                        <select 
                            value={form.billMonth} 
                            onChange={e => setForm({ ...form, billMonth: e.target.value })} 
                            required
                        >
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Billing Year</label>
                        <input 
                            type="number" 
                            value={form.billYear}
                            onChange={e => setForm({ ...form, billYear: parseInt(e.target.value) })}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Total Amount (₹)</label>
                        <input 
                            type="number" 
                            value={form.totalAmount}
                            onChange={e => setForm({ ...form, totalAmount: e.target.value })}
                            placeholder="e.g. 450000" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input 
                            type="text" 
                            value={form.dueDate}
                            onChange={e => setForm({ ...form, dueDate: e.target.value })}
                            placeholder="e.g. 10 Mar 2026" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea 
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="e.g. Monthly maintenance + utilities"
                            rows="3"
                        />
                    </div>
                    <div className="modal-actions">
                        <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Generate Bill'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* View Bill Details Modal */}
            <Modal isOpen={!!viewModal} title={`Bill Details — ${viewModal?.billMonth}/${viewModal?.billYear}`} onClose={() => setViewModal(null)}>
                {viewModal && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Period</label>
                                <p style={{ margin: 0, color: '#111827', fontWeight: '500' }}>{viewModal.billMonth}/{viewModal.billYear}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</label>
                                <p style={{ margin: 0, color: '#111827', fontWeight: '700', fontSize: '16px' }}>₹{viewModal.totalAmount.toLocaleString()}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</label>
                                <p style={{ margin: 0, color: '#111827', fontWeight: '500' }}>{viewModal.dueDate}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collections</label>
                                <p style={{ margin: 0, color: '#111827', fontWeight: '500' }}>{getCollectionStats(viewModal).percentage}%</p>
                            </div>
                        </div>
                        {viewModal.description && (
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                                <p style={{ margin: 0, color: '#4b5563' }}>{viewModal.description}</p>
                            </div>
                        )}
                        <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                            <p style={{ margin: 0, fontSize: '13px', color: '#1e40af' }}>
                                <strong>{getCollectionStats(viewModal).collected}</strong> out of <strong>50</strong> residents have paid
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default BillManagement;
