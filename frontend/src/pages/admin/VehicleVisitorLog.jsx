import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';

const VehicleVisitorLog = () => {
    // Mock Data - Vehicles
    const [vehicles] = useState([
        { id: 1, flat: 'A-101', owner: 'Raj Kumar', vehicleNo: 'MH-12-AB-1234', type: 'Car', stickerId: 'S-001' },
        { id: 2, flat: 'B-205', owner: 'Anita Desai', vehicleNo: 'MH-12-XY-9876', type: 'Scooter', stickerId: 'S-002' },
        { id: 3, flat: 'C-304', owner: 'Vikram Singh', vehicleNo: 'MH-14-CD-5678', type: 'Car', stickerId: 'S-003' },
        { id: 4, flat: 'A-202', owner: 'Suresh Raina', vehicleNo: 'MH-12-EF-4321', type: 'Car', stickerId: 'S-004' },
    ]);

    // Mock Data - Visitors
    const [visitors] = useState([
        { id: 1, name: 'Samesh (Delivery)', host: 'A-101 (Raj)', inTime: '10:30 AM', outTime: '10:45 AM', status: 'Exited' },
        { id: 2, name: 'Mahesh (Guest)', host: 'B-205 (Anita)', inTime: '11:00 AM', outTime: '-', status: 'Inside' },
        { id: 3, name: 'UrbanCompany', host: 'C-304 (Vikram)', inTime: '11:15 AM', outTime: '12:30 PM', status: 'Exited' },
    ]);

    return (
        <>
            <PageHeader
                title="Vehicles & Visitors"
                subtitle="Gate logs and registry"
            />

            <div className="grid-1" style={{ display: 'grid', gap: '24px' }}>

                {/* Registered Vehicles */}
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Registered Vehicles</h3>
                        <Button variant="secondary" size="sm">Export List</Button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                            <colgroup>
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                            </colgroup>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>Flat</th>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>Owner</th>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>Vehicle No</th>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>Type</th>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>Sticker ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((v) => (
                                    <tr key={v.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                        <td style={{ padding: '12px', fontWeight: 'bold', fontFamily: 'monospace', verticalAlign: 'middle' }}>{v.flat}</td>
                                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>{v.owner}</td>
                                        <td style={{ padding: '12px', fontFamily: 'monospace', verticalAlign: 'middle' }}>{v.vehicleNo}</td>
                                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>{v.type}</td>
                                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>{v.stickerId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Visitor Logs */}
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Recent Visitors</h3>
                        <Button variant="secondary" size="sm">View All Logs</Button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                            <colgroup>
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                            </colgroup>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>Visitor</th>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>Host</th>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>In-Time</th>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>Out-Time</th>
                                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '14px', verticalAlign: 'middle' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visitors.map((v) => (
                                    <tr key={v.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                        <td style={{ padding: '12px', fontWeight: '500', verticalAlign: 'middle' }}>{v.name}</td>
                                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>{v.host}</td>
                                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>{v.inTime}</td>
                                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>{v.outTime}</td>
                                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: v.status === 'Inside' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                                color: v.status === 'Inside' ? 'var(--success)' : 'var(--text-secondary)'
                                            }}>
                                                {v.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default VehicleVisitorLog;
