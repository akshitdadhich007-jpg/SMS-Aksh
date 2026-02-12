import React, { useEffect, useState } from 'react';

/**
 * QR Code Display Component
 * Generates and displays a QR code from a token
 */
const QRCodeDisplay = ({ token }) => {
    const [qrImageUrl, setQrImageUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        generateQRCode(token);
    }, [token]);

    const generateQRCode = async (dataToEncode) => {
        try {
            // Use qr-server API to generate QR code
            const encodedData = encodeURIComponent(dataToEncode);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
            setQrImageUrl(qrUrl);
            setError('');
        } catch (err) {
            setError('Unable to generate QR code');
            console.error('QR generation error:', err);
        }
    };

    if (error) {
        return (
            <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px'
            }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
        }}>
            {qrImageUrl && (
                <img
                    src={qrImageUrl}
                    alt="Secure QR Code"
                    style={{
                        width: '240px',
                        height: '240px',
                        border: '2px solid var(--border)',
                        borderRadius: '8px',
                        padding: '8px',
                        background: '#fff'
                    }}
                />
            )}
            <div style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                maxWidth: '300px'
            }}>
                Share this QR code with the finder via secure channel (in-person, direct message)
            </div>
        </div>
    );
};

export default QRCodeDisplay;
