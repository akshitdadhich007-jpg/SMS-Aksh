import React, { useState, useMemo } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';
import { Car, Bike, Truck, User, Users, Search, Filter, Download, Plus, Eye, Pencil, Trash2, LogIn, LogOut, Activity } from 'lucide-react';

// ── helpers ─────────────────────────────────────────────────────────────────
const vehicleTypeMeta = {
    Car:     { color: '#2563eb', bg: '#eff6ff', icon: <Car    size={12} /> },
    Scooter: { color: '#7c3aed', bg: '#f5f3ff', icon: <Bike   size={12} /> },
    Bike:    { color: '#059669', bg: '#ecfdf5', icon: <Bike   size={12} /> },
};
const visitorStatusMeta = {
    Entered: { color: '#2563eb', bg: '#eff6ff' },
    Inside:  { color: '#d97706', bg: '#fffbeb' },
    Exited:  { color: '#059669', bg: '#f0fdf4' },
};
const VisitorTypeIcon = ({ name }) => {
    const lower = name.toLowerCase();
    if (lower.includes('delivery') || lower.includes('urbancompany')) return <Truck size={13} style={{ color: '#6b7280', flexShrink: 0 }} />;
    return <User size={13} style={{ color: '#6b7280', flexShrink: 0 }} />;
};
const TypeBadge = ({ type }) => {
    const meta = vehicleTypeMeta[type] || { color: '#374151', bg: '#f3f4f6', icon: null };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: meta.bg, color: meta.color }}>
            {meta.icon} {type}
        </span>
    );
};
const StatusPill = ({ status }) => {
    const meta = visitorStatusMeta[status] || { color: '#6b7280', bg: '#f3f4f6' };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: meta.bg, color: meta.color }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, display: 'inline-block' }} />
            {status}
        </span>
    );
};
const ActionBtn = ({ icon, label, color, bg, onClick }) => (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, border: `1px solid ${color}22`, background: bg, color, cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all .15s', whiteSpace: 'nowrap' }}
        onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = bg; e.currentTarget.style.color = color; }}>
        {React.cloneElement(icon, { color: 'inherit' })} {label}
    </button>
);
const StatCard = ({ icon, value, label, accent }) => (
    <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 6px rgba(0,0,0,.06)', flex: '1 1 160px', minWidth: 0 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: accent + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {React.cloneElement(icon, { size: 20, color: accent })}
        </div>
        <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3, fontWeight: 500 }}>{label}</div>
        </div>
    </div>
);

