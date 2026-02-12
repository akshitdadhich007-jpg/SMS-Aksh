import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Button, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import '../../styles/Traceback.css';

const LostAndFoundTraceback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <div className="traceback-page">
            <PageHeader title="Lost & Found - Traceback" subtitle="Privacy-first reporting, matching, and secure returns" />
            <TracebackNav />

            <div className="traceback-hero">
                <div className="traceback-hero-content">
                    <div className="traceback-hero-title">
                        Lost something? Find it with Traceback.
                    </div>
                    <div className="traceback-hero-subtitle">
                        The privacy-first lost & found platform for our community.
                    </div>
                    <div className="traceback-hero-actions">
                        <Button variant="primary" onClick={() => navigate(getTracebackPath(location.pathname, 'report-lost'))}>
                            I Lost Something
                        </Button>
                        <Button variant="secondary" onClick={() => navigate(getTracebackPath(location.pathname, 'report-found'))}>
                            I Found Something
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LostAndFoundTraceback;
