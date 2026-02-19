import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';

const DeliveryLog = () => {
    const toast = useToast();
    const [deliveries, setDeliveries] = useState([
        { id: 1, courier: 'Amazon', flat: 'A-101', date: '06 Feb 2026, 10:00 AM', status: 'Collected' },
        { id: 2, courier: 'Flipkart', flat: 'B-205', date: '06 Feb 2026, 11:30 AM', status: 'Pending' },
        { id: 3, courier: 'Zomato', flat: 'C-304', date: '06 Feb 2026, 12:45 PM', status: 'Collected' },
        { id: 4, courier: 'BlueDart', flat: 'A-202', date: '05 Feb 2026, 04:00 PM', status: 'Collected' },
        { id: 5, courier: 'Swiggy Instamart', flat: 'B-105', date: '06 Feb 2026, 01:15 PM', status: 'Pending' },
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ courier: '', flat: '', date: '' });

    const handleLogDelivery = (e) => {
        e.preventDefault();
        setDeliveries(prev => [{ id: Date.now(), ...form, status: 'Pending' }, ...prev]);
        toast.success(`Delivery from ${form.courier} logged for flat ${form.flat}!`, 'Delivery Logged');
        setModalOpen(false);
        setForm({ courier: '', flat: '', date: '' });
    };

    const handleNotify = (delivery) => {
        toast.info(`Notification sent to flat ${delivery.flat} about ${delivery.courier} delivery!`, 'Notification Sent');
    };

    return (
        <>
            <PageHeader
                title="Deliveries"
                subtitle="Package tracking and gate logs"
                action={<Button variant="primary" onClick={() => setModalOpen(true)}>+ Log Delivery</Button>}
            />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup><col /><col /><col /><col /><col style={{ width: '96px' }} /></colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Courier</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Flat</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Date & Time</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Status</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((delivery) => (
                                <tr key={delivery.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{delivery.courier}</td>
                                    <td style={{ padding: '16px', fontWeight: 'bold', fontFamily: 'monospace', verticalAlign: 'middle' }}>{delivery.flat}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{delivery.date}</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status={delivery.status} /></td>
                                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="secondary" size="sm" onClick={() => handleNotify(delivery)}>Notify</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={modalOpen} title="Log New Delivery" onClose={() => setModalOpen(false)}>
                <form className="modal-form" onSubmit={handleLogDelivery}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Courier / Platform</label>
                            <input type="text" value={form.courier} onChange={e => setForm({ ...form, courier: e.target.value })} placeholder="e.g. Amazon, Flipkart" required />
                        </div>
                        <div className="form-group">
                            <label>Flat Number</label>
                            <input type="text" value={form.flat} onChange={e => setForm({ ...form, flat: e.target.value })} placeholder="e.g. A-101" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date & Time</label>
                        <input type="text" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. 06 Feb 2026, 10:00 AM" required />
                    </div>
                    <div className="modal-actions">
                        <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Log Delivery</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default DeliveryLog;
