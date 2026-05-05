import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";

export default function MatchDetails() {
  const { cargoId } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMatch = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/api/match/${cargoId}`);
      setMatch(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to load match details.");
      setMatch(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMatch();
  }, []);

  return (
    <div className="page">
      <Navbar />

      <div className="portal-wrap">
        <div className="portal-header">
          <h2>Match Details</h2>
          <p>Detailed cargo + truck matching information.</p>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading match details...</p>
        ) : !match ? (
          <p style={{ color: "var(--muted)" }}>Match not found.</p>
        ) : (
          <>
            {/* Cargo Card */}
            <div className="form-card" style={{ marginBottom: "25px" }}>
              <div className="form-section-title">Cargo Information</div>

              <p style={{ color: "var(--muted)" }}>
                <b style={{ color: "white" }}>Cargo ID:</b> {match.cargo.id}
              </p>

              <p style={{ color: "var(--muted)" }}>
                <b style={{ color: "white" }}>Route:</b> {match.cargo.origin} →{" "}
                {match.cargo.destination}
              </p>

              <p style={{ color: "var(--muted)" }}>
                <b style={{ color: "white" }}>Weight:</b> {match.cargo.weight_kg} kg
              </p>

              <p style={{ color: "var(--muted)" }}>
                <b style={{ color: "white" }}>Volume:</b> {match.cargo.volume_m3} m³
              </p>

              <p style={{ color: "var(--muted)" }}>
                <b style={{ color: "white" }}>Status:</b> {match.cargo.status}
              </p>
            </div>

            {/* Truck Card */}
            <div className="form-card">
              <div className="form-section-title">Truck Information</div>

              {match.truck ? (
                <>
                  <p style={{ color: "var(--muted)" }}>
                    <b style={{ color: "white" }}>Vehicle:</b>{" "}
                    {match.truck.vehicle_number}
                  </p>

                  <p style={{ color: "var(--muted)" }}>
                    <b style={{ color: "white" }}>Route:</b> {match.truck.location} →{" "}
                    {match.truck.route_destination}
                  </p>

                  <p style={{ color: "var(--muted)" }}>
                    <b style={{ color: "white" }}>Capacity Weight:</b>{" "}
                    {match.truck.capacity_weight} kg
                  </p>

                  <p style={{ color: "var(--muted)" }}>
                    <b style={{ color: "white" }}>Capacity Volume:</b>{" "}
                    {match.truck.capacity_volume} m³
                  </p>

                  <div style={{ marginTop: "15px" }}>
                    <div className="score-pill" style={{ display: "inline-block" }}>
                      Matched
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: "var(--muted)" }}>
                  No truck assigned for this cargo.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}