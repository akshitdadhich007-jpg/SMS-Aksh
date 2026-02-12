import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Card, Button, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import '../../styles/Traceback.css';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ReportLostItem = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        category: '',
        dateLost: '',
        description: '',
        locationLost: '',
        contact: '',
        consent: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;
        if (file && file.size > MAX_IMAGE_SIZE) {
            setErrorMsg('Image must be 5MB or smaller.');
            event.target.value = '';
            setImageFile(null);
            return;
        }
        setErrorMsg('');
        setImageFile(file);
    };

    const handleUseLocation = () => {
        setErrorMsg('');
        if (!navigator.geolocation) {
            setErrorMsg('Location services are not available in this browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
                handleChange('locationLost', coords);
            },
            () => {
                setErrorMsg('Unable to retrieve your current location.');
            }
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMsg('');

        if (!formData.consent) {
            setErrorMsg('Please provide consent to submit this report.');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            ...formData,
            imageName: imageFile ? imageFile.name : null,
            submittedAt: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem('lostItems') || '[]');
        localStorage.setItem('lostItems', JSON.stringify([payload, ...existing]));

        setTimeout(() => {
            setIsSubmitting(false);
            navigate(getTracebackPath(location.pathname, 'matches'));
        }, 400);
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
                        <label className="traceback-form-label">Item Category</label>
                        <select
                            required
                            value={formData.category}
                            onChange={(event) => handleChange('category', event.target.value)}
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
                        <div className="traceback-form-hint">Choose the closest category for accurate matching.</div>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Date Lost</label>
                        <input
                            type="date"
                            required
                            value={formData.dateLost}
                            onChange={(event) => handleChange('dateLost', event.target.value)}
                            className="traceback-form-input"
                        />
                        <div className="traceback-form-hint">Provide the date you last saw the item.</div>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(event) => handleChange('description', event.target.value)}
                            placeholder="Color, brand, unique marks, etc."
                            className="traceback-form-textarea"
                        />
                        <div className="traceback-form-hint">Include unique identifiers to improve matching accuracy.</div>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Location Lost</label>
                        <input
                            type="text"
                            required
                            value={formData.locationLost}
                            onChange={(event) => handleChange('locationLost', event.target.value)}
                            placeholder="e.g., Lobby, Parking, Block B"
                            className="traceback-form-input"
                        />
                        <div className="traceback-form-hint">Be as specific as possible to narrow the search.</div>
                        <Button type="button" variant="secondary" onClick={handleUseLocation}>
                            Use my current location
                        </Button>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Image Upload (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ padding: '10px 0' }}
                        />
                        <div className="traceback-form-hint">Max file size: 5MB.</div>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Contact Email or Phone</label>
                        <input
                            type="text"
                            required
                            value={formData.contact}
                            onChange={(event) => handleChange('contact', event.target.value)}
                            placeholder="name@example.com or +91 98765 43210"
                            className="traceback-form-input"
                        />
                        <div className="traceback-form-hint">We will only use this to coordinate a safe return.</div>
                    </div>

                    <div className="traceback-form-checkbox-wrapper">
                        <input
                            type="checkbox"
                            checked={formData.consent}
                            onChange={(event) => handleChange('consent', event.target.checked)}
                            className="traceback-form-checkbox"
                            required
                        />
                        <label className="traceback-form-hint">
                            I confirm that the details provided are accurate and consent to secure processing for traceback matching.
                        </label>
                    </div>

                    {errorMsg && (
                        <div className="traceback-info-box error">
                            {errorMsg}
                        </div>
                    )}

                    <div className="traceback-actions">
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportLostItem;
