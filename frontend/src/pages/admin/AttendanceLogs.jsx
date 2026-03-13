import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users, UserCheck, UserX, Clock,
    ClipboardList, Search, Trash2, Download,
    MapPin, Camera, Shield, CalendarDays,
    CheckCircle2, XCircle, ExternalLink
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { subscribeToTodayAttendance } from "../../firebase/attendanceService";
import "../../styles/AttendanceLogs.css";

export default function AttendanceLogs() {
    const [records, setRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [lightboxImg, setLightboxImg] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const societyId = user?.societyId || "default-society";

    const formatLocationLabel = (address = {}, fallback = "") => {
        const landmark = [
            address.amenity,
            address.attraction,
            address.building,
            address.shop,
            address.leisure,
            address.tourism,
            address.historic,
        ].filter(Boolean)[0];

        const micro = [
            address.house_number,
            address.road || address.pedestrian,
            address.residential,
            address.neighbourhood || address.suburb,
            address.city_district,
        ].filter(Boolean).join(' ');

        const locality = micro || address.neighbourhood || address.suburb || address.village || address.town || address.city_district;
        const city = address.city || address.town || address.village || address.county || address.state_district;
        const state = address.state;
        const pincode = address.postcode;
        const parts = [locality, city, state, pincode].filter(Boolean);
        if (parts.length > 0) {
            const base = parts.join(', ');
            return landmark ? `Near ${landmark}, ${base}` : base;
        }
        return fallback || 'Location name unavailable';
    };

    const resolveLocationName = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
            if (!response.ok) return 'Location name unavailable';
            const result = await response.json();
            return formatLocationLabel(result?.address || {}, result?.display_name || '');
        } catch {
            return 'Location name unavailable';
        }
    };

    useEffect(() => {
        const unsub = subscribeToTodayAttendance(societyId, setRecords);
        return () => unsub && unsub();
    }, [societyId]);

    const clearLogs = () => {
        // clearing is destructive; for now simply no-op on Firestore and clear local view
        setRecords([]);
    };

    // ── Derived stats ──
    const stats = useMemo(() => {
        const total = records.length;
        const present = records.filter(r => (r.status || '').toLowerCase() === "present" || (r.status || '').toLowerCase() === "checked in").length;
        const absent = records.filter(r => r.status?.toLowerCase() === "absent").length;
        const late = records.filter(r => r.status?.toLowerCase() === "late").length;
        return { total, present: present || total, absent, late };
    }, [records]);

    // ── Filtering (UI-only) ──
    const filteredRecords = useMemo(() => {
        let result = records;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.staff?.toLowerCase().includes(q) ||
                r.status?.toLowerCase().includes(q)
            );
        }
        if (statusFilter !== "All") {
            result = result.filter(r => {
                const s = r.status?.toLowerCase() || "";
                if (statusFilter === "Present") return s === "present" || s === "checked in";
                if (statusFilter === "Absent") return s === "absent";
                if (statusFilter === "Late") return s === "late";
                return true;
            });
        }
        return result;
    }, [records, searchQuery, statusFilter]);

    const getStatusBadge = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "present" || s === "checked in") return "b-present";
        if (s === "absent") return "b-absent";
        if (s === "late") return "b-late";
        return "b-present";
    };

    const getLocationText = (record) => {
        const locationObj = record?.location;
        if (!locationObj) return 'N/A';

        const locationName = locationObj.name || record.locationName;
        if (locationName && locationName !== 'Location name unavailable') {
            return locationName;
        }

        if (typeof locationObj.lat === 'number' && typeof locationObj.lng === 'number') {
            return `${locationObj.lat.toFixed(4)}, ${locationObj.lng.toFixed(4)}`;
        }

        return 'N/A';
    };

    return (
        <div className="al-page">
            {/* ── Hero ── */}
            <div className="al-hero">
                <div className="al-hero-content">
                    <div className="al-hero-icon"><ClipboardList size={26} /></div>
                    <div>
                        <h1>Staff Attendance Logs</h1>
                        <p>GPS-verified attendance records from security staff — track check-ins, locations, and compliance</p>
                    </div>
                </div>
            </div>

            <div className="al-content">
                {/* ── Stats ── */}
                <div className="al-stats-grid">
                    <div className="al-stat-card st-teal">
                        <div className="al-stat-icon ic-teal"><Users size={22} /></div>
                        <div>
                            <div className="al-stat-label">Total Staff</div>
                            <div className="al-stat-value">{stats.total}</div>
                        </div>
                    </div>
                    <div className="al-stat-card st-green">
                        <div className="al-stat-icon ic-green"><UserCheck size={22} /></div>
                        <div>
                            <div className="al-stat-label">Present Today</div>
                            <div className="al-stat-value">{stats.present}</div>
                        </div>
                    </div>
                    <div className="al-stat-card st-red">
                        <div className="al-stat-icon ic-red"><UserX size={22} /></div>
                        <div>
                            <div className="al-stat-label">Absent Today</div>
                            <div className="al-stat-value">{stats.absent}</div>
                        </div>
                    </div>
                    <div className="al-stat-card st-amber">
                        <div className="al-stat-icon ic-amber"><Clock size={22} /></div>
                        <div>
                            <div className="al-stat-label">Late Check-ins</div>
                            <div className="al-stat-value">{stats.late}</div>
                        </div>
                    </div>
                </div>

                {/* ── Records Section ── */}
                <div className="al-section">
                    <div className="al-section-header">
                        <div className="al-section-title">
                            <div className="icon"><ClipboardList size={18} /></div>
                            <h2>Attendance Records</h2>
                        </div>
                        <div className="al-controls">
                            <div className="al-search-wrap">
                                <Search size={14} className="search-icon" />
                                <input
                                    className="al-search"
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="al-filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                            </select>
                            {records.length > 0 && (
                                <button className="al-btn-outline al-btn-danger" onClick={clearLogs}>
                                    <Trash2 size={14} /> Clear Logs
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredRecords.length === 0 ? (
                        <div className="al-empty">
                            <div className="al-empty-icon"><ClipboardList size={36} /></div>
                            <h3>No Attendance Records</h3>
                            <p>Staff attendance will appear here once check-ins are recorded from the Security panel</p>
                            <button className="al-empty-btn" onClick={() => navigate('/security')}>
                                <Shield size={16} /> View Security Panel
                            </button>
                        </div>
                    ) : (
                        <div className="al-table-wrap">
                            <table className="al-table">
                                <thead>
                                    <tr>
                                        <th>Staff Name</th>
                                        <th>Check-in Time</th>
                                        <th>GPS Location</th>
                                        <th>Location Verified</th>
                                        <th>Status</th>
                                        <th>Photo Proof</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map((r) => (
                                        <tr key={r.id}>
                                            <td style={{ fontWeight: 600 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: '50%',
                                                        background: '#eef2ff', color: '#4f46e5',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 800, fontSize: 13, flexShrink: 0
                                                    }}>
                                                        {(r.staff || 'S')[0].toUpperCase()}
                                                    </div>
                                                    {r.staff}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13 }}>
                                                    <CalendarDays size={13} /> {r.time}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: '#64748b', maxWidth: 220 }}>
                                                    <MapPin size={13} />
                                                    <span style={{ lineHeight: 1.35 }}>{getLocationText(r)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {r.location ? (
                                                    <span className="al-badge b-verified">
                                                        <CheckCircle2 size={12} /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="al-badge b-unverified">
                                                        <XCircle size={12} /> Unverified
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`al-badge ${getStatusBadge(r.status)}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td>
                                                {r.image && r.image.startsWith("data:") ? (
                                                    <img
                                                        src={r.image}
                                                        alt="proof"
                                                        className="al-proof-thumb"
                                                        onClick={() => setLightboxImg(r.image)}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                                                        <Camera size={12} /> N/A
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {r.image && r.image.startsWith("data:") && (
                                                    <button
                                                        className="al-btn-outline"
                                                        onClick={() => setLightboxImg(r.image)}
                                                        style={{ fontSize: 12, padding: '5px 10px' }}
                                                    >
                                                        <ExternalLink size={12} /> View
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Lightbox ── */}
            {lightboxImg && (
                <div className="al-lightbox" onClick={() => setLightboxImg(null)}>
                    <img src={lightboxImg} alt="Attendance proof" />
                </div>
            )}
        </div>
    );
}
