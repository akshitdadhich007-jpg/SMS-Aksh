import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Card, Button, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import '../../styles/Traceback.css';

const ProveOwnership = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const currentLost = lostItems[0] || null;
    const [answers, setAnswers] = useState({
        engravings: '',
        chainDetails: '',
        wearMarks: '',
        uniqueDetail: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...answers,
            submittedAt: new Date().toISOString(),
            status: 'Awaiting Review'
        };

        const existing = JSON.parse(localStorage.getItem('tracebackClaims') || '[]');
        localStorage.setItem('tracebackClaims', JSON.stringify([payload, ...existing]));
        localStorage.setItem('traceback:claimStatus', 'Awaiting Review');

        setTimeout(() => {
            setIsSubmitting(false);
            navigate(getTracebackPath(location.pathname, 'matches'));
        }, 400);
    };

    return (
        <div className="traceback-page">
            <PageHeader
                title="Prove Your Ownership"
                subtitle="Answer the verification questions so the finder can confirm your claim."
            />
            <TracebackNav />

            <div className="traceback-grid">
                <div className="traceback-item-summary">
                    <div className="traceback-card-header">Item Summary</div>
                    <div className="traceback-item-summary-meta">
                        <div>{currentLost?.description || 'Lost item report'}</div>
                        {currentLost?.category && <div>Category: {currentLost.category}</div>}
                        {currentLost?.dateLost && <div>Date lost: {currentLost.dateLost}</div>}
                        {currentLost?.locationLost && <div>Location lost: {currentLost.locationLost}</div>}
                    </div>
                </div>

                <div className="traceback-card">
                    <div className="traceback-info-box">
                        Provide as many specific details as possible. Only the finder will review these answers for verification.
                    </div>

                    <form onSubmit={handleSubmit} className="traceback-form">
                        <div className="traceback-form-group">
                            <label className="traceback-form-label">Unique engravings or symbols?</label>
                            <textarea
                                required
                                rows={3}
                                value={answers.engravings}
                                onChange={(event) => handleChange('engravings', event.target.value)}
                                className="traceback-form-textarea"
                            />
                        </div>

                        <div className="traceback-form-group">
                            <label className="traceback-form-label">Chain type / size / style?</label>
                            <textarea
                                required
                                rows={3}
                                value={answers.chainDetails}
                                onChange={(event) => handleChange('chainDetails', event.target.value)}
                                className="traceback-form-textarea"
                            />
                        </div>

                        <div className="traceback-form-group">
                            <label className="traceback-form-label">Visible scratches or wear?</label>
                            <textarea
                                required
                                rows={3}
                                value={answers.wearMarks}
                                onChange={(event) => handleChange('wearMarks', event.target.value)}
                                className="traceback-form-textarea"
                            />
                        </div>

                        <div className="traceback-form-group">
                            <label className="traceback-form-label">Any unique identifying detail?</label>
                            <textarea
                                required
                                rows={3}
                                value={answers.uniqueDetail}
                                onChange={(event) => handleChange('uniqueDetail', event.target.value)}
                                className="traceback-form-textarea"
                            />
                        </div>

                        <div className="traceback-actions">
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProveOwnership;
