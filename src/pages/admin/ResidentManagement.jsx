import React, { useEffect, useState } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import {
    subscribeToResidents,
    createResident,
    updateResident,
} from '../../firebase/residentService';
import {
    assignResidentToFlat,
    subscribeToFlats,
} from '../../firebase/flatService';

const ResidentManagement = () => {
    const toast = useToast();
    const { user } = useAuth();
    const societyId = user?.societyId || 'default-society';

    const [residents, setResidents] = useState([]);
    const [flats, setFlats] = useState([]);

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

    useEffect(() => {
        const unsubscribe = subscribeToResidents(societyId, setResidents);
        return () => unsubscribe && unsubscribe();
    }, [societyId]);

    useEffect(() => {
        const unsubscribe = subscribeToFlats(societyId, setFlats);
        return () => unsubscribe && unsubscribe();
    }, [societyId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingResident) {
                await updateResident(editingResident.id, form);
                const selectedFlat = flats.find((flat) => String(flat.flatNumber) === String(form.flat));
                if (selectedFlat) {
                    await assignResidentToFlat(selectedFlat.id, editingResident.id, form.name);
                }
                toast.success(`${form.name}'s details updated successfully!`, 'Resident Updated');
            } else {
                const residentRef = await createResident({
                    ...form,
                    societyId,
                });
                const selectedFlat = flats.find((flat) => String(flat.flatNumber) === String(form.flat));
                if (selectedFlat) {
                    await assignResidentToFlat(selectedFlat.id, residentRef.id, form.name);
                }
                toast.success(`${form.name} added to flat ${form.flat}!`, 'Resident Added');
            }
            setModalOpen(false);
            setEditingResident(null);
            setForm({ name: '', flat: '', email: '', phone: '', status: 'Active' });
        } catch (err) {
            console.error('Resident save failed', err);
            toast.error('Unable to save resident. Please try again.', 'Error');
        }
    };

    const availableFlats = flats.filter((flat) => !flat.residentUid || editingResident?.flat === flat.flatNumber);
    const hasResidents = Array.isArray(residents) && residents.length > 0;

    return (
        <>
            <PageHeader
                title="Resident Management"
                subtitle="Manage flats and residents"
                action={<Button variant="primary" onClick={openAddModal}>+ Add Resident</Button>}
            />

            {!hasResidents ? (
                <Card className="text-center p-12">
                    <h3 className="text-lg font-semibold text-gray-700">No residents found</h3>
                    <p className="text-gray-500 mt-2">
                        {flats.length > 0
                            ? 'Get started by assigning a resident to one of your flats.'
                            : 'Create flats in onboarding first, then add residents here.'}
                    </p>
                    <Button variant="primary" style={{ marginTop: '16px' }} onClick={openAddModal}>+ Add Resident</Button>
                </Card>
            ) : (
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
            )}

            <Modal isOpen={modalOpen} title={editingResident ? 'Edit Resident' : 'Add New Resident'} onClose={() => setModalOpen(false)}>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" required />
                        </div>
                        <div className="form-group">
                            <label>Flat Number</label>
                            <select value={form.flat} onChange={e => setForm({ ...form, flat: e.target.value })} required>
                                <option value="">Select flat</option>
                                {availableFlats.map((flat) => (
                                    <option key={flat.id} value={flat.flatNumber}>{flat.flatNumber}</option>
                                ))}
                            </select>
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
                        <Button variant="primary" type="submit" disabled={!editingResident && availableFlats.length === 0}>
                            {editingResident ? 'Save Changes' : 'Add Resident'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default ResidentManagement;
