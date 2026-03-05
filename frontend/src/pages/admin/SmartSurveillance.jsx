import { useState, useEffect } from "react";
import api from "../../services/api";
export default function SmartSurveillance() {
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [allViolations, setAllViolations] = useState([]);
  const [violationType, setViolationType] = useState("Wrong Parking");
  const [filter, setFilter] = useState("All");
  const [showAlert, setShowAlert] = useState(false);
  const [customType, setCustomType] = useState("");
  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    try {
      const { data } = await api.get("/api/admin/surveillance/violations");
      setAllViolations(data || []);
    } catch (err) {
      console.error("Failed to fetch violations", err);
      // Removed the localStorage fallback
    }
  };

  const handleScan = async () => {
    if (!image) return alert("Upload image first");
    setScanning(true);

    // Convert blob to base64 for API transmission if it's an object URL
    // For demo simplicity, sending standard payload
    const payload = {
      type: violationType === "Custom" ? customType || "Custom Violation" : violationType,
      image_data: image // Assuming base64 or URL is handled by backend logic
    };

    try {
      const { data } = await api.post("/api/admin/surveillance/violations", payload);
      setAllViolations(prev => [data, ...prev]);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setResult(data);
    } catch (err) {
      console.error("Failed to post violation", err);
      alert("Failed to analyze image. Ensure database is connected.");
    } finally {
      setScanning(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this violation record?")) {
        await api.delete(`/api/admin/surveillance/violations/${id}`);
        setAllViolations(prev => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };
  const total = allViolations.length;
  const collected = allViolations
    .filter((v) => v.status === "Paid")
    .reduce((sum, v) => sum + v.fine, 0);
  const filteredViolations =
    filter === "All"
      ? allViolations
      : allViolations.filter((v) => v.status === filter);
  const getLeaderboard = () => {
    const residents = {};
    allViolations.forEach((v) => {
      if (!residents[v.resident]) {
        residents[v.resident] = 100;
      }
      residents[v.resident] += v.scoreImpact || 0;
    });
    const leaderboard = Object.keys(residents).map((name) => ({
      name,
      score: residents[name],
    }));
    return leaderboard.sort((a, b) => b.score - a.score).slice(0, 5);
  };
  const leaderboard = getLeaderboard();
  const downloadCSV = () => {
    const headers = ["ID", "Resident", "Type", "Fine", "Status", "Date"];
    const rows = allViolations.map((v) => [
      v.id,
      v.resident,
      v.type,
      v.fine,
      v.status,
      v.date,
    ]);
    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "violations_report.csv");
    document.body.appendChild(link);
    link.click();
  };
  return (
    <div className="p-32">
      <h1>CivicGuard AI — Smart Surveillance & Discipline Monitoring</h1>
      <p
        style={{
          color: "gray",
        }}
      >
        Automated violation detection, fine generation, and resident behavior
        analytics.
      </p>

      {showAlert && (
        <div
          style={{
            background: "#ff4d4d",
            color: "white",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
            fontWeight: "bold",
          }}
          className="p-16 mb-16"
        >
          🚨 Violation Recorded & Fine Generated!
        </div>
      )}

      <div
        style={{
          display: "flex",
        }}
        className="gap-16 mb-32"
      >
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "var(--radius-md)",
            width: "200px",
            textAlign: "center",
          }}
          className="p-16"
        >
          <h4>Total Violations</h4>
          <h2>{total}</h2>
        </div>

        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "var(--radius-md)",
            width: "200px",
            textAlign: "center",
          }}
          className="p-16"
        >
          <h4>Total Collected</h4>
          <h2>₹{collected}</h2>
        </div>
      </div>

      <div className="mb-16">
        <input
          type="file"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
        />

        <select
          value={violationType}
          onChange={(e) => setViolationType(e.target.value)}
          className="ml-16"
        >
          <option value="Wrong Parking">Wrong Parking</option>
          <option value="Littering">Littering</option>
          <option value="Custom">Custom</option>
        </select>

        {violationType === "Custom" && (
          <input
            type="text"
            placeholder="Enter custom violation type..."
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid #ccc",
              width: "200px",
            }}
            className="ml-16"
          />
        )}

        <button
          onClick={handleScan}
          style={{
            padding: "8px 16px",
            background: "black",
            color: "white",
            borderRadius: "var(--radius-md)",
          }}
          className="ml-16"
        >
          {scanning ? "🔍 AI Scanning..." : "Run AI Scan"}
        </button>
      </div>

      {result && (
        <div className="mb-16">
          <h3>Violation Detected ✅</h3>
          <img src={result.image} width="200" alt="violation" />
          <p>Type: {result.type}</p>
          <p>Fine: ₹{result.fine}</p>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}

      <h2>Violation Records</h2>

      <button
        onClick={downloadCSV}
        style={{
          padding: "8px 16px",
          background: "green",
          color: "white",
          borderRadius: "var(--radius-md)",
        }}
        className="mb-16"
      >
        Download Report (CSV)
      </button>

      <div className="mb-16">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resident</th>
            <th>Type</th>
            <th>Fine</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredViolations.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.resident}</td>
              <td>{v.type}</td>
              <td>₹{v.fine}</td>
              <td
                style={{
                  color: v.status === "Paid" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {v.status}
              </td>
              <td>{v.date}</td>
              <td>
                <button
                  onClick={() => handleDelete(v.id)}
                  style={{
                    background: "red",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-32">Top Discipline Residents</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Resident</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((r, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{r.name}</td>
              <td>{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
