import { useState, useEffect } from "react";

export default function MyFines() {
    const [violations, setViolations] = useState([]);
    const [score, setScore] = useState(100);
    const loggedInResident = "A-102";

    useEffect(() => {
        const stored =
            JSON.parse(localStorage.getItem("violations")) || [];

        const filtered = stored.filter(
            (v) => v.resident === loggedInResident
        );

        setViolations(filtered);

        const totalImpact = filtered.reduce(
            (sum, v) => sum + (v.scoreImpact || 0),
            0
        );

        setScore(100 + totalImpact);
    }, []);

    const handlePay = (id) => {
        const stored =
            JSON.parse(localStorage.getItem("violations")) || [];

        const updated = stored.map((v) =>
            v.id === id ? { ...v, status: "Paid" } : v
        );

        localStorage.setItem("violations", JSON.stringify(updated));

        const updatedViolations = updated.filter(
            (v) => v.resident === loggedInResident
        );

        setViolations(updatedViolations);

        // Recalculate score after payment? 
        // Usually score impact remains unless the violation is removed or specific logic exists. 
        // The user didn't specify changing score on payment, just the initial calculation logic.
        // However, if the violation status changes to Paid, does it still impact score?
        // The logic above: `sum + (v.scoreImpact || 0)` iterates over ALL filtered violations for the resident.
        // regardless of status. So paying a fine doesn't restore the score (which makes sense for a "history" score),
        // unless the logic filters by status. The user's provided code for useEffect iterates over 'filtered' which includes all.
        // So current logic: paying fine does NOT restore score. This seems to be the intended behavior for now.

        const totalImpact = updatedViolations.reduce(
            (sum, v) => sum + (v.scoreImpact || 0),
            0
        );
        setScore(100 + totalImpact);
    };

    return (
        <div style={{ padding: "40px" }}>
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
                <p style={{ color: "red" }}>
                    ⚠ Warning: Low Discipline Score
                </p>
            )}

            {score < 60 && (
                <div
                    style={{
                        background: "#ffe6e6",
                        padding: "10px",
                        borderRadius: "8px",
                        marginTop: "10px",
                    }}
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
                            padding: "20px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                        }}
                    >
                        <img src={v.image} width="200" alt="violation" />
                        <p><strong>Type:</strong> {v.type}</p>
                        <p><strong>Fine:</strong> ₹{v.fine}</p>
                        <p><strong>Status:</strong> {v.status}</p>
                        <p><strong>Date:</strong> {v.date}</p>

                        {v.status === "Pending" && (
                            <button
                                onClick={() => handlePay(v.id)}
                                style={{
                                    marginTop: "10px",
                                    padding: "8px 16px",
                                    background: "green",
                                    color: "white",
                                    borderRadius: "8px",
                                }}
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
