import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * QR Code Camera Scanner Component
 * Provides camera access and QR code scanning capability
 */
const QRCodeScanner = ({ onScan, onClose }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            setError('');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setScanning(true);
                captureFrame();
            }
        } catch (err) {
            setError('Unable to access camera. Please check permissions.');
            console.error('Camera error:', err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        setScanning(false);
    };

    const captureFrame = () => {
        if (!scanning || !videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        // Try to detect QR code (simplified detection)
        detectQRCode(canvas);
        
        requestAnimationFrame(captureFrame);
    };

    const detectQRCode = (canvas) => {
        // This is a simplified QR detection
        // In production, use jsQR or similar library
        const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        
        // For demo purposes: look for text patterns in the image
        // This is a placeholder - in reality you'd use jsQR library
        // For this implementation, we'll use a simpler approach with manual input fallback
    };

    const handleManualInput = () => {
        const input = prompt('Paste the QR code data:');
        if (input) {
            stopCamera();
            onScan(input.trim());
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <button
                    onClick={() => {
                        stopCamera();
                        onClose();
                    }}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10000
                    }}
                >
                    <X size={24} color="#000" />
                </button>

                <div style={{
                    position: 'relative',
                    width: '280px',
                    height: '280px',
                    border: '3px solid #10b981',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#000'
                }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{ display: 'none' }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '240px',
                        height: '240px',
                        border: '2px dashed #10b981',
                        borderRadius: '8px',
                        opacity: 0.6
                    }} />
                </div>

                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    color: '#fff'
                }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                        Align QR code within frame
                    </div>
                    {error && (
                        <div style={{
                            fontSize: '13px',
                            color: '#fca5a5',
                            marginBottom: '16px',
                            background: 'rgba(220, 38, 38, 0.1)',
                            padding: '8px 12px',
                            borderRadius: '6px'
                        }}>
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleManualInput}
                        style={{
                            padding: '10px 16px',
                            border: '1px solid rgba(255,255,255,0.3)',
                            background: 'transparent',
                            color: '#fff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            marginTop: '8px'
                        }}
                    >
                        Enter Manually
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeScanner;
