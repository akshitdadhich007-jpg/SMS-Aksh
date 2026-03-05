import { useState, useRef } from "react";
import api from "../../services/api";
import { useToast } from "../../components/ui/Toast";

export default function StaffAttendance() {
  const toast = useToast();
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
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
      () => alert("Location access denied"),
    );
  };

  // 🔹 Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
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
  const markAttendance = async () => {
    if (!location || !image) {
      toast.error("Capture location and photo first");
      return;
    }
    const distance = calculateDistance(
      societyLocation.lat,
      societyLocation.lng,
      location.lat,
      location.lng,
    );
    if (distance > allowedRadius) {
      toast.error("Outside society boundary. Attendance denied.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Submitting...");

    try {
      const payload = {
        staff_id: JSON.parse(localStorage.getItem('user'))?.id, // Assuming user context is here
        date: new Date().toISOString().split('T')[0],
        check_in: new Date().toISOString(),
        status: "Verified",
        photo_url: image
      };

      await api.post('/api/security/attendance', payload);
      setStatus("Attendance Marked Successfully ✅");
      toast.success("Attendance marked!");

      // Reset form
      setTimeout(() => {
        setImage(null);
        setLocation(null);
        setStatus("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to mark attendance.");
      toast.error("Error submitting attendance");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
      }}
      className="p-32"
    >
      <h1
        style={{
          textAlign: "center",
        }}
      >
        GPS Photo Attendance
      </h1>

      <div
        style={{
          background: "#f5f5f5",
          borderRadius: "var(--radius-md)",
          textAlign: "center",
        }}
        className="p-24 mt-32"
      >
        <button
          onClick={getLocation}
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
            borderRadius: "var(--radius-md)",
          }}
        >
          Get Live Location
        </button>

        {location && (
          <>
            <p className="mt-16">
              <strong>Location:</strong> {location.lat}, {location.lng}
            </p>

            <p
              style={{
                color:
                  calculateDistance(
                    societyLocation.lat,
                    societyLocation.lng,
                    location.lat,
                    location.lng,
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
                  location.lng,
                ),
              )}{" "}
              meters
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
            borderRadius: "var(--radius-md)",
          }}
          className="mt-16"
        >
          Open Camera
        </button>

        <br />

        <div
          style={{
            width: "250px",
            height: "200px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            background: "#000",
            border: scanningFace ? "3px solid limegreen" : "none",
            boxShadow: scanningFace ? "0 0 15px limegreen" : "none",
            position: "relative",
            margin: "auto",
          }}
          className="mt-16"
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
            padding: "8px 16px",
            background: "blue",
            color: "white",
            borderRadius: "var(--radius-md)",
          }}
          className="mt-16"
        >
          Capture Photo
        </button>

        <br />

        <button
          onClick={markAttendance}
          disabled={isSubmitting}
          style={{
            padding: "10px 25px",
            background: isSubmitting ? "gray" : "green",
            color: "white",
            borderRadius: "var(--radius-md)",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
          className="mt-16"
        >
          {isSubmitting ? "Processing..." : "Mark Attendance"}
        </button>

        {status && (
          <p
            style={{
              color: "green",
              fontWeight: "bold",
            }}
            className="mt-16"
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
