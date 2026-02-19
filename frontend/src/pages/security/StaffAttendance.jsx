import { useState, useRef } from "react";

export default function StaffAttendance() {
    const [location, setLocation] = useState(null);
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState("");
    const [stream, setStream] = useState(null);
    const [scanningFace, setScanningFace] = useState(false);

    const videoRef = useRef(null);

    // 🔹 Society Location (CHANGE to your real location)
    const societyLocation = {
        lat: 26.3515,
        lng: 73.0502,
    };

    const allowedRadius = 200; // meters

    // 🔹 Distance Formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) *
            Math.cos(φ2) *
            Math.sin(Δλ / 2) *
            Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    // 🔹 Get GPS
    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => alert("Location access denied")
        );
    };

    // 🔹 Start Camera
    const startCamera = async () => {
        try {
            const mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                });

            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
            setScanningFace(true);
        } catch (err) {
            alert("Camera access denied");
        }
    };

    // 🔹 Capture Photo
    const capturePhoto = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0);

        const imageData = canvas.toDataURL("image/png");
        setImage(imageData);

        // Stop camera after capture
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setScanningFace(false);
    };

    // 🔹 Mark Attendance
    const markAttendance = () => {
        if (!location || !image) {
            alert("Capture location and photo first");
            return;
        }

        const distance = calculateDistance(
            societyLocation.lat,
            societyLocation.lng,
            location.lat,
            location.lng
        );

        if (distance > allowedRadius) {
            alert("❌ Outside society boundary. Attendance denied.");
            return;
        }

        const attendance = {
            id: Date.now(),
            staff: "Security Guard",
            time: new Date().toLocaleString(),
            location,
            image,
            status: "Verified",
        };

        const existing =
            JSON.parse(localStorage.getItem("attendance")) || [];

        localStorage.setItem(
            "attendance",
            JSON.stringify([...existing, attendance])
        );

        setStatus("Attendance Marked Successfully ✅");
    };

    return (
        <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
            <h1 style={{ textAlign: "center" }}>
                GPS Photo Attendance
            </h1>

            <div
                style={{
                    background: "#f5f5f5",
                    padding: "25px",
                    borderRadius: "15px",
                    marginTop: "30px",
                    textAlign: "center",
                }}
            >
                <button
                    onClick={getLocation}
                    style={{
                        padding: "10px 20px",
                        background: "black",
                        color: "white",
                        borderRadius: "10px",
                    }}
                >
                    Get Live Location
                </button>

                {location && (
                    <>
                        <p style={{ marginTop: "15px" }}>
                            <strong>Location:</strong>{" "}
                            {location.lat}, {location.lng}
                        </p>

                        <p
                            style={{
                                color:
                                    calculateDistance(
                                        societyLocation.lat,
                                        societyLocation.lng,
                                        location.lat,
                                        location.lng
                                    ) > allowedRadius
                                        ? "red"
                                        : "green",
                                fontWeight: "bold",
                            }}
                        >
                            Distance from Society:{" "}
                            {Math.floor(
                                calculateDistance(
                                    societyLocation.lat,
                                    societyLocation.lng,
                                    location.lat,
                                    location.lng
                                )
                            )} meters
                        </p>
                    </>
                )}

                <br />

                <button
                    onClick={startCamera}
                    style={{
                        padding: "8px 16px",
                        background: "black",
                        color: "white",
                        borderRadius: "8px",
                        marginTop: "10px",
                    }}
                >
                    Open Camera
                </button>

                <br />

                <div
                    style={{
                        width: "250px",
                        height: "200px",
                        marginTop: "15px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        background: "#000",
                        border: scanningFace ? "3px solid limegreen" : "none",
                        boxShadow: scanningFace
                            ? "0 0 15px limegreen"
                            : "none",
                        position: "relative",
                        margin: "auto"
                    }}
                >
                    {scanningFace && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "3px",
                                background: "limegreen",
                                animation: "scan 2s linear infinite",
                            }}
                        />
                    )}
                    {image ? (
                        <img
                            src={image}
                            alt="Captured"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    )}
                </div>

                <br />

                <button
                    onClick={capturePhoto}
                    style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        background: "blue",
                        color: "white",
                        borderRadius: "8px",
                    }}
                >
                    Capture Photo
                </button>



                <br />

                <button
                    onClick={markAttendance}
                    style={{
                        marginTop: "20px",
                        padding: "10px 25px",
                        background: "green",
                        color: "white",
                        borderRadius: "10px",
                    }}
                >
                    Mark Attendance
                </button>

                {status && (
                    <p
                        style={{
                            marginTop: "15px",
                            color: "green",
                            fontWeight: "bold",
                        }}
                    >
                        {status}
                    </p>
                )}
            </div>
            <style>
                {`
                    @keyframes scan {
                        0% { top: 0; }
                        100% { top: 100%; }
                    }
                `}
            </style>
        </div>
    );
}
