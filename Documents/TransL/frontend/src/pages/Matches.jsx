import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Matches() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const runMatching = async () => {
    setLoading(true);

    try {
      toast.info("Running AI matching...");

      const res = await api.post("/api/run");

      console.log("MATCH RESPONSE:", res.data);

      let matchList = [];

      if (Array.isArray(res.data)) {
        matchList = res.data;
      } else if (res.data.matches && Array.isArray(res.data.matches)) {
        matchList = res.data.matches;
      }

      setMatches(matchList);

      if (matchList.length === 0) {
        toast.warning("No matches found.");
      } else {
        toast.success(`Matching complete! ${matchList.length} match(es) found.`);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);

      if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Matching failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <Navbar />

      <div className="match-wrap">
        <div className="portal-header">
          <h2>AI Match Results</h2>
          <p>Run matching to get best trucks for your cargo.</p>
        </div>

        <button
          className="btn btn-accent"
          onClick={runMatching}
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Matching..." : "Run Matching →"}
        </button>

        <div style={{ marginTop: "30px" }}>
          {matches.length === 0 ? (
            <p style={{ color: "var(--muted)", marginTop: "20px" }}>
              No matches yet. Click Run Matching.
            </p>
          ) : (
            matches.map((m, i) => (
              <div
                key={i}
                className={i === 0 ? "match-card top" : "match-card"}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/match/${m.cargo_id}`)}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "16px" }}>
                      Match #{i + 1}
                    </div>

                    <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                      Cargo Route: {m.cargo_route}
                    </div>

                    <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                      Assigned Truck: {m.assigned_truck || "Not Assigned"}
                    </div>

                    <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                      Truck Route: {m.truck_route || "N/A"}
                    </div>

                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: "12px",
                        marginTop: "8px",
                      }}
                    >
                      Click to view match details →
                    </div>
                  </div>

                  <div className="score-pill">
                    {m.score !== undefined ? `${m.score}%` : "0%"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}