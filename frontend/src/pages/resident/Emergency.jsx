import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/ui";
import { Phone, Shield, User, Flame, HeartPulse, Siren } from "lucide-react";
import "./Emergency.css";
import api from "../../services/api";

const Emergency = () => {
  const [contacts, setContacts] = useState({
    gateSecurity: {
      name: "Main Gate Security",
      phone: "",
      availability: "24/7 Available",
    },
    manager: {
      name: "Society Manager",
      phone: "",
      availability: "9:00 AM - 6:00 PM",
    },
  });

  useEffect(() => {
    api
      .get("/api/resident/emergency")
      .then((res) => {
        if (res.data?.contacts) setContacts(res.data.contacts);
      })
      .catch((err) => console.error("Failed to load contacts:", err));
  }, []);
  return (
    <>
      <PageHeader
        title="Emergency Contacts"
        subtitle="Quick access to important numbers"
      />

      <div className="emergency-page">
        <div className="emergency-grid">
          {/* Main Gate Security */}
          <div className="emergency-contact-card security">
            <div className="emergency-contact-header">
              <div className="emergency-icon-container">
                <Shield />
              </div>
              <div className="emergency-contact-info">
                <h3 className="emergency-contact-title">
                  {contacts.gateSecurity.name}
                </h3>
                <div className="emergency-contact-availability">
                  {contacts.gateSecurity.availability}
                </div>
              </div>
            </div>
            <a
              href={`tel:${contacts.gateSecurity.phone}`}
              style={{ textDecoration: "none" }}
            >
              <button className="emergency-contact-button">
                <Phone /> Call Now
              </button>
            </a>
            <div className="emergency-contact-phone">
              {contacts.gateSecurity.phone || "Not available"}
            </div>
          </div>

          {/* Society Manager */}
          <div className="emergency-contact-card">
            <div className="emergency-contact-header">
              <div className="emergency-icon-container">
                <User />
              </div>
              <div className="emergency-contact-info">
                <h3 className="emergency-contact-title">
                  {contacts.manager.name}
                </h3>
                <div className="emergency-contact-availability">
                  {contacts.manager.availability}
                </div>
              </div>
            </div>
            <a
              href={`tel:${contacts.manager.phone}`}
              style={{ textDecoration: "none" }}
            >
              <button className="emergency-contact-button">
                <Phone /> Call Manager
              </button>
            </a>
            <div className="emergency-contact-phone">
              {contacts.manager.phone || "Not available"}
            </div>
          </div>

          {/* Local Emergency Services */}
          <div className="emergency-services-card">
            <h3 className="emergency-services-title">
              Local Emergency Services
            </h3>
            <div className="emergency-services-list">
              <div className="emergency-service-item">
                <div className="emergency-service-info">
                  <div
                    className="emergency-service-icon"
                    style={{ color: "#dc2626" }}
                  >
                    <Siren />
                  </div>
                  <span className="emergency-service-label">Police</span>
                </div>
                <a
                  href="tel:100"
                  style={{ color: "#dc2626", textDecoration: "none" }}
                >
                  <span className="emergency-service-number">100</span>
                </a>
              </div>
              <div className="emergency-service-item">
                <div className="emergency-service-info">
                  <div
                    className="emergency-service-icon"
                    style={{ color: "#ea580c" }}
                  >
                    <Flame />
                  </div>
                  <span className="emergency-service-label">Fire Brigade</span>
                </div>
                <a
                  href="tel:101"
                  style={{ color: "#ea580c", textDecoration: "none" }}
                >
                  <span className="emergency-service-number">101</span>
                </a>
              </div>
              <div className="emergency-service-item">
                <div className="emergency-service-info">
                  <div
                    className="emergency-service-icon"
                    style={{ color: "#db2777" }}
                  >
                    <HeartPulse />
                  </div>
                  <span className="emergency-service-label">Ambulance</span>
                </div>
                <a
                  href="tel:102"
                  style={{ color: "#db2777", textDecoration: "none" }}
                >
                  <span className="emergency-service-number">102</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Emergency;
