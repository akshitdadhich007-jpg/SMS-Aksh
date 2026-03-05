import { useState, useEffect } from "react";
import api from "../../services/api";
export default function MyFines() {
  const [violations, setViolations] = useState([]);
  const [score, setScore] = useState(100);
  useEffect(() => {
    api
      .get("/api/resident/fines")
      .then((res) => {
        const data = res.data || {};
        setViolations(data.violations || []);
        setScore(data.score ?? 100);
      })
      .catch((err) => console.error("Failed to load fines:", err));
  }, []);
  const handlePay = async (id) => {
    try {
      await api.put(`/api/resident/fines/${id}/pay`);
      setViolations((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status: "Paid",
              }
            : v,
        ),
      );
    } catch (err) {
      console.error("Failed to pay fine:", err);
      alert("Failed to process payment.");
    }
  };
  return (
    <div className="p-32">
      <h1>My Fines</h1>

      <h3>
        Discipline Score:{" "}
        <span
          style={{
            color: score < 70 ? "red" : "green",
          }}
        >
          {score}
        </span>
      </h3>

      {score < 70 && (
        <p
          style={{
            color: "red",
          }}
        >
          ⚠ Warning: Low Discipline Score
        </p>
      )}

      {score < 60 && (
        <div
          style={{
            background: "#ffe6e6",
            borderRadius: "var(--radius-md)",
          }}
          className="p-16 mt-16"
        >
          🚫 Facility Booking Restricted Due To Low Discipline Score
        </div>
      )}

      {violations.length === 0 ? (
        <p>No fines yet 🎉</p>
      ) : (
        violations.map((v) => (
          <div
            key={v.id}
            style={{
              border: "1px solid gray",
              borderRadius: "var(--radius-md)",
            }}
            className="p-16 mb-16"
          >
            <img src={v.image} width="200" alt="violation" />
            <p>
              <strong>Type:</strong> {v.type}
            </p>
            <p>
              <strong>Fine:</strong> ₹{v.fine}
            </p>
            <p>
              <strong>Status:</strong> {v.status}
            </p>
            <p>
              <strong>Date:</strong> {v.date}
            </p>

            {v.status === "Pending" && (
              <button
                onClick={() => handlePay(v.id)}
                style={{
                  padding: "8px 16px",
                  background: "green",
                  color: "white",
                  borderRadius: "var(--radius-md)",
                }}
                className="mt-16"
              >
                Pay Fine
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
