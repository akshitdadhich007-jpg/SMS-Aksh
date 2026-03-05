import { useEffect, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../components/ui/Toast";

export default function AttendanceLogs() {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/admin/attendance");
      setRecords(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch attendance logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const clearLogs = async () => {
    try {
      await api.delete("/api/admin/attendance/clear");
      toast.success("Old records cleared");
      fetchRecords();
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear old records.");
    }
  };
  return (
    <div className="p-32">
      <h1>Staff Attendance Logs</h1>
      <p
        style={{
          color: "gray",
        }}
      >
        GPS-verified attendance records from security staff.
      </p>

      {records.length > 0 && (
        <button
          onClick={clearLogs}
          style={{
            padding: "8px 16px",
            background: "red",
            color: "white",
            borderRadius: "var(--radius-md)",
            border: "none",
            cursor: "pointer",
          }}
          className="mb-16"
        >
          Clear Old Records
        </button>
      )}

      {isLoading ? (
        <p className="mt-16">Loading attendance records...</p>
      ) : records.length === 0 && (
        <p className="mt-16">
          No attendance records yet. Mark attendance from the Security panel
          first.
        </p>
      )}

      {records.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid gray",
            borderRadius: "var(--radius-md)",
          }}
          className="p-16 mb-16"
        >
          <p>
            <strong>Name:</strong> {r.staff?.name || "Security Guard"} ({r.staff?.role || "Staff"})
          </p>
          <p>
            <strong>Check-In:</strong> {new Date(r.check_in).toLocaleString()}
          </p>
          {r.location && r.location.lat && (
            <p>
              <strong>Location:</strong> {r.location.lat}, {r.location.lng}
            </p>
          )}
          <p>
            <strong>Status:</strong> {r.status}
          </p>
          {r.photo_url && r.photo_url.startsWith("data:") ? (
            <img
              src={r.photo_url}
              alt="proof"
              style={{
                width: "200px",
                borderRadius: "var(--radius-md)",
                objectFit: "cover",
              }}
              className="mt-16"
            />
          ) : (
            <p
              style={{
                color: "gray",
                fontStyle: "italic",
              }}
              className="mt-16"
            >
              📷 Photo not available (old record)
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
