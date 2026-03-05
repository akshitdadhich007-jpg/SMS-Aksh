import React from "react";
const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
      className="mb-32"
    >
      <div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: "4px 0 0 0",
              color: "var(--text-secondary)",
              fontSize: "14px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
};
export default PageHeader;
