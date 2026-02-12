import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader, Card, Button, QRCodeScanner, QRCodeDisplay, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import { generateQRToken, validateQRToken } from '../../utils/qrCodeHelper';
import '../../styles/Traceback.css';

const TracebackMatches = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const currentLost = lostItems[0] || null;
    const claimStatus = localStorage.getItem('traceback:claimStatus') || 'Claim Pending';
    const storedQRToken = localStorage.getItem('traceback:qrToken') || '';
    const storedQRExpiry = parseInt(localStorage.getItem('traceback:qrExpiry') || '0');
    
    const [qrToken, setQrToken] = useState('');
    const [qrVisible, setQrVisible] = useState(false);
    const [qrError, setQrError] = useState('');
    const [qrSuccess, setQrSuccess] = useState('');
    const [scannerOpen, setScannerOpen] = useState(false);
    const [scanError, setScanError] = useState('');
    const [scanSuccess, setScanSuccess] = useState('');

    const matches = [
        {
            id: 'match-1',
            title: 'Black Leather Wallet',
            percentage: 100,
            reason: 'Matches category, location, and description keywords (leather, black, wallet).',
            dateFound: '2026-02-08',
            locationFound: 'Block B Lobby',
            status: claimStatus
        },
        {
            id: 'match-2',
            title: 'Brown Wallet with ID Holder',
            percentage: 82,
            reason: 'Similar category and location within the same block; partial description overlap.',
            dateFound: '2026-02-07',
            locationFound: 'Parking Level 1',
            status: claimStatus
        }
    ];

    const generateQRCode = () => {
        if (claimStatus !== 'Approved') return;
        if (storedQRToken) return;
        
        const tokenData = generateQRToken(currentLost?.id || 'claim-001');
        
        localStorage.setItem('traceback:qrToken', tokenData.token);
        localStorage.setItem('traceback:qrExpiry', tokenData.expiryTime.toString());
        
        setQrToken(tokenData.token);
        setQrVisible(true);
        setQrError('');
        setQrSuccess('');
    };

    const handleScanQRCode = (scannedData) => {
        setScanError('');
        setScanSuccess('');
        
        const validation = validateQRToken(scannedData, storedQRToken, storedQRExpiry);
        
        if (!validation.success) {
            setScanError(validation.message);
            return;
        }
        
        localStorage.setItem('traceback:claimStatus', 'Item Returned');
        localStorage.removeItem('traceback:qrToken');
        localStorage.removeItem('traceback:qrExpiry');
        
        setScanSuccess('Item successfully returned!');
        setScannerOpen(false);
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    return (
        <div className="traceback-page">
            {scannerOpen && (
                <QRCodeScanner 
                    onScan={handleScanQRCode}
                    onClose={() => setScannerOpen(false)}
                />
            )}
            <PageHeader
                title="Matching Found Items"
                subtitle="Review AI-assisted matches for your lost item."
            />
            <TracebackNav />

            <div className="traceback-grid">
                <div>
                    <div className="traceback-card-header">Your Lost Item</div>
                    <div className="traceback-item-summary">
                        <div className="traceback-item-summary-title">
                            {currentLost?.description || 'Lost item report'}
                        </div>
                        <div className="traceback-item-summary-meta">
                            {currentLost?.category && <div>Category: {currentLost.category}</div>}
                            {currentLost?.dateLost && <div>Date lost: {currentLost.dateLost}</div>}
                            {currentLost?.locationLost && <div>Location lost: {currentLost.locationLost}</div>}
                        </div>
                    </div>
                </div>

                {claimStatus === 'Item Returned' && (
                    <div className="traceback-card">
                        <div className="traceback-success-state">
                            <div className="traceback-success-icon">
                                <CheckCircle2 size={64} color="#10b981" strokeWidth={1.5} />
                            </div>
                            <div>
                                <div className="traceback-success-title">Item Returned</div>
                                <div className="traceback-success-message">
                                    This case is closed. Thank you for using Traceback.
                                </div>
                            </div>
                            <Button variant="secondary" onClick={() => navigate(getTracebackPath(location.pathname))}>
                                Return to Traceback
                            </Button>
                        </div>
                    </div>
                )}

                {claimStatus !== 'Item Returned' && (
                    <>
                        <div>
                            <div className="traceback-card-header">Matching Found Items</div>
                            <div className="traceback-grid">
                                {matches.map((match) => (
                                    <div key={match.id} className="traceback-match-card">
                                        <div className="traceback-match-content">
                                            <div className="traceback-match-details">
                                                <div className="traceback-match-title">{match.title}</div>
                                                <div className="traceback-match-percentage">
                                                    <div className="traceback-match-percentage-text">{match.percentage}% Match</div>
                                                    <div className="traceback-match-bar-container">
                                                        <div className="traceback-match-bar" style={{ width: `${match.percentage}%` }} />
                                                    </div>
                                                </div>
                                                <div className="traceback-match-reason-label">AI Reason</div>
                                                <div className="traceback-match-reason-text">{match.reason}</div>
                                                <div className="traceback-match-meta">
                                                    <div>Date found: {match.dateFound}</div>
                                                    <div>Location found: {match.locationFound}</div>
                                                    <div>Status: <span className="traceback-status-badge pending">{match.status}</span></div>
                                                </div>
                                            </div>
                                            <div className="traceback-match-actions">
                                                <Button variant="primary" onClick={() => navigate(getTracebackPath(location.pathname, 'prove-ownership'))}>
                                                    Claim This Item
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="traceback-grid">
                            <div className="traceback-card">
                                <div className="traceback-card-section">
                                    <div className="traceback-form-label">Owner: Generate Secure QR Code</div>
                                    <div className="traceback-form-hint">
                                        Generate a one-time QR code after the claim is approved. Share it securely with the finder.
                                    </div>
                                    {qrVisible && qrToken ? (
                                        <div className="traceback-card-section">
                                            <div className="traceback-qr-section">
                                                <div className="traceback-qr-warning">
                                                    ⚠️ Do not share this QR code publicly.
                                                </div>
                                                <QRCodeDisplay token={qrToken} />
                                            </div>
                                            <div className="traceback-info-box warning">
                                                This QR code will not be shown again. Save or share it now.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="traceback-card-section">
                                            <Button variant="primary" onClick={generateQRCode} disabled={claimStatus !== 'Approved' || Boolean(storedQRToken)}>
                                                Generate Secure QR Code
                                            </Button>
                                            {storedQRToken && (
                                                <div className="traceback-form-hint">
                                                    QR code already generated. For security, it is hidden.
                                                </div>
                                            )}
                                            {claimStatus !== 'Approved' && (
                                                <div className="traceback-form-hint">
                                                    QR code generation is available after claim approval.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="traceback-card">
                                <div className="traceback-card-section">
                                    <div className="traceback-form-label">Finder: Scan QR Code to Complete Handover</div>
                                    <div className="traceback-form-hint">
                                        Use your device camera to scan the QR code provided by the owner to complete the handover.
                                    </div>
                                    {!scanSuccess && (
                                        <Button variant="primary" onClick={() => setScannerOpen(true)}>
                                            Open Camera & Scan QR Code
                                        </Button>
                                    )}
                                    {scanError && (
                                        <div className="traceback-info-box error">
                                            {scanError}
                                        </div>
                                    )}
                                    {scanSuccess && (
                                        <div className="traceback-info-box success">
                                            {scanSuccess}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="traceback-actions">
                    <Button variant="secondary" onClick={() => navigate(getTracebackPath(location.pathname))}>
                        Back to Traceback
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TracebackMatches;
