<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import { TracebackNav } from '../../components/ui';
import '../../styles/Traceback.css';

const LostAndFoundTraceback = () => {
    return (
        <div className="traceback-page">
            <div style={{ marginBottom: '18px' }}>
                <h1 style={{ margin: 0, fontSize: '48px', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                    Lost &amp; Found - Traceback
                </h1>
                <p style={{ margin: '10px 0 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
                    Privacy-first reporting, matching, and secure returns
                </p>
            </div>

            <TracebackNav />

            <section className="traceback-hero" style={{ marginTop: '8px' }}>
                <div className="traceback-hero-content">
                    <h2 className="traceback-hero-title">Lost something? Find it with Traceback.</h2>
                    <p className="traceback-hero-subtitle">
                        The privacy-first lost &amp; found platform for our community.
                    </p>

                    <div className="traceback-hero-actions">
                        <Link to="report-lost" className="traceback-btn traceback-btn-primary" style={{ minWidth: '210px' }}>
                            I Lost Something
                        </Link>
                        <Link to="report-found" className="traceback-btn traceback-btn-secondary" style={{ minWidth: '210px' }}>
                            I Found Something
                        </Link>
                    </div>

                    <div style={{ marginTop: '2px' }}>
                        <Link to="matches" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                            View Matches
                        </Link>
                    </div>
                </div>
            </section>

=======
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader, Button, TracebackNav } from "../../components/ui";
import { getTracebackPath } from "../../utils/tracebackHelper";
import "../../styles/Traceback.css";

const LostAndFoundTraceback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="traceback-page">
      <PageHeader
        title="Lost & Found - Traceback"
        subtitle="Privacy-first reporting, matching, and secure returns"
      />
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
            <Button
              variant="primary"
              onClick={() =>
                navigate(getTracebackPath(location.pathname, "report-lost"))
              }
            >
              I Lost Something
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                navigate(getTracebackPath(location.pathname, "report-found"))
              }
            >
              I Found Something
            </Button>
          </div>
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
        </div>
      </div>
    </div>
  );
};

export default LostAndFoundTraceback;
