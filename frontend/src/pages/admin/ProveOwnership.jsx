import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { PageHeader, Button, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import { getDB, saveDB, logAction, imageToBase64 } from '../../utils/tracebackStorage';
import { getAIQuestions } from '../../utils/tracebackAI';
import { useToast } from '../../components/ui/Toast';
import '../../styles/Traceback.css';

const ProveOwnership = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const fileInputRef = useRef(null);

    // Read from tracebackDB
    const db = getDB();
    const lostItems = db.items.filter(i => i.type === 'lost' && ['reported', 'matched'].includes(i.status));
    const currentLost = lostItems[0] || null;
    const category = currentLost?.category || '';
    const questions = getAIQuestions(category);

    const [answers, setAnswers] = useState({ description: '', lostLocation: '', uniqueMarks: '', notes: '' });
    const [proofImage, setProofImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => setAnswers(prev => ({ ...prev, [field]: value }));

    const handleProofUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB.'); return; }
        try {
            const b64 = await imageToBase64(file);
            setProofImage(b64);
        } catch { toast.error('Failed to process image.'); }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!answers.description || !answers.lostLocation || !answers.uniqueMarks) {
            toast.error('Please fill required description, location, and unique marks.');
            return;
        }
        setIsSubmitting(true);

        const data = getDB();
        const newClaim = {
            id: 'TC' + Date.now(),
            matchId: null,
            lostId: currentLost?.id || null,
            foundId: null,
            item_details: { description: currentLost?.description, category },
            claimant_name: 'Resident (You)',
            answers: answers,
            proof_image: proofImage,
            confidenceScore: 50 + Math.floor(Math.random() * 40),
            status: 'under_review',
            reject_reason: '',
            created_at: new Date().toISOString(),
        };
        data.claims.push(newClaim);
        logAction(data, 'claim_submitted', newClaim.id, `Ownership proof submitted for ${currentLost?.id}`, 'current_user');
        saveDB(data);

        toast.success('Claim submitted for admin review!');
        setTimeout(() => {
            setIsSubmitting(false);
            navigate(getTracebackPath(location.pathname, 'matches'));
        }, 300);
    };

    return (
        <div className="traceback-page">
            <PageHeader title="Prove Your Ownership" subtitle="Answer verification questions so the finder can confirm your claim." />
            <TracebackNav />

            <div className="traceback-grid">
                <div className="traceback-item-summary">
                    <div className="traceback-card-header">Item Summary</div>
                    <div className="traceback-item-summary-meta">
                        <div>{currentLost?.description || 'Lost item report'}</div>
                        {currentLost?.category && <div>Category: {currentLost.category}</div>}
                        {currentLost?.color && <div>Color: {currentLost.color}</div>}
                        {currentLost?.event_date && <div>Date lost: {currentLost.event_date}</div>}
                        {currentLost?.location && <div>Location: {currentLost.location}</div>}
                        {currentLost?.image_url && (
                            <div style={{ marginTop: 8 }}>
                                <img src={currentLost.image_url} alt="Item" style={{ maxHeight: 100, borderRadius: 8 }} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="traceback-card">
                    <div className="traceback-info-box">
                        Provide specific details. Only the designated reviewer will see your answers.
                    </div>

                    <form onSubmit={handleSubmit} className="traceback-form">
                        <div className="traceback-form-group">
                            <label className="traceback-form-label">Describe the item in detail *</label>
                            <textarea
                                required rows={3}
                                value={answers.description}
                                onChange={e => handleChange('description', e.target.value)}
                                className="traceback-form-textarea"
                                placeholder="E.g., Black leather wallet with a silver zipper..."
                            />
                        </div>

                        <div className="traceback-form-group">
                            <label className="traceback-form-label">Where did you lose it? *</label>
                            <input
                                required type="text"
                                value={answers.lostLocation}
                                onChange={e => handleChange('lostLocation', e.target.value)}
                                className="traceback-form-textarea"
                                style={{ minHeight: 'auto', padding: '10px' }}
                                placeholder="E.g., Near the clubhouse gym"
                            />
                        </div>

                        <div className="traceback-form-group">
                            <label className="traceback-form-label">What unique marks does it have? *</label>
                            <textarea
                                required rows={2}
                                value={answers.uniqueMarks}
                                onChange={e => handleChange('uniqueMarks', e.target.value)}
                                className="traceback-form-textarea"
                                placeholder="E.g., A scratch on the bottom left corner"
                            />
                        </div>

                        <div className="traceback-form-group">
                            <label className="traceback-form-label">Any additional notes?</label>
                            <textarea
                                rows={2}
                                value={answers.notes}
                                onChange={e => handleChange('notes', e.target.value)}
                                className="traceback-form-textarea"
                                placeholder="Optional extra info..."
                            />
                        </div>

                        <div className="traceback-form-group">
                            <label className="traceback-form-label">Proof Image (optional)</label>
                            <div className="traceback-upload-area" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={20} color="var(--text-secondary)" />
                                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>Upload proof (receipt, packaging, etc.)</p>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProofUpload} style={{ display: 'none' }} />
                            </div>
                            {proofImage && (
                                <div style={{ marginTop: 8 }}>
                                    <img src={proofImage} alt="Proof" style={{ maxHeight: 120, borderRadius: 8, border: '1px solid var(--border)' }} />
                                </div>
                            )}
                        </div>

                        <div className="traceback-actions">
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Claim for Review'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProveOwnership;
