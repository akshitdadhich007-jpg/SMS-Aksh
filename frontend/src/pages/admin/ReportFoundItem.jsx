import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, AlertCircle } from 'lucide-react';
import { PageHeader, Button, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import { getDB, saveDB, logAction, imageToBase64 } from '../../utils/tracebackStorage';
import { calculateMatchScore } from '../../utils/tracebackAI';
import { useToast } from '../../components/ui/Toast';
import '../../styles/Traceback.css';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 3;

const ReportFoundItem = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        category: '', dateFound: '', description: '', color: '',
        locationFound: '', contact: '',
    });
    const [images, setImages] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errorMsg) setErrorMsg('');
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files || []);
        if (images.length + files.length > MAX_IMAGES) {
            setErrorMsg(`Maximum ${MAX_IMAGES} images allowed.`);
            return;
        }
        for (const file of files) {
            if (file.size > MAX_IMAGE_SIZE) {
                setErrorMsg('Each image must be 5MB or smaller.');
                return;
            }
        }
        setErrorMsg('');
        try {
            const base64Images = await Promise.all(files.map(f => imageToBase64(f)));
            setImages(prev => [...prev, ...base64Images]);
        } catch {
            setErrorMsg('Failed to process image(s).');
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMsg('');

        // Require at least 1 image for found items
        if (images.length === 0) {
            setErrorMsg('At least 1 image is required for found items.');
            return;
        }
        if (formData.description.trim().length < 20) {
            setErrorMsg('Description must be at least 20 characters.');
            return;
        }

        setIsSubmitting(true);
        const db = getDB();

        const newItem = {
            id: 'TI' + Date.now(),
            type: 'found',
            category: formData.category,
            color: formData.color,
            description: formData.description,
            location: formData.locationFound,
            event_date: formData.dateFound,
            contact: formData.contact,
            image_url: images[0] || '',
            images: images,
            status: 'reported',
            reporter_id: 'current_user',
            created_at: new Date().toISOString(),
        };

        db.items.push(newItem);
        logAction(db, 'item_reported', newItem.id, `Found ${formData.category} reported`, 'current_user');

        // Auto-match against lost items
        let matchFound = false;
        db.items.forEach(item => {
            if (item.type !== 'lost' || item.category !== newItem.category) return;
            if (['expired', 'archived', 'returned', 'collected'].includes(item.status)) return;
            const alreadyMatched = db.matches.some(m => m.lostId === item.id && m.foundId === newItem.id);
            if (alreadyMatched) return;

            const score = calculateMatchScore(item, newItem);
            if (score >= 35) {
                db.matches.push({
                    id: 'TM' + Date.now() + Math.floor(Math.random() * 1000),
                    lostId: item.id, foundId: newItem.id,
                    score, status: 'matched', claim_status: null,
                    created_at: new Date().toISOString(),
                });
                if (score >= 50) {
                    item.status = 'matched';
                    newItem.status = 'matched';
                }
                logAction(db, 'match_created', newItem.id, `Auto-match: ${item.id} ↔ ${newItem.id} (${score}%)`, 'system');
                matchFound = true;
            }
        });

        saveDB(db);
        toast.success(matchFound ? '✅ Report saved! Potential matches found!' : '✅ Report saved! We\'ll notify when a match is found.');
        navigate(getTracebackPath(location.pathname, 'matches'));
        setIsSubmitting(false);
    };

    return (
        <div className="traceback-page">
            <PageHeader title="Report a Found Item" subtitle="Thank you for doing the right thing. Your report helps return items safely." />
            <TracebackNav />

            <div className="traceback-card">
                <div className="traceback-info-box">
                    Honesty builds trust in our community. Please share accurate details so we can match this item with its owner.
                </div>

                <form onSubmit={handleSubmit} className="traceback-form">
                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Item Category *</label>
                        <select required value={formData.category} onChange={e => handleChange('category', e.target.value)} className="traceback-form-select">
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
                        <input type="text" value={formData.color} onChange={e => handleChange('color', e.target.value)} placeholder="e.g., Black, Silver, Red" className="traceback-form-input" />
                        <div className="traceback-form-hint">Color helps improve match accuracy.</div>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Date Found *</label>
                        <input type="date" required value={formData.dateFound} onChange={e => handleChange('dateFound', e.target.value)} className="traceback-form-input" max={new Date().toISOString().split('T')[0]} />
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Description * (min 20 characters)</label>
                        <textarea required rows={4} minLength={20} value={formData.description} onChange={e => handleChange('description', e.target.value)} placeholder="Color, brand, unique marks, contents, etc." className="traceback-form-textarea" />
                        <div className="traceback-form-hint">{formData.description.length}/20 characters minimum.</div>
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Location Found *</label>
                        <input type="text" required value={formData.locationFound} onChange={e => handleChange('locationFound', e.target.value)} placeholder="e.g., Lobby, Parking, Block B" className="traceback-form-input" />
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Images * (at least 1, up to {MAX_IMAGES})</label>
                        <div className="traceback-upload-area" onClick={() => fileInputRef.current?.click()}>
                            <Upload size={24} color="var(--text-secondary)" />
                            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>Click to upload (max 5MB each)</p>
                            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                        </div>
                        {images.length === 0 && (
                            <div className="traceback-form-hint" style={{ color: '#c2410c', display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                                <AlertCircle size={14} /> At least one image is required for found items
                            </div>
                        )}
                        {images.length > 0 && (
                            <div className="traceback-image-previews">
                                {images.map((img, i) => (
                                    <div key={i} className="traceback-image-preview">
                                        <img src={img} alt={`Preview ${i + 1}`} />
                                        <button type="button" className="traceback-image-remove" onClick={() => removeImage(i)}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="traceback-form-group">
                        <label className="traceback-form-label">Finder's Contact Info *</label>
                        <input type="text" required value={formData.contact} onChange={e => handleChange('contact', e.target.value)} placeholder="name@example.com or +91 98765 43210" className="traceback-form-input" />
                        <div className="traceback-form-hint">Used only to coordinate the return.</div>
                    </div>

                    {errorMsg && <div className="traceback-info-box error">{errorMsg}</div>}

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
