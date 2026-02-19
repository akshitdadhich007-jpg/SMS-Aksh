import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';

const ResidentManagement = () => {
    const toast = useToast();
    const [residents, setResidents] = useState([
        { id: 1, name: 'Raj Kumar', flat: 'A-101', email: 'raj.k@example.com', phone: '9876543210', status: 'Active' },
        { id: 2, name: 'Anita Desai', flat: 'B-205', email: 'anita.d@example.com', phone: '9898989898', status: 'Active' },
        { id: 3, name: 'Vikram Singh', flat: 'C-304', email: 'vikram.s@example.com', phone: '9123456789', status: 'Inactive' },
        { id: 4, name: 'Suresh Raina', flat: 'A-202', email: 'suresh.r@example.com', phone: '8765432109', status: 'Active' },
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingResident, setEditingResident] = useState(null);
    const [form, setForm] = useState({ name: '', flat: '', email: '', phone: '', status: 'Active' });

    const openAddModal = () => {
        setEditingResident(null);
        setForm({ name: '', flat: '', email: '', phone: '', status: 'Active' });
        setModalOpen(true);
    };

    const openEditModal = (resident) => {
        setEditingResident(resident);
        setForm({ name: resident.name, flat: resident.flat, email: resident.email, phone: resident.phone || '', status: resident.status });
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingResident) {
            setResidents(prev => prev.map(r => r.id === editingResident.id ? { ...r, ...form } : r));
            toast.success(`${form.name}'s details updated successfully!`, 'Resident Updated');
        } else {
            const newResident = { id: Date.now(), ...form };
            setResidents(prev => [...prev, newResident]);
            toast.success(`${form.name} added to flat ${form.flat}!`, 'Resident Added');
        }
        setModalOpen(false);
    };

    if (!residents || residents.length === 0) {
        return (
            <>
                <PageHeader title="Resident Management" subtitle="Manage flats and residents" />
                <Card className="text-center p-12">
                    <h3 className="text-lg font-semibold text-gray-700">No residents found</h3>
                    <p className="text-gray-500 mt-2">Get started by adding a new resident.</p>
                    <Button variant="primary" style={{ marginTop: '16px' }} onClick={openAddModal}>+ Add Resident</Button>
                </Card>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Resident Management"
                subtitle="Manage flats and residents"
                action={<Button variant="primary" onClick={openAddModal}>+ Add Resident</Button>}
            />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup>
                            <col />
                            <col />
                            <col />
                            <col />
                            <col style={{ width: '96px' }} />
                        </colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Name</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Flat Number</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Email</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Status</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {residents.map((resident) => (
                                <tr key={resident.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{resident.name}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 'bold', verticalAlign: 'middle' }}>{resident.flat}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{resident.email}</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status={resident.status} /></td>
                                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="secondary" size="sm" onClick={() => openEditModal(resident)}>Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={modalOpen} title={editingResident ? 'Edit Resident' : 'Add New Resident'} onClose={() => setModalOpen(false)}>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Raj Kumar" required />
                        </div>
                        <div className="form-group">
                            <label>Flat Number</label>
                            <input type="text" value={form.flat} onChange={e => setForm({ ...form, flat: e.target.value })} placeholder="e.g. A-101" required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" required />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">{editingResident ? 'Save Changes' : 'Add Resident'}</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default ResidentManagement;
