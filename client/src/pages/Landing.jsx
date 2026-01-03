import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #71b7e6, #9b59b6)" }}>
      <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, textAlign: "center", width: "100%", maxWidth: 480 }}>
        <h2 style={{ marginBottom: "1rem" }}>Welcome</h2>
        <p style={{ marginBottom: "1rem" }}>Please login or sign up to continue.</p>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          <Link to="/login" style={{ padding: "0.75rem 1.25rem", background: "#9b59b6", color: "#fff", borderRadius: 8, textDecoration: "none" }}>Login</Link>
          <Link to="/signup" style={{ padding: "0.75rem 1.25rem", background: "#eee", color: "#333", borderRadius: 8, textDecoration: "none" }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}