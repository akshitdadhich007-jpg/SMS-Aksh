import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';

const CommitteeManagement = () => {
    const toast = useToast();
    const [members, setMembers] = useState([
        { id: 1, name: 'Dr. Vivek S', position: 'Chairman', contact: '9876543210', email: 'chairman@society.com' },
        { id: 2, name: 'Mr. Raj Kumar', position: 'Secretary', contact: '9123456789', email: 'secretary@society.com' },
        { id: 3, name: 'Mrs. Priya Sharma', position: 'Treasurer', contact: '9898989898', email: 'treasurer@society.com' },
        { id: 4, name: 'Mr. Ankit Verma', position: 'Member', contact: '8765432109', email: 'ankit.v@society.com' },
        { id: 5, name: 'Ms. Neha Gupta', position: 'Member', contact: '7654321098', email: 'neha.g@society.com' },
    ]);

    const [viewMember, setViewMember] = useState(null);
    const [roleModal, setRoleModal] = useState(false);
    const [roleForm, setRoleForm] = useState({ memberId: '', position: '' });

    const handleRoleUpdate = (e) => {
        e.preventDefault();
        const id = parseInt(roleForm.memberId);
        const member = members.find(m => m.id === id);
        if (member) {
            setMembers(prev => prev.map(m => m.id === id ? { ...m, position: roleForm.position } : m));
            toast.success(`${member.name} is now ${roleForm.position}!`, 'Role Updated');
        }
        setRoleModal(false);
    };

    return (
        <>
            <PageHeader
                title="Managing Committee"
                subtitle="Society governing body members"
                action={<Button variant="secondary" onClick={() => setRoleModal(true)}>🔄 Update Roles</Button>}
            />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup><col /><col /><col /><col /><col style={{ width: '96px' }} /></colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Name</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Position</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Contact</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Email</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{member.name}</td>
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--brand-blue)', verticalAlign: 'middle' }}>{member.position}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', verticalAlign: 'middle' }}>{member.contact}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{member.email}</td>
                                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="secondary" size="sm" onClick={() => setViewMember(member)}>View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* View Member Modal */}
            <Modal isOpen={!!viewMember} title={viewMember?.name} onClose={() => setViewMember(null)}>
                {viewMember && (
                    <div className="detail-grid">
                        <div className="detail-label">Name</div>
                        <div className="detail-value">{viewMember.name}</div>
                        <div className="detail-label">Position</div>
                        <div className="detail-value" style={{ color: 'var(--brand-blue)', fontWeight: 'bold' }}>{viewMember.position}</div>
                        <div className="detail-label">Contact</div>
                        <div className="detail-value" style={{ fontFamily: 'monospace' }}>{viewMember.contact}</div>
                        <div className="detail-label">Email</div>
                        <div className="detail-value">{viewMember.email}</div>
                    </div>
                )}
            </Modal>

            {/* Update Role Modal */}
            <Modal isOpen={roleModal} title="Update Member Role" onClose={() => setRoleModal(false)}>
                <form className="modal-form" onSubmit={handleRoleUpdate}>
                    <div className="form-group">
                        <label>Select Member</label>
                        <select value={roleForm.memberId} onChange={e => setRoleForm({ ...roleForm, memberId: e.target.value })} required>
                            <option value="">Choose member</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.name} — {m.position}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>New Position</label>
                        <select value={roleForm.position} onChange={e => setRoleForm({ ...roleForm, position: e.target.value })} required>
                            <option value="">Select position</option>
                            <option value="Chairman">Chairman</option>
                            <option value="Secretary">Secretary</option>
                            <option value="Treasurer">Treasurer</option>
                            <option value="Member">Member</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <Button variant="secondary" type="button" onClick={() => setRoleModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Update Role</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CommitteeManagement;
