<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";
import {
    MapPin,
    Camera,
    Camera as CameraIcon,
    ScanFace,
    CheckCircle2,
    ShieldCheck,
    Clock,
    UserCheck,
    Navigation,
    Aperture
} from "lucide-react";
import "../../styles/StaffAttendance.css";

export default function StaffAttendance() {
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState("");
    const [isResolvingLocation, setIsResolvingLocation] = useState(false);
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState("");
    const [stream, setStream] = useState(null);
    const [scanningFace, setScanningFace] = useState(false);

    // UI states
    const [currentTime, setCurrentTime] = useState(new Date());

    const videoRef = useRef(null);
=======
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
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f

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

<<<<<<< HEAD
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
            const base = parts.join(", ");
            return landmark ? `Near ${landmark}, ${base}` : base;
        }

        return fallback || "Location name unavailable";
    };

    const resolveLocationName = async (lat, lng) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 7000);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Unable to fetch location name');
            }

            const result = await response.json();
            const fallbackName = result?.display_name || '';
            return formatLocationLabel(result?.address || {}, fallbackName);
        } catch (_error) {
            return "Location name unavailable";
        }
    };

    // Live clock update
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 🔹 Distance Formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
=======
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
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f

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

<<<<<<< HEAD
    // 🔹 Get GPS
    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setLocation({
                    lat,
                    lng,
                });

                setIsResolvingLocation(true);
                setLocationName("Resolving location...");

                const resolvedName = await resolveLocationName(lat, lng);
                setLocationName(resolvedName);
                setLocation((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        name: resolvedName,
                    };
                });
                setIsResolvingLocation(false);
            },
            () => alert("Location access denied")
        );
    };
=======
    setIsSubmitting(true);
    setStatus("Submitting...");
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f

    try {
      const payload = {
        staff_id: JSON.parse(localStorage.getItem('user'))?.id, // Assuming user context is here
        date: new Date().toISOString().split('T')[0],
        check_in: new Date().toISOString(),
        status: "Verified",
        photo_url: image
      };

<<<<<<< HEAD
            // Need to set srcObject after a tiny delay so the video element exists if it was hidden
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);

            setStream(mediaStream);
            setScanningFace(true);
        } catch (err) {
            alert("Camera access denied");
        }
    };
=======
      await api.post('/api/security/attendance', payload);
      setStatus("Attendance Marked Successfully ✅");
      toast.success("Attendance marked!");
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f

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

<<<<<<< HEAD
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

        if (isResolvingLocation) {
            alert("Please wait while location name is being resolved.");
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
            location: {
                ...location,
                name: locationName || location?.name || "Location name unavailable",
            },
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

    // ── UI Helpers ──
    const getDistance = () => {
        if (!location) return null;
        return Math.floor(calculateDistance(societyLocation.lat, societyLocation.lng, location.lat, location.lng));
    };

    const isLocationVerified = () => {
        const d = getDistance();
        return d !== null && d <= allowedRadius;
    };

    return (
        <div className="sa-container">
            <div className="sa-header">
                <h1><ShieldCheck size={32} color="#10b981" /> Security Gateway</h1>
                <p>GPS-Verified Staff Check-in Panel</p>
            </div>

            {/* ── Status Cards ── */}
            <div className="sa-status-grid">
                <div className="sa-status-card st-blue">
                    <div className="sa-status-icon ic-blue"><UserCheck size={24} /></div>
                    <div className="sa-status-info">
                        <div className="sa-status-label">Current Status</div>
                        <div className="sa-status-value">
                            {status ? "Checked In" : "Pending Action"}
                        </div>
                    </div>
                </div>

                <div className="sa-status-card st-purple">
                    <div className="sa-status-icon ic-purple"><MapPin size={24} /></div>
                    <div className="sa-status-info">
                        <div className="sa-status-label">Location Status</div>
                        <div className="sa-status-value">
                            {!location ? "Awaiting GPS..." : (isLocationVerified() ? "Verified in Zone" : "Out of Bounds")}
                        </div>
                    </div>
                </div>

                <div className="sa-status-card st-green">
                    <div className="sa-status-icon ic-green"><Clock size={24} /></div>
                    <div className="sa-status-info">
                        <div className="sa-status-label">Current Time</div>
                        <div className="sa-status-value">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Panel ── */}
            <div className="sa-main-panel">

                {/* ── Camera Area ── */}
                <div className="sa-camera-section">
                    <div className={`sa-camera-frame ${scanningFace ? 'is-scanning' : ''}`}>
                        {scanningFace && <div className="sa-scanner-line" />}

                        {image ? (
                            <img src={image} alt="Captured" className="sa-snapshot" />
                        ) : stream ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="sa-video"
                            />
                        ) : (
                            <div className="sa-camera-placeholder">
                                <ScanFace size={64} strokeWidth={1} />
                                <span style={{ fontSize: 14, fontWeight: 500 }}>Camera Offline</span>
                            </div>
                        )}
                    </div>

                    <div className="sa-location-info">
                        <Navigation size={16} />
                        {location ? (
                            <>
                                <span>{locationName || location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}</span>
                                <span className={`sa-location-badge ${isLocationVerified() ? 'verified' : 'denied'}`}>
                                    {isLocationVerified() ? 'Verified' : 'Too Far'}
                                </span>
                            </>
                        ) : (
                            <span style={{ fontStyle: 'italic' }}>GPS coords not synchronized</span>
                        )}
                    </div>
                </div>

                {/* ── Actions Sidebar ── */}
                <div className="sa-actions-section">
                    <div className="sa-actions-title">
                        Check-in Protocol
                    </div>

                    {/* Step 1 */}
                    <button
                        className="sa-step-btn sa-btn-location"
                        onClick={getLocation}
                        disabled={location !== null || isResolvingLocation}
                    >
                        <div className="sa-step-icon"><MapPin size={18} /></div>
                        {isResolvingLocation ? 'Step 1: Resolving Address...' : 'Step 1: Get GPS'}
                        {location && (
                            <div className="sa-step-indicator">
                                <CheckCircle2 size={18} color="#fff" />
                            </div>
                        )}
                    </button>

                    {/* Step 2 */}
                    <button
                        className="sa-step-btn sa-btn-camera"
                        onClick={startCamera}
                        disabled={!location || stream !== null || image !== null}
                    >
                        <div className="sa-step-icon"><CameraIcon size={18} /></div>
                        Step 2: Start Camera
                        {stream && (
                            <div className="sa-step-indicator">
                                <CheckCircle2 size={18} color="#fff" />
                            </div>
                        )}
                    </button>

                    {/* Step 3 */}
                    <button
                        className="sa-step-btn sa-btn-capture"
                        onClick={capturePhoto}
                        disabled={!stream || image !== null}
                    >
                        <div className="sa-step-icon"><Aperture size={18} /></div>
                        Step 3: Snapshot
                        {image && (
                            <div className="sa-step-indicator">
                                <CheckCircle2 size={18} color="#fff" />
                            </div>
                        )}
                    </button>

                    {/* Step 4 */}
                    <button
                        className="sa-step-btn sa-btn-mark"
                        onClick={markAttendance}
                        disabled={!image || status !== "" || isResolvingLocation}
                    >
                        <div className="sa-step-icon"><ShieldCheck size={18} /></div>
                        Step 4: Verify Entry
                    </button>

                    {/* Success Message */}
                    {status && (
                        <div className="sa-success-message">
                            <CheckCircle2 size={20} />
                            {status}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
=======
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
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
}
