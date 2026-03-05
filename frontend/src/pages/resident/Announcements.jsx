import React, { useState, useEffect } from "react";
import { PageHeader, Card } from "../../components/ui";
import "./Announcements.css";
import api from "../../services/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api
      .get("/api/resident/announcements")
      .then((res) => setAnnouncements(res.data || []))
      .catch((err) => console.error("Failed to load announcements:", err));
  }, []);

  if (!announcements || announcements.length === 0) {
    return (
      <>
        <PageHeader
          title="Announcements"
          subtitle="Updates and news from the society"
        />
        <div className="announcements-empty-state">
          <h3>No announcements at the moment</h3>
          <p>Check back later for updates.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Updates and news from the society"
      />

      <div className="announcements-container">
        {announcements.map((item) => (
          <div key={item.id} className="announcement-card">
            <div className="announcement-header">
              <h3 className="announcement-title">{item.title}</h3>
              <span className="announcement-date">{item.date}</span>
            </div>
            <p className="announcement-description">{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Announcements;
