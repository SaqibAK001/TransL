import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("cargo");

  const [user, setUser] = useState(null);

  const [cargoList, setCargoList] = useState([]);
  const [truckList, setTruckList] = useState([]);
  const [matchingResults, setMatchingResults] = useState([]);

  const [message, setMessage] = useState("");

  // Cargo Form
  const [cargoForm, setCargoForm] = useState({
    owner_id: 0,
    origin: "",
    destination: "",
    weight_kg: "",
    volume_m3: "",
    deadline: "",
  });

  // Truck Form
  const [truckForm, setTruckForm] = useState({
    vehicle_number: "",
    vin_number: "",
    permit_number: "",
    location: "",
    route_destination: "",
    capacity_weight: "",
    capacity_volume: "",
  });

  // ------------------ LOAD USER ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    fetchUser();
    fetchCargo();
    fetchTrucks();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  // ------------------ FETCH CARGO ------------------
  const fetchCargo = async () => {
    try {
      const res = await api.get("/api/");
      setCargoList(res.data);
    } catch (err) {
      console.log("Cargo fetch error:", err);
    }
  };

  // ------------------ FETCH TRUCKS ------------------
  const fetchTrucks = async () => {
    try {
      // Your backend DOES NOT have GET /api/trucks
      // So we will leave this as empty unless you add the endpoint
      setTruckList([]);
    } catch (err) {
      console.log("Truck fetch error:", err);
    }
  };

  // ------------------ ADD CARGO ------------------
  const addCargo = async () => {
    try {
      setMessage("");

      const payload = {
        owner_id: parseInt(cargoForm.owner_id),
        origin: cargoForm.origin,
        destination: cargoForm.destination,
        weight_kg: parseFloat(cargoForm.weight_kg),
        volume_m3: parseFloat(cargoForm.volume_m3),
        deadline: cargoForm.deadline,
      };

      await api.post("/api/", payload);

      setMessage("Cargo added successfully!");
      setCargoForm({
        owner_id: 0,
        origin: "",
        destination: "",
        weight_kg: "",
        volume_m3: "",
        deadline: "",
      });

      fetchCargo();
    } catch (err) {
      console.log("Add cargo error:", err);
      setMessage("Failed to add cargo.");
    }
  };

  // ------------------ DELETE CARGO ------------------
  const deleteCargo = async (id) => {
    try {
      setMessage("");
      await api.delete(`/api/${id}`);
      setMessage("Cargo deleted successfully!");
      fetchCargo();
    } catch (err) {
      console.log("Delete cargo error:", err);
      setMessage("Failed to delete cargo.");
    }
  };

  // ------------------ ADD TRUCK ------------------
  const addTruck = async () => {
    try {
      setMessage("");

      const payload = {
        vehicle_number: truckForm.vehicle_number,
        vin_number: truckForm.vin_number,
        permit_number: truckForm.permit_number,
        location: truckForm.location,
        route_destination: truckForm.route_destination,
        capacity_weight: parseFloat(truckForm.capacity_weight),
        capacity_volume: parseFloat(truckForm.capacity_volume),
      };

      await api.post("/api/add", payload);

      setMessage("Truck added successfully!");
      setTruckForm({
        vehicle_number: "",
        vin_number: "",
        permit_number: "",
        location: "",
        route_destination: "",
        capacity_weight: "",
        capacity_volume: "",
      });

      fetchTrucks();
    } catch (err) {
      console.log("Add truck error:", err);
      setMessage("Failed to add truck.");
    }
  };

  // ------------------ RUN MATCHING ------------------
  const runMatching = async () => {
    try {
      setMessage("");
      const res = await api.post("/api/run");
      setMatchingResults(res.data);
      setMessage("Matching completed successfully!");
      setActiveTab("matching");
    } catch (err) {
      console.log("Matching error:", err);
      setMessage("Matching failed.");
    }
  };

  // ------------------ LOGOUT ------------------
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.logo}>TransL</h1>
          <p style={styles.subtitle}>Transport Load Matching System</p>
        </div>

        <div style={styles.userBox}>
          <p style={styles.userEmail}>{user?.email}</p>
          <p style={styles.userRole}>User Dashboard</p>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div style={styles.banner}>
        <div>
          <h2 style={styles.bannerTitle}>Welcome to TransL</h2>
          <p style={styles.bannerText}>
            Manage cargos, trucks, and run automatic load matching instantly.
          </p>
        </div>

        <button style={styles.runBtn} onClick={runMatching}>
          🚀 Run Matching
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "cargo" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("cargo")}
        >
          Cargo
        </button>

        <button
          style={activeTab === "trucks" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("trucks")}
        >
          Trucks
        </button>

        <button
          style={activeTab === "matching" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("matching")}
        >
          Matching
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            ...styles.messageBox,
            backgroundColor: message.includes("Failed") ? "#3a0000" : "#003a2d",
          }}
        >
          {message}
        </div>
      )}

      {/* CONTENT AREA */}
      <div style={styles.content}>
        {/* ------------------ CARGO TAB ------------------ */}
        {activeTab === "cargo" && (
          <div style={styles.grid}>
            {/* Add Cargo */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>➕ Add Cargo</h2>

              <input
                style={styles.input}
                placeholder="Owner ID"
                value={cargoForm.owner_id}
                onChange={(e) =>
                  setCargoForm({ ...cargoForm, owner_id: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Origin"
                value={cargoForm.origin}
                onChange={(e) =>
                  setCargoForm({ ...cargoForm, origin: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Destination"
                value={cargoForm.destination}
                onChange={(e) =>
                  setCargoForm({ ...cargoForm, destination: e.target.value })
                }
              />

              <div style={styles.row}>
                <input
                  style={styles.smallInput}
                  placeholder="Weight (kg)"
                  value={cargoForm.weight_kg}
                  onChange={(e) =>
                    setCargoForm({ ...cargoForm, weight_kg: e.target.value })
                  }
                />
                <input
                  style={styles.smallInput}
                  placeholder="Volume (m³)"
                  value={cargoForm.volume_m3}
                  onChange={(e) =>
                    setCargoForm({ ...cargoForm, volume_m3: e.target.value })
                  }
                />
              </div>

              <input
                style={styles.input}
                type="datetime-local"
                value={cargoForm.deadline}
                onChange={(e) =>
                  setCargoForm({ ...cargoForm, deadline: e.target.value })
                }
              />

              <button style={styles.primaryBtn} onClick={addCargo}>
                Add Cargo
              </button>
            </div>

            {/* Cargo List */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📦 Cargo List</h2>

              {cargoList.length === 0 ? (
                <p style={styles.emptyText}>No cargo found.</p>
              ) : (
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Origin</th>
                        <th style={styles.th}>Destination</th>
                        <th style={styles.th}>Weight</th>
                        <th style={styles.th}>Volume</th>
                        <th style={styles.th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargoList.map((c) => (
                        <tr key={c.id}>
                          <td style={styles.td}>{c.id}</td>
                          <td style={styles.td}>{c.origin}</td>
                          <td style={styles.td}>{c.destination}</td>
                          <td style={styles.td}>{c.weight_kg} kg</td>
                          <td style={styles.td}>{c.volume_m3} m³</td>
                          <td style={styles.td}>
                            <button
                              style={styles.deleteBtn}
                              onClick={() => deleteCargo(c.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------ TRUCK TAB ------------------ */}
        {activeTab === "trucks" && (
          <div style={styles.grid}>
            {/* Add Truck */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>➕ Add Truck</h2>

              <input
                style={styles.input}
                placeholder="Vehicle Number"
                value={truckForm.vehicle_number}
                onChange={(e) =>
                  setTruckForm({ ...truckForm, vehicle_number: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="VIN Number"
                value={truckForm.vin_number}
                onChange={(e) =>
                  setTruckForm({ ...truckForm, vin_number: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Permit Number"
                value={truckForm.permit_number}
                onChange={(e) =>
                  setTruckForm({ ...truckForm, permit_number: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Current Location"
                value={truckForm.location}
                onChange={(e) =>
                  setTruckForm({ ...truckForm, location: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Route Destination"
                value={truckForm.route_destination}
                onChange={(e) =>
                  setTruckForm({
                    ...truckForm,
                    route_destination: e.target.value,
                  })
                }
              />

              <div style={styles.row}>
                <input
                  style={styles.smallInput}
                  placeholder="Capacity Weight"
                  value={truckForm.capacity_weight}
                  onChange={(e) =>
                    setTruckForm({
                      ...truckForm,
                      capacity_weight: e.target.value,
                    })
                  }
                />
                <input
                  style={styles.smallInput}
                  placeholder="Capacity Volume"
                  value={truckForm.capacity_volume}
                  onChange={(e) =>
                    setTruckForm({
                      ...truckForm,
                      capacity_volume: e.target.value,
                    })
                  }
                />
              </div>

              <button style={styles.primaryBtn} onClick={addTruck}>
                Add Truck
              </button>
            </div>

            {/* Truck List */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>🚚 Truck List</h2>

              {truckList.length === 0 ? (
                <p style={styles.emptyText}>No trucks found.</p>
              ) : (
                <pre style={styles.jsonBox}>
                  {JSON.stringify(truckList, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* ------------------ MATCHING TAB ------------------ */}
        {activeTab === "matching" && (
          <div style={styles.gridSingle}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>⚡ Matching Results</h2>

              {matchingResults.length === 0 ? (
                <p style={styles.emptyText}>
                  No matching results yet. Click "Run Matching".
                </p>
              ) : (
                <pre style={styles.jsonBox}>
                  {JSON.stringify(matchingResults, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------ STYLES ------------------ */
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #111, #000)",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    color: "#fff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "25px",
  },

  logo: {
    color: "#00ffc3",
    fontSize: "34px",
    margin: 0,
    fontWeight: "bold",
  },

  subtitle: {
    margin: 0,
    color: "#aaa",
    fontSize: "13px",
  },

  userBox: {
    textAlign: "right",
  },

  userEmail: {
    margin: 0,
    color: "#ddd",
    fontSize: "14px",
  },

  userRole: {
    margin: "5px 0 10px",
    color: "#666",
    fontSize: "12px",
  },

  logoutBtn: {
    background: "linear-gradient(to right, #ff3b3b, #d60000)",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  banner: {
    background: "rgba(0,255,195,0.08)",
    border: "1px solid rgba(0,255,195,0.2)",
    padding: "30px",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  bannerTitle: {
    margin: 0,
    fontSize: "32px",
  },

  bannerText: {
    marginTop: "8px",
    color: "#aaa",
  },

  runBtn: {
    background: "linear-gradient(to right, #00ffc3, #00b894)",
    border: "none",
    padding: "14px 22px",
    borderRadius: "12px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "25px",
  },

  tab: {
    background: "#111",
    border: "1px solid #333",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#bbb",
    fontWeight: "bold",
  },

  tabActive: {
    background: "rgba(0,255,195,0.15)",
    border: "1px solid #00ffc3",
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#00ffc3",
    fontWeight: "bold",
  },

  messageBox: {
    width: "70%",
    margin: "0 auto 20px",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    fontWeight: "bold",
  },

  content: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
  },

  gridSingle: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "25px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0px 0px 30px rgba(0,0,0,0.8)",
  },

  cardTitle: {
    marginTop: 0,
    marginBottom: "18px",
    color: "#00ffc3",
    fontSize: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "#050505",
    color: "#fff",
    marginBottom: "12px",
    outline: "none",
  },

  row: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
  },

  smallInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "#050505",
    color: "#fff",
    outline: "none",
  },

  primaryBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(to right, #00ffc3, #00b894)",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
    color: "#000",
    marginTop: "10px",
  },

  emptyText: {
    color: "#777",
    fontSize: "14px",
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "10px",
    borderBottom: "1px solid #333",
    color: "#00ffc3",
    textAlign: "left",
    fontSize: "14px",
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #222",
    fontSize: "13px",
    color: "#ddd",
  },

  deleteBtn: {
    background: "#ff3b3b",
    border: "none",
    padding: "7px 14px",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  jsonBox: {
    background: "#050505",
    border: "1px solid #222",
    padding: "15px",
    borderRadius: "12px",
    color: "#00ffc3",
    fontSize: "13px",
    overflowX: "auto",
    maxHeight: "400px",
  },
};