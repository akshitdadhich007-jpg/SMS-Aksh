import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Card, Button, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import '../../styles/Traceback.css';

const FinderClaimReview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const currentLost = lostItems[0] || null;
    const claims = JSON.parse(localStorage.getItem('tracebackClaims') || '[]');
    const currentClaim = claims[0] || null;

    const updateClaimStatus = (status) => {
        if (!currentClaim) return;
        const updated = [{ ...currentClaim, status }, ...claims.slice(1)];
        localStorage.setItem('tracebackClaims', JSON.stringify(updated));
        localStorage.setItem('traceback:claimStatus', status);
        navigate(getTracebackPath(location.pathname, 'matches'));
    };

    return (
        <div className="traceback-page">
            <PageHeader
                title="Finder Claim Review"
                subtitle="Review the claimant's answers before approving the release."
            />
            <TracebackNav />

            <div className="traceback-grid">
                <div className="traceback-item-summary">
                    <div className="traceback-card-header">Claimed Item Details</div>
                    <div className="traceback-item-summary-meta">
                        <div>{currentLost?.description || 'Lost item report'}</div>
                        {currentLost?.category && <div>Category: {currentLost.category}</div>}
                        {currentLost?.dateLost && <div>Date lost: {currentLost.dateLost}</div>}
                        {currentLost?.locationLost && <div>Location lost: {currentLost.locationLost}</div>}
                    </div>
                </div>

                <div className="traceback-card">
                    <div className="traceback-card-header">Claimant's Answers</div>
                    <div className="traceback-card-section">
                        <div className="traceback-answer-box">
                            <div className="traceback-answer-label">Unique engravings or symbols</div>
                            <div className="traceback-answer-text">{currentClaim?.engravings || 'No response yet.'}</div>
                        </div>
                        <div className="traceback-answer-box">
                            <div className="traceback-answer-label">Chain type / size / style</div>
                            <div className="traceback-answer-text">{currentClaim?.chainDetails || 'No response yet.'}</div>
                        </div>
                        <div className="traceback-answer-box">
                            <div className="traceback-answer-label">Visible scratches or wear</div>
                            <div className="traceback-answer-text">{currentClaim?.wearMarks || 'No response yet.'}</div>
                        </div>
                        <div className="traceback-answer-box">
                            <div className="traceback-answer-label">Any unique identifying detail</div>
                            <div className="traceback-answer-text">{currentClaim?.uniqueDetail || 'No response yet.'}</div>
                        </div>
                    </div>
                </div>

                <div className="traceback-actions">
                    <Button variant="danger" onClick={() => updateClaimStatus('Rejected')}>Reject Claim</Button>
                    <Button variant="primary" onClick={() => updateClaimStatus('Approved')}>Approve Claim</Button>
                </div>
            </div>
        </div>
    );
};

export default FinderClaimReview;
