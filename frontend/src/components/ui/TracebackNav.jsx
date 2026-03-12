<<<<<<< HEAD
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard } from 'lucide-react';

=======
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutDashboard } from "lucide-react";
import { getTracebackPath } from "../../utils/tracebackHelper";
import "../../styles/Traceback.css";
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f

/**
 * TracebackNav - Navigation component for Traceback module
 * Provides Home and Dashboard navigation buttons
 */
const TracebackNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD

    // Navigation handlers (no-op after Traceback removal)
    const handleHome = () => {
        navigate('/');
    };
    const handleDashboard = () => {
        navigate('/');
    };
=======
  const handleHome = () => {
    navigate(getTracebackPath(location.pathname));
  };

  const handleDashboard = () => {
    navigate(getTracebackPath(location.pathname, "matches"));
  };
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f

  return (
    <div className="traceback-nav">
      <button onClick={handleHome} className="traceback-nav-btn">
        <Home size={18} />
        <span>Home</span>
      </button>

      <button onClick={handleDashboard} className="traceback-nav-btn">
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </button>
    </div>
  );
};

export default TracebackNav;
