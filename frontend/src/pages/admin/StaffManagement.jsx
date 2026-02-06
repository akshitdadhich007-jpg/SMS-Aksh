import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';

const StaffManagement = () => {
    // Mock Data
    const [staffList] = useState([
        { id: 1, name: 'Ramesh Patil', role: 'Security Guard', salary: 15000, status: 'Paid' },
        { id: 2, name: 'Suresh Kumar', role: 'Housekeeping', salary: 12000, status: 'Paid' },
        { id: 3, name: 'Mahesh Yadav', role: 'Gardener', salary: 10000, status: 'Pending' },
        { id: 4, name: 'Kishore Singh', role: 'Electrician', salary: 18000, status: 'Paid' },
        { id: 5, name: 'Anita Das', role: 'Cleaner', salary: 9000, status: 'Processing' },
    ]);

    return (
        <>
            <PageHeader
                title="Staff & Salaries"
                subtitle="Manage employees and payroll"
                action={<Button variant="primary">Add Employee</Button>}
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
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Role</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Salary</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Payment Status</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff) => (
                                <tr key={staff.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{staff.name}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{staff.role}</td>
                                    <td style={{ padding: '16px', fontWeight: '600', fontFamily: 'monospace', verticalAlign: 'middle' }}>₹{staff.salary.toLocaleString()}</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status={staff.status} /></td>
                                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="secondary" size="sm">Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default StaffManagement;
