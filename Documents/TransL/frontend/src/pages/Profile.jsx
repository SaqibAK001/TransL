import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getMe } from "../services/api";
import { toast } from "react-toastify";

export default function Profile() {
  const [user, setUser] = useState(null);

  const [cargos, setCargos] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const me = await getMe();
      setUser(me);
      setNewName(me.name);

      const cargoRes = await api.get("/api/my-cargos");
      setCargos(cargoRes.data || []);

      const truckRes = await api.get("/api/my-trucks");
      setTrucks(truckRes.data || []);

      const matchRes = await api.get("/api/my-matches");
      setMatches(matchRes.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to load profile data.");
    }

    setLoading(false);
  };

  const updateName = async () => {
    if (!newName.trim()) {
      toast.warning("Name cannot be empty.");
      return;
    }

    setSavingName(true);

    try {
      const res = await api.put("/api/auth/update", { name: newName });
      setUser(res.data);
      toast.success("Name updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update name.");
    }

    setSavingName(false);
  };

  const changePassword = async () => {
    if (!oldPass || !newPass) {
      toast.warning("Fill old and new password.");
      return;
    }

    if (newPass.length < 6) {
      toast.warning("New password must be at least 6 characters.");
      return;
    }

    setSavingPass(true);

    try {
      await api.put("/api/auth/change-password", {
        old_password: oldPass,
        new_password: newPass,
      });

      toast.success("Password updated successfully!");
      setOldPass("");
      setNewPass("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to change password.");
    }

    setSavingPass(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const SkeletonCard = () => (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "18px",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          width: "180px",
          height: "14px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      ></div>

      <div
        style={{
          width: "70%",
          height: "12px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "8px",
          marginBottom: "8px",
        }}
      ></div>

      <div
        style={{
          width: "55%",
          height: "12px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "8px",
        }}
      ></div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />

      <div className="portal-wrap">
        <div className="portal-header">
          <h2>My Profile</h2>
          <p>Manage your account and view history.</p>
        </div>

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* ACCOUNT DETAILS */}
            <div className="form-card" style={{ marginBottom: "30px" }}>
              <div className="form-section-title">Account Details</div>

              <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                <b style={{ color: "white" }}>Email:</b> {user?.email}
              </p>

              <div style={{ marginTop: "15px" }}>
                <label style={{ display: "block", marginBottom: "6px" }}>
                  Update Name
                </label>

                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "white",
                    outline: "none",
                  }}
                />

                <button
                  className="btn btn-accent"
                  onClick={updateName}
                  disabled={savingName}
                  style={{ marginTop: "12px" }}
                >
                  {savingName ? "Saving..." : "Save Name"}
                </button>
              </div>
            </div>

            {/* CHANGE PASSWORD */}
            <div className="form-card" style={{ marginBottom: "30px" }}>
              <div className="form-section-title">Change Password</div>

              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "6px" }}>
                  Old Password
                </label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "white",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px" }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "white",
                    outline: "none",
                  }}
                />
              </div>

              <button
                className="btn btn-outline"
                onClick={changePassword}
                disabled={savingPass}
                style={{ marginTop: "12px" }}
              >
                {savingPass ? "Updating..." : "Update Password"}
              </button>
            </div>

            {/* CARGO HISTORY */}
            <div className="form-card" style={{ marginBottom: "30px" }}>
              <div className="form-section-title">Cargo History</div>

              {cargos.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  No cargos available.
                </p>
              ) : (
                cargos.map((c, i) => (
                  <div key={i} className="match-card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "16px" }}>
                          Cargo #{c.id}
                        </div>

                        <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                          {c.origin} → {c.destination}
                        </div>

                        <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                          Weight: {c.weight_kg} kg | Volume: {c.volume_m3} m³
                        </div>
                      </div>

                      <div className="score-pill">{c.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* TRUCK HISTORY */}
            <div className="form-card" style={{ marginBottom: "30px" }}>
              <div className="form-section-title">Truck History</div>

              {trucks.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  No trucks registered yet.
                </p>
              ) : (
                trucks.map((t, i) => (
                  <div key={i} className="match-card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "16px" }}>
                          {t.vehicle_number}
                        </div>

                        <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                          {t.location} → {t.route_destination}
                        </div>

                        <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                          Capacity: {t.capacity_weight} kg | {t.capacity_volume}{" "}
                          m³
                        </div>
                      </div>

                      <div className="score-pill">Active</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* MATCH HISTORY */}
            <div className="form-card">
              <div className="form-section-title">Match History</div>

              {(() => {
                const validMatches = matches.filter(
                  (m) => m && m.cargo_route && m.cargo_route.trim() !== ""
                );

                if (validMatches.length === 0) {
                  return (
                    <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                      No Matches available.
                    </p>
                  );
                }

                return validMatches.map((m, i) => {
                  const score =
                    m.score === null || m.score === undefined
                      ? "—"
                      : `${m.score}%`;

                  return (
                    <div
                      key={i}
                      className="match-card"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "800", fontSize: "15px" }}>
                          Match #{i + 1}
                        </div>

                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "13px",
                            marginTop: "4px",
                          }}
                        >
                          <b style={{ color: "white" }}>Cargo:</b>{" "}
                          {m.cargo_route}
                        </div>

                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "13px",
                            marginTop: "2px",
                          }}
                        >
                          <b style={{ color: "white" }}>Truck:</b>{" "}
                          {m.assigned_truck ? m.assigned_truck : "Not Assigned"}
                        </div>

                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "12px",
                            marginTop: "6px",
                          }}
                        >
                          {m.created_at
                            ? new Date(m.created_at).toLocaleString()
                            : "Date not available"}
                        </div>
                      </div>

                      <div
                        style={{
                          minWidth: "90px",
                          textAlign: "center",
                          padding: "10px 14px",
                          borderRadius: "999px",
                          fontWeight: "800",
                          fontSize: "14px",
                          background: m.assigned_truck
                            ? "rgba(0,255,160,0.12)"
                            : "rgba(255,255,255,0.06)",
                          border: m.assigned_truck
                            ? "1px solid rgba(0,255,160,0.25)"
                            : "1px solid rgba(255,255,255,0.1)",
                          color: m.assigned_truck ? "#00ffa6" : "var(--muted)",
                        }}
                      >
                        {score}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}