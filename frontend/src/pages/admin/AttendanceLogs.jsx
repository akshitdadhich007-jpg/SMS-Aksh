import { useEffect, useState } from "react";

export default function AttendanceLogs() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const stored =
            JSON.parse(localStorage.getItem("attendance")) || [];
        setRecords(stored);
    }, []);

    const clearLogs = () => {
        localStorage.removeItem("attendance");
        setRecords([]);
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>Staff Attendance Logs</h1>
            <p style={{ color: "gray" }}>
                GPS-verified attendance records from security staff.
            </p>

            {records.length > 0 && (
                <button
                    onClick={clearLogs}
                    style={{
                        marginBottom: "20px",
                        padding: "8px 16px",
                        background: "red",
                        color: "white",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Clear Old Records
                </button>
            )}

            {records.length === 0 && (
                <p style={{ marginTop: "20px" }}>No attendance records yet. Mark attendance from the Security panel first.</p>
            )}

            {records.map((r) => (
                <div
                    key={r.id}
                    style={{
                        border: "1px solid gray",
                        padding: "15px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                    }}
                >
                    <p><strong>Name:</strong> {r.staff}</p>
                    <p><strong>Time:</strong> {r.time}</p>
                    <p>
                        <strong>Location:</strong> {r.location.lat}, {r.location.lng}
                    </p>
                    <p><strong>Status:</strong> {r.status}</p>
                    {r.image && r.image.startsWith("data:") ? (
                        <img
                            src={r.image}
                            alt="proof"
                            style={{
                                width: "200px",
                                marginTop: "10px",
                                borderRadius: "10px",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <p style={{ color: "gray", marginTop: "10px", fontStyle: "italic" }}>
                            📷 Photo not available (old record)
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