const VehicleVisitorLog = () => {
    // Mock Data - Vehicles
    const [vehicles, setVehicles] = useState([
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

    // ── Modal state ──────────────────────────────────────────────────────────
    const [viewVehicle, setViewVehicle] = useState(null);
    const [editVehicle, setEditVehicle] = useState(null);
    const [editForm, setEditForm]       = useState({});

    const handleView   = (v) => setViewVehicle(v);
    const handleEdit   = (v) => { setEditVehicle(v); setEditForm({ ...v }); };
    const handleDelete = (id) => {
        if (window.confirm('Delete this vehicle record permanently?')) {
            setVehicles(prev => prev.filter(v => v.id !== id));
        }
    };
    const handleEditSave = () => {
        setVehicles(prev => prev.map(v => v.id === editVehicle.id ? { ...editForm } : v));
        setEditVehicle(null);
    };

    // ── Search / Filter state ────────────────────────────────────────────────
    const [searchVehicle, setSearchVehicle] = useState('');
    const [filterType, setFilterType]       = useState('All');
    const [filterFlat, setFilterFlat]       = useState('');

    const filteredVehicles = useMemo(() => vehicles.filter(v => {
        const matchSearch = !searchVehicle || v.vehicleNo.toLowerCase().includes(searchVehicle.toLowerCase());
        const matchType   = filterType === 'All' || v.type === filterType;
        const matchFlat   = !filterFlat || v.flat.toLowerCase().includes(filterFlat.toLowerCase());
        return matchSearch && matchType && matchFlat;
    }), [vehicles, searchVehicle, filterType, filterFlat]);

    // ── Derived stats ────────────────────────────────────────────────────────
    const visitorsToday  = visitors.length;
    const activeVisitors = visitors.filter(v => v.status === 'Inside').length;

    // ── Shared styles ────────────────────────────────────────────────────────
    const thHead = { padding: '11px 14px', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap', background: 'var(--hover-bg, #f8fafc)', borderBottom: '1px solid var(--border, #e5e7eb)' };
    const thFirst = { ...thHead, borderRadius: '10px 0 0 0' };
    const thLast  = { ...thHead, borderRadius: '0 10px 0 0' };
    const tdStyle = { padding: '12px 14px', fontSize: 13, verticalAlign: 'middle', borderBottom: '1px solid var(--border-light, #f1f5f9)', color: 'var(--text-primary)' };

    return (
        <div style={{ display: 'grid', gap: 28, fontFamily: 'Inter, sans-serif' }}>

            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Vehicles & Visitors Management</h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>Gate logs, registered vehicles, and visitor tracking</p>
            </div>

            {/* ── Stat Cards ──────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <StatCard icon={<Car />}      value={vehicles.length} label="Total Registered Vehicles" accent="#6366f1" />
                <StatCard icon={<Users />}    value={visitorsToday}   label="Visitors Today"            accent="#f59e0b" />
                <StatCard icon={<Activity />} value={activeVisitors}  label="Active Visitors Inside"    accent="#10b981" />
            </div>

            {/* ── Registered Vehicles ─────────────────────────────────────── */}
            <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border, #e5e7eb)', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Car size={18} color="#6366f1" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>Registered Vehicles</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{filteredVehicles.length} of {vehicles.length} shown</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f1f5f9', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
                            <Download size={14} /> Export List
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#6366f1', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff' }}>
                            <Plus size={14} /> Add Vehicle
                        </button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', gap: 12, padding: '14px 24px', borderBottom: '1px solid var(--border, #e5e7eb)', flexWrap: 'wrap', background: 'var(--hover-bg, #f8fafc)' }}>
                    <div style={{ position: 'relative', flex: '1 1 200px' }}>
                        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                        <input
                            value={searchVehicle}
                            onChange={e => setSearchVehicle(e.target.value)}
                            placeholder="Search vehicle number…"
                            style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 9, border: '1px solid var(--border, #e5e7eb)', background: 'var(--card, #fff)', fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
                        />
                    </div>
                    <div style={{ position: 'relative', flex: '0 0 150px' }}>
                        <Filter size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                        <select value={filterType} onChange={e => setFilterType(e.target.value)}
                            style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 9, border: '1px solid var(--border, #e5e7eb)', background: 'var(--card, #fff)', fontSize: 13, appearance: 'none', cursor: 'pointer' }}>
                            <option value="All">All Types</option>
                            <option value="Car">Car</option>
                            <option value="Scooter">Scooter</option>
                            <option value="Bike">Bike</option>
                        </select>
                    </div>
                    <div style={{ position: 'relative', flex: '0 0 170px' }}>
                        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                        <input
                            value={filterFlat}
                            onChange={e => setFilterFlat(e.target.value)}
                            placeholder="Filter by block / flat…"
                            style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 9, border: '1px solid var(--border, #e5e7eb)', background: 'var(--card, #fff)', fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
                        />
                    </div>
                </div>

                {/* Vehicle Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr>
                                <th style={thFirst}>Flat</th>
                                <th style={thHead}>Owner</th>
                                <th style={thHead}>Vehicle Number</th>
                                <th style={thHead}>Type</th>
                                <th style={thHead}>Sticker ID</th>
                                <th style={{ ...thLast, textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                                        No vehicles match your search.
                                    </td>
                                </tr>
                            ) : filteredVehicles.map((v, idx) => (
                                <tr key={v.id}
                                    style={{ background: idx % 2 === 0 ? 'transparent' : 'var(--hover-bg, #f8fafc)', transition: 'background .15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg, #f0f4ff)'}
                                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'var(--hover-bg, #f8fafc)'}>
                                    <td style={{ ...tdStyle, fontWeight: 700, fontFamily: 'monospace', color: '#6366f1' }}>{v.flat}</td>
                                    <td style={tdStyle}>{v.owner}</td>
                                    <td style={{ ...tdStyle, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '.03em' }}>{v.vehicleNo}</td>
                                    <td style={tdStyle}><TypeBadge type={v.type} /></td>
                                    <td style={{ ...tdStyle, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{v.stickerId}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                            <ActionBtn icon={<Eye size={13} />}    label="View"   color="#2563eb" bg="#eff6ff" onClick={() => handleView(v)} />
                                            <ActionBtn icon={<Pencil size={13} />} label="Edit"   color="#d97706" bg="#fffbeb" onClick={() => handleEdit(v)} />
                                            <ActionBtn icon={<Trash2 size={13} />} label="Delete" color="#ef4444" bg="#fef2f2" onClick={() => handleDelete(v.id)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Recent Visitors ──────────────────────────────────────────── */}
            <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border, #e5e7eb)', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={18} color="#f59e0b" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Visitors</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Today's gate activity</div>
                        </div>
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f1f5f9', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <Eye size={14} /> View Full Visitor Logs
                    </button>
                </div>

                {/* Visitor Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr>
                                <th style={thFirst}>Visitor</th>
                                <th style={thHead}>Host</th>
                                <th style={thHead}>In Time</th>
                                <th style={thHead}>Out Time</th>
                                <th style={{ ...thLast }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.map((v, idx) => (
                                <tr key={v.id}
                                    style={{ background: idx % 2 === 0 ? 'transparent' : 'var(--hover-bg, #f8fafc)', transition: 'background .15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg, #f0f4ff)'}
                                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'var(--hover-bg, #f8fafc)'}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <VisitorTypeIcon name={v.name} />
                                            <span style={{ fontWeight: 600 }}>{v.name}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{v.host}</td>
                                    <td style={{ ...tdStyle, display: 'flex', alignItems: 'center', gap: 5, color: '#2563eb', fontWeight: 600 }}>
                                        <LogIn size={13} color="#2563eb" /> {v.inTime}
                                    </td>
                                    <td style={tdStyle}>
                                        {v.outTime !== '-'
                                            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#059669', fontWeight: 600 }}><LogOut size={13} color="#059669" /> {v.outTime}</span>
                                            : <span style={{ color: '#9ca3af' }}>—</span>
                                        }
                                    </td>
                                    <td style={tdStyle}><StatusPill status={v.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── View Modal ────────────────────────────────────────────── */}
            {viewVehicle && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                    onClick={() => setViewVehicle(null)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 380, maxWidth: '92vw', boxShadow: '0 8px 32px rgba(0,0,0,.18)' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Car size={18} color="#6366f1" />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: 16 }}>Vehicle Details</span>
                            </div>
                            <button onClick={() => setViewVehicle(null)} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>×</button>
                        </div>
                        {[['Flat / Unit', viewVehicle.flat], ['Owner', viewVehicle.owner], ['Vehicle Number', viewVehicle.vehicleNo], ['Type', viewVehicle.type], ['Sticker ID', viewVehicle.stickerId]].map(([k, val]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                                <span style={{ color: '#6b7280', fontWeight: 600 }}>{k}</span>
                                <span style={{ fontWeight: 700, fontFamily: ['Vehicle Number', 'Flat / Unit', 'Sticker ID'].includes(k) ? 'monospace' : 'inherit' }}>{val}</span>
                            </div>
                        ))}
                        <button onClick={() => setViewVehicle(null)}
                            style={{ width: '100%', marginTop: 20, padding: '10px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ── Edit Modal ────────────────────────────────────────────── */}
            {editVehicle && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                    onClick={() => setEditVehicle(null)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 400, maxWidth: '92vw', boxShadow: '0 8px 32px rgba(0,0,0,.18)' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Pencil size={18} color="#d97706" />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: 16 }}>Edit Vehicle</span>
                            </div>
                            <button onClick={() => setEditVehicle(null)} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>×</button>
                        </div>
                        {[['flat','Flat / Unit'], ['owner','Owner Name'], ['vehicleNo','Vehicle Number'], ['stickerId','Sticker ID']].map(([field, lbl]) => (
                            <div key={field} style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{lbl}</label>
                                <input value={editForm[field] || ''} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #e5e7eb', fontSize: 13, boxSizing: 'border-box', outline: 'none', fontFamily: ['vehicleNo','stickerId','flat'].includes(field) ? 'monospace' : 'inherit' }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Vehicle Type</label>
                            <select value={editForm.type || ''} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid #e5e7eb', fontSize: 13 }}>
                                <option>Car</option><option>Scooter</option><option>Bike</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setEditVehicle(null)}
                                style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button onClick={handleEditSave}
                                style={{ flex: 1, padding: '10px', background: '#d97706', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleVisitorLog;
