import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';

const ExpenseTracker = () => {
    // Mock Data
    const [expenses] = useState([
        { id: 1, category: 'Salaries', amount: 120000, date: '01 Feb 2026', description: 'Staff salaries for Jan 2026' },
        { id: 2, category: 'Utilities', amount: 45000, date: '02 Feb 2026', description: 'Electricity bill for common areas' },
        { id: 3, category: 'Maintenance', amount: 15000, date: '05 Feb 2026', description: 'Lift repair & servicing' },
        { id: 4, category: 'Events', amount: 8500, date: '26 Jan 2026', description: 'Republic Day celebration expenses' },
    ]);

    return (
        <>
            <PageHeader
                title="Expense Tracker"
                subtitle="Monitor society spending"
                action={<Button variant="primary">Add Expense</Button>}
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
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Category</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Amount</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Date</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Description</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{expense.category}</td>
                                    <td style={{ padding: '16px', fontWeight: '600', verticalAlign: 'middle' }}>₹{expense.amount.toLocaleString()}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{expense.date}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{expense.description}</td>
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

export default ExpenseTracker;
