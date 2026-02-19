import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';

const StaffManagement = () => {
    const toast = useToast();
    const [staffList, setStaffList] = useState([
        { id: 1, name: 'Ramesh Patil', role: 'Security Guard', salary: 15000, status: 'Paid' },
        { id: 2, name: 'Suresh Kumar', role: 'Housekeeping', salary: 12000, status: 'Paid' },
        { id: 3, name: 'Mahesh Yadav', role: 'Gardener', salary: 10000, status: 'Pending' },
        { id: 4, name: 'Kishore Singh', role: 'Electrician', salary: 18000, status: 'Paid' },
        { id: 5, name: 'Anita Das', role: 'Cleaner', salary: 9000, status: 'Processing' },
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [form, setForm] = useState({ name: '', role: '', salary: '', status: 'Pending' });

    const openAddModal = () => {
        setEditingStaff(null);
        setForm({ name: '', role: '', salary: '', status: 'Pending' });
        setModalOpen(true);
    };

    const openEditModal = (staff) => {
        setEditingStaff(staff);
        setForm({ name: staff.name, role: staff.role, salary: String(staff.salary), status: staff.status });
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingStaff) {
            setStaffList(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...form, salary: parseInt(form.salary) } : s));
            toast.success(`${form.name}'s details updated!`, 'Staff Updated');
        } else {
            setStaffList(prev => [...prev, { id: Date.now(), ...form, salary: parseInt(form.salary) }]);
            toast.success(`${form.name} added as ${form.role}!`, 'Employee Added');
        }
        setModalOpen(false);
    };

    return (
        <>
            <PageHeader
                title="Staff & Salaries"
                subtitle="Manage employees and payroll"
                action={<Button variant="primary" onClick={openAddModal}>+ Add Employee</Button>}
            />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup><col /><col /><col /><col /><col style={{ width: '96px' }} /></colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Name</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Role</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Salary</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Payment Status</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff) => (
                                <tr key={staff.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>{staff.name}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{staff.role}</td>
                                    <td style={{ padding: '16px', fontWeight: '600', fontFamily: 'monospace' }}>₹{staff.salary.toLocaleString()}</td>
                                    <td style={{ padding: '16px' }}><StatusBadge status={staff.status} /></td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <Button variant="secondary" size="sm" onClick={() => openEditModal(staff)}>Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={modalOpen} title={editingStaff ? 'Edit Employee' : 'Add New Employee'} onClose={() => setModalOpen(false)}>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Employee name" required />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required>
                                <option value="">Select role</option>
                                <option value="Security Guard">Security Guard</option>
                                <option value="Housekeeping">Housekeeping</option>
                                <option value="Gardener">Gardener</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Cleaner">Cleaner</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Monthly Salary (₹)</label>
                            <input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. 15000" required />
                        </div>
                        <div className="form-group">
                            <label>Payment Status</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">{editingStaff ? 'Save Changes' : 'Add Employee'}</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default StaffManagement;
