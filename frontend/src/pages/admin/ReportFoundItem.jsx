import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Card, Button, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import '../../styles/Traceback.css';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ReportFoundItem = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        category: '',
        dateFound: '',
        description: '',
        locationFound: '',
        contact: ''
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:3001/api/traceback/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    type: 'found',
                    category: formData.category,
                    description: formData.description,
                    location: formData.locationFound,
                    event_date: formData.dateFound,
                    image_url: imageFile ? imageFile.name : ''
                }),
            });

            const data = await response.json();

            if (data.success) {
                // If found item, maybe show success message or go to a different view?
                // For now, go to matches to see if anyone lost it.
                navigate(getTracebackPath(location.pathname, 'matches'));
            } else {
                setErrorMsg(data.message || 'Failed to submit report.');
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('Report error:', err);
            setErrorMsg('Network error. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="traceback-page">
            <PageHeader
                title="Report a Found Item"
                subtitle="Thank you for doing the right thing. Your report helps return items safely."
            />
            <TracebackNav />

            <div className="traceback-card">
                <div className="traceback-info-box">
                    Honesty builds trust in our community. Please share accurate details so we can match this item with its owner.
                </div>

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
                        <label className="traceback-form-label">Date Found</label>
                        <input
                            type="date"
                            required
                            value={formData.dateFound}
                            onChange={(event) => handleChange('dateFound', event.target.value)}
                            className="traceback-form-input"
                        />
                        <div className="traceback-form-hint">Let us know when you found the item.</div>
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
                        <div className="traceback-form-hint">Describe any unique identifiers or visible damage.</div>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Location Found</label>
                        <input
                            type="text"
                            required
                            value={formData.locationFound}
                            onChange={(event) => handleChange('locationFound', event.target.value)}
                            placeholder="e.g., Lobby, Parking, Block B"
                            className="traceback-form-input"
                        />
                        <div className="traceback-form-hint">Specify the exact place where you found it.</div>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Image Upload</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ padding: '10px 0' }}
                        />
                        <div className="traceback-form-hint">Max file size: 5MB.</div>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Finder's Contact Info</label>
                        <input
                            type="text"
                            required
                            value={formData.contact}
                            onChange={(event) => handleChange('contact', event.target.value)}
                            placeholder="name@example.com or +91 98765 43210"
                            className="traceback-form-input"
                        />
                        <div className="traceback-form-hint">Used only to coordinate the return.</div>
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

export default ReportFoundItem;
