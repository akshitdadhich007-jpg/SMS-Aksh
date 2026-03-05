import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, X, MapPin } from "lucide-react";
import { PageHeader, Button, TracebackNav } from "../../components/ui";
import { getTracebackPath } from "../../utils/tracebackHelper";
import { imageToBase64 } from "../../utils/tracebackStorage";
import api from "../../services/api";
import { useToast } from "../../components/ui/Toast";
import "../../styles/Traceback.css";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 3;
const ReportLostItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    category: "",
    dateLost: "",
    description: "",
    color: "",
    locationLost: "",
    contact: "",
    consent: false,
  });
  const [images, setImages] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errorMsg) setErrorMsg("");
  };
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (images.length + files.length > MAX_IMAGES) {
      setErrorMsg(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }
    for (const file of files) {
      if (file.size > MAX_IMAGE_SIZE) {
        setErrorMsg("Each image must be 5MB or smaller.");
        return;
      }
    }
    setErrorMsg("");
    try {
      const base64Images = await Promise.all(
        files.map((f) => imageToBase64(f)),
      );
      setImages((prev) => [...prev, ...base64Images]);
    } catch {
      setErrorMsg("Failed to process image(s).");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));
  const handleUseLocation = () => {
    setErrorMsg("");
    if (!navigator.geolocation) {
      setErrorMsg("Location services are not available.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        handleChange(
          "locationLost",
          `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        ),
      () => setErrorMsg("Unable to retrieve your location."),
    );
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    if (!formData.consent) {
      setErrorMsg("Please provide consent.");
      return;
    }
    if (formData.description.trim().length < 20) {
      setErrorMsg("Description must be at least 20 characters.");
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("category", formData.category);
      payload.append("color", formData.color);
      payload.append("description", formData.description);
      payload.append("locationLost", formData.locationLost);
      payload.append("dateLost", formData.dateLost);
      payload.append("contact", formData.contact);
      payload.append("consent", formData.consent);

      for (let i = 0; i < images.length; i++) {
        const res = await fetch(images[i]);
        const blob = await res.blob();
        payload.append("images", blob, `image${i}.jpg`);
      }

      const { data } = await api.post('/api/traceback/lost', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(
        data?.matchesFound > 0
          ? "✅ Report saved! Potential matches found!"
          : "✅ Report saved! We'll notify you of matches."
      );
      navigate(getTracebackPath(location.pathname, "matches"));
    } catch (err) {
      setErrorMsg("Failed to submit report. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="traceback-page">
      <PageHeader
        title="Report a Lost Item"
        subtitle="Provide accurate details to help us match your item quickly."
      />
      <TracebackNav />

      <div className="traceback-card">
        <form onSubmit={handleSubmit} className="traceback-form">
          <div className="traceback-form-group">
            <label className="traceback-form-label">Item Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="traceback-form-select"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="documents">Documents</option>
              <option value="accessories">Accessories</option>
              <option value="keys">Keys</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="traceback-form-group">
            <label className="traceback-form-label">Color</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleChange("color", e.target.value)}
              placeholder="e.g., Black, Silver, Brown"
              className="traceback-form-input"
            />
            <div className="traceback-form-hint">
              Specifying color improves match accuracy.
            </div>
          </div>

          <div className="traceback-form-group">
            <label className="traceback-form-label">Date Lost *</label>
            <input
              type="date"
              required
              value={formData.dateLost}
              onChange={(e) => handleChange("dateLost", e.target.value)}
              className="traceback-form-input"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="traceback-form-group">
            <label className="traceback-form-label">
              Description * (min 20 characters)
            </label>
            <textarea
              required
              rows={4}
              minLength={20}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Color, brand, unique marks, size, etc."
              className="traceback-form-textarea"
            />
            <div className="traceback-form-hint">
              {formData.description.length}/20 characters minimum. Be specific
              for better matching.
            </div>
          </div>

          <div className="traceback-form-group">
            <label className="traceback-form-label">Location Lost *</label>
            <input
              type="text"
              required
              value={formData.locationLost}
              onChange={(e) => handleChange("locationLost", e.target.value)}
              placeholder="e.g., Lobby, Parking, Block B"
              className="traceback-form-input"
            />
            <div className="mt-16">
              <Button
                type="button"
                variant="secondary"
                onClick={handleUseLocation}
              >
                <MapPin size={14} /> Use my current location
              </Button>
            </div>
          </div>

          <div className="traceback-form-group">
            <label className="traceback-form-label">
              Images (up to {MAX_IMAGES})
            </label>
            <div
              className="traceback-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} color="var(--text-secondary)" />
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                Click to upload (max 5MB each)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{
                  display: "none",
                }}
              />
            </div>
            {images.length > 0 && (
              <div className="traceback-image-previews">
                {images.map((img, i) => (
                  <div key={i} className="traceback-image-preview">
                    <img src={img} alt={`Preview ${i + 1}`} />
                    <button
                      type="button"
                      className="traceback-image-remove"
                      onClick={() => removeImage(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="traceback-form-group">
            <label className="traceback-form-label">
              Contact Email or Phone *
            </label>
            <input
              type="text"
              required
              value={formData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              placeholder="name@example.com or +91 98765 43210"
              className="traceback-form-input"
            />
            <div className="traceback-form-hint">
              Used only to coordinate safe return.
            </div>
          </div>

          <div className="traceback-form-checkbox-wrapper">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => handleChange("consent", e.target.checked)}
              className="traceback-form-checkbox"
              required
            />
            <label className="traceback-form-hint">
              I confirm that the details provided are accurate and consent to
              secure processing for traceback matching.
            </label>
          </div>

          {errorMsg && (
            <div className="traceback-info-box error">{errorMsg}</div>
          )}

          <div className="traceback-actions">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ReportLostItem;
