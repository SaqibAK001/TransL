import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <Navbar />

      <div className="hero">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>

        <div className="eyebrow">AI-powered logistics</div>

        <h1>
          Match cargo to trucks <br />
          <em>intelligently.</em>
        </h1>

        <p className="hero-sub">
          No more WhatsApp groups. No more half-empty trucks. TransL uses AI to
          connect the right cargo with the right truck — in seconds.
        </p>

        <div className="hero-cta">
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => navigate("/shipper")}
          >
            Post a load →
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/truck")}
          >
            Register your truck
          </button>
        </div>
      </div>

      <div className="section">
        <div className="section-label">Why TransL</div>

        <div className="section-title">
          Everything broken in <br />
          logistics — fixed.
        </div>

        <p className="section-sub">
          Built specifically for the realities of Indian trucking and freight
          markets.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <div className="feature-title">AI match engine</div>
            <div className="feature-desc">
              Scores every truck on route, capacity, cargo type, and schedule.
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <div className="feature-title">Route intelligence</div>
            <div className="feature-desc">
              Eliminates empty return trips by matching corridor routes.
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Real-time matching</div>
            <div className="feature-desc">
              Matching begins instantly the moment a load is posted.
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <div className="feature-title">Fleet analytics</div>
            <div className="feature-desc">
              Track utilisation, savings, and revenue across your fleet.
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <div className="feature-title">Verified network</div>
            <div className="feature-desc">
              Every shipper and truck owner is verified and tracked.
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <div className="feature-title">Dynamic pricing</div>
            <div className="feature-desc">
              AI suggests fair rates based on demand and route conditions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}