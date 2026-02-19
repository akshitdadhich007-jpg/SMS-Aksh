import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';

const ExpenseTracker = () => {
    const toast = useToast();
    const [expenses, setExpenses] = useState([
        { id: 1, category: 'Salaries', amount: 120000, date: '01 Feb 2026', description: 'Staff salaries for Jan 2026' },
        { id: 2, category: 'Utilities', amount: 45000, date: '02 Feb 2026', description: 'Electricity bill for common areas' },
        { id: 3, category: 'Maintenance', amount: 15000, date: '05 Feb 2026', description: 'Lift repair & servicing' },
        { id: 4, category: 'Events', amount: 8500, date: '26 Jan 2026', description: 'Republic Day celebration expenses' },
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [form, setForm] = useState({ category: '', amount: '', date: '', description: '' });

    const openAddModal = () => {
        setEditingExpense(null);
        setForm({ category: '', amount: '', date: '', description: '' });
        setModalOpen(true);
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);
        setForm({ category: expense.category, amount: String(expense.amount), date: expense.date, description: expense.description });
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingExpense) {
            setExpenses(prev => prev.map(ex => ex.id === editingExpense.id ? { ...ex, ...form, amount: parseInt(form.amount) } : ex));
            toast.success(`Expense updated successfully!`, 'Expense Updated');
        } else {
            setExpenses(prev => [...prev, { id: Date.now(), ...form, amount: parseInt(form.amount) }]);
            toast.success(`₹${parseInt(form.amount).toLocaleString()} expense added under ${form.category}!`, 'Expense Added');
        }
        setModalOpen(false);
    };

    return (
        <>
            <PageHeader
                title="Expense Tracker"
                subtitle="Monitor society spending"
                action={<Button variant="primary" onClick={openAddModal}>+ Add Expense</Button>}
            />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup><col /><col /><col /><col /><col style={{ width: '96px' }} /></colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Category</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Amount</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Date</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Description</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>{expense.category}</td>
                                    <td style={{ padding: '16px', fontWeight: '600' }}>₹{expense.amount.toLocaleString()}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{expense.date}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{expense.description}</td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <Button variant="secondary" size="sm" onClick={() => openEditModal(expense)}>Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={modalOpen} title={editingExpense ? 'Edit Expense' : 'Add New Expense'} onClose={() => setModalOpen(false)}>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                                <option value="">Select category</option>
                                <option value="Salaries">Salaries</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Events">Events</option>
                                <option value="Security">Security</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount (₹)</label>
                            <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 15000" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input type="text" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. 05 Feb 2026" required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the expense" rows={3} required />
                    </div>
                    <div className="modal-actions">
                        <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">{editingExpense ? 'Save Changes' : 'Add Expense'}</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default ExpenseTracker;
