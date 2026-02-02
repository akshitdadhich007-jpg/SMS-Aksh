import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Admin from './pages/Admin';
import Resident from './pages/Resident';
import Security from './pages/Security';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/resident" element={<Resident />} />
                <Route path="/security" element={<Security />} />
            </Routes>
        </Router>
    );
}

export default App;
