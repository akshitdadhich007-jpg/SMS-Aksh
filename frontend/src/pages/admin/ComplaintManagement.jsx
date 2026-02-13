import React, { useState, useMemo } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';
import { Search, Filter, Download, Eye, CheckCircle, Clock, AlertCircle, MessageSquare, MoreVertical, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal.jsx';

const ComplaintManagement = () => {
    // Mock Data
    const [complaints, setComplaints] = useState([
        { id: 'CMP-2026-001', resident: 'Raj Kumar (A-101)', category: 'Plumbing', description: 'Leaking pipe in master bedroom bathroom causing dampness on wall.', status: 'Pending', date: '2026-02-10', priority: 'High' },
        { id: 'CMP-2026-002', resident: 'Anita Desai (B-205)', category: 'Electrical', description: 'Corridor light flickering outside unit constantly.', status: 'Resolved', date: '2026-02-08', priority: 'Medium' },
        { id: 'CMP-2026-003', resident: 'Vikram Singh (C-304)', category: 'Noise', description: 'Loud music from club house late night yesterday.', status: 'Resolved', date: '2026-02-05', priority: 'Low' },
        { id: 'CMP-2026-004', resident: 'Suresh Raina (A-202)', category: 'Cleanliness', description: 'Staircase not swept for 2 days. Dust accumulating.', status: 'In Progress', date: '2026-02-11', priority: 'Medium' },
        { id: 'CMP-2026-005', resident: 'Meera Iyer (D-101)', category: 'Security', description: 'Unknown person tailgating through main gate.', status: 'Pending', date: '2026-02-12', priority: 'High' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate Stats
    const stats = useMemo(() => {
        const total = complaints.length;
        const pending = complaints.filter(c => c.status === 'Pending').length;
        const resolved = complaints.filter(c => c.status === 'Resolved').length;
        const inProgress = complaints.filter(c => c.status === 'In Progress').length;
        return { total, pending, resolved, inProgress };
    }, [complaints]);

    // Filter Logic
    const filteredComplaints = useMemo(() => {
        return complaints.filter(c => {
            const matchesSearch = 
                c.resident.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [complaints, searchTerm, statusFilter]);

    const handleViewDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedComplaint(null);
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this complaint?')) {
            setComplaints(prev => prev.filter(c => c.id !== id));
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'High': return '#ef4444';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#10b981';
            default: return '#6b7280';
        }
    };

    // Inline Styles for Dashboard
    const styles = {
        pageContainer: {
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            padding: '0 24px',
        },
        statsGrid: {
            width: '100%'
        },
        statCard: {
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '140px',
            transition: 'transform 0.2s',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
            gap: '12px'
        },
        statHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 0 // Remove margin to rely on gap for perfect spacing
        },
        statLabel: {
            color: '#6b7280',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            margin: '4px 0 0 0',
            lineHeight: 1
        },
        iconBox: (color) => ({
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }),
        controlsBar: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            backgroundColor: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        },
        searchBox: {
            position: 'relative',
            flex: '1',
            minWidth: '300px'
        },
        searchInput: {
            width: '100%',
            height: '42px', 
            padding: '0 16px 0 40px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
        },
        searchIcon: {
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            pointerEvents: 'none'
        },
        filterGroup: {
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
        },
        filterSelect: {
            height: '42px',
            padding: '0 36px 0 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            outline: 'none',
            minWidth: '150px',
            backgroundColor: 'white',
            cursor: 'pointer'
        },
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
        },
        tableHeader: {
            backgroundColor: '#f9fafb',
            padding: '16px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        rowActionBtn: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            color: '#6b7280'
        }
    };

    return (
        <div className="complaint-management-page" style={styles.pageContainer}>
            {/* Custom Header for strict alignment */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#111827' }}>Complaint Management</h1>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Efficiently track, manage, and resolve resident issues</p>
            </div>

            {/* Stats Dashboard */}
            <div className="stats-grid" style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={styles.iconBox('#3b82f6')}><MessageSquare size={24} /></div>
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>+2 this week</span>
                    </div>
                    <div>
                        <span style={styles.statLabel}>Total Complaints</span>
                        <h3 style={styles.statValue}>{stats.total}</h3>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={styles.iconBox('#f59e0b')}><AlertCircle size={24} /></div>
                        <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '500' }}>Requires attention</span>
                    </div>
                    <div>
                        <span style={styles.statLabel}>Pending</span>
                        <h3 style={styles.statValue}>{stats.pending}</h3>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={styles.iconBox('#6366f1')}><Clock size={24} /></div>
                        <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: '500' }}>Active resolutions</span>
                    </div>
                    <div>
                        <span style={styles.statLabel}>In Progress</span>
                        <h3 style={styles.statValue}>{stats.inProgress}</h3>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <div style={styles.iconBox('#10b981')}><CheckCircle size={24} /></div>
                        <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>{Math.round((stats.resolved / stats.total) * 100 || 0)}% completed</span>
                    </div>
                    <div>
                        <span style={styles.statLabel}>Resolved</span>
                        <h3 style={styles.statValue}>{stats.resolved}</h3>
                    </div>
                </div>
            </div>

            {/* Controls & Filter Bar */}
            <div style={styles.controlsBar}>
                <div style={styles.searchBox}>
                    <Search size={18} style={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by ID, Resident, Category..." 
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={styles.filterGroup}>
                    <select 
                        style={styles.filterSelect}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                    <Button 
                        variant="outline" 
                        style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }} 
                        icon={<Filter size={16} />}
                    >
                        Advanced
                    </Button>
                    <Button 
                        variant="secondary" 
                        style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }} 
                        icon={<Download size={16} />}
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Modern Table */}
            <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>All Complaints</h3>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Showing {filteredComplaints.length} entries</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <th style={{ width: '12%', padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>ID / Date</th>
                                <th style={{ width: '18%', padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Resident</th>
                                <th style={{ width: '14%', padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Category</th>
                                <th style={{ width: '26%', padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Description</th>
                                <th style={{ width: '10%', padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Priority</th>
                                <th style={{ width: '10%', padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ width: '10%', padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map((complaint) => (
                                    <tr key={complaint.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.15s' }} className="hover:bg-gray-50">
                                        <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                                            <div style={{ fontWeight: '600', color: '#111827' }}>{complaint.id}</div>
                                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{complaint.date}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px' }}>
                                                    {complaint.resident.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '500', color: '#374151' }}>{complaint.resident.split('(')[0]}</div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{complaint.resident.match(/\((.*?)\)/)?.[1] || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                                            <span style={{ padding: '4px 10px', backgroundColor: '#f3f4f6', borderRadius: '6px', fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>
                                                {complaint.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                                            <div style={{ 
                                                whiteSpace: 'nowrap', 
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis', 
                                                color: '#4b5563',
                                                maxWidth: '100%',
                                                display: 'block'
                                            }}>
                                                {complaint.description}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getPriorityColor(complaint.priority) }}></div>
                                                <span style={{ fontSize: '13px', color: '#374151' }}>{complaint.priority}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'center', verticalAlign: 'middle' }}>
                                            <StatusBadge status={complaint.status} />
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', verticalAlign: 'middle' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button 
                                                    style={{...styles.rowActionBtn, color: '#3b82f6', backgroundColor: '#eff6ff'}} 
                                                    title="View Details"
                                                    onClick={() => handleViewDetails(complaint)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    style={{...styles.rowActionBtn, color: '#ef4444', backgroundColor: '#fef2f2'}} 
                                                    title="Delete"
                                                    onClick={() => handleDelete(complaint.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <Search size={32} style={{ opacity: 0.2 }} />
                                            <p>No complaints found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Complaint Details"
            >
                {selectedComplaint && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>#{selectedComplaint.id}</h3>
                                <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>Posted on {selectedComplaint.date}</p>
                            </div>
                            <StatusBadge status={selectedComplaint.status} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px', letterSpacing: '0.05em' }}>Resident</label>
                                <div style={{ fontWeight: '500', color: '#111827' }}>{selectedComplaint.resident}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px', letterSpacing: '0.05em' }}>Category</label>
                                <div style={{ fontWeight: '500', color: '#111827' }}>{selectedComplaint.category}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px', letterSpacing: '0.05em' }}>Priority</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getPriorityColor(selectedComplaint.priority) }}></div>
                                    <span style={{ fontWeight: '500', color: '#374151' }}>{selectedComplaint.priority}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '8px', letterSpacing: '0.05em' }}>Description</label>
                            <p style={{ margin: 0, color: '#374151', lineHeight: '1.5' }}>{selectedComplaint.description}</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                            <Button variant="outline" onClick={handleCloseModal}>Close</Button>
                            <Button variant="primary">Update Status</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
export default ComplaintManagement;
