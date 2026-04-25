import React, { useEffect, useState } from "react";
import api, { getMe } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Cargo
  const [cargos, setCargos] = useState([]);
  const [cargoForm, setCargoForm] = useState({
    owner_id: 0,
    origin: "",
    destination: "",
    weight_kg: "",
    volume_m3: "",
    deadline: "",
  });

  // Truck
  const [trucks, setTrucks] = useState([]);
  const [truckForm, setTruckForm] = useState({
    vehicle_number: "",
    vin_number: "",
    permit_number: "",
    location: "",
    route_destination: "",
    capacity_weight: "",
    capacity_volume: "",
  });

  // Matches
  const [matches, setMatches] = useState([]);

  // Tabs
  const [activeTab, setActiveTab] = useState("cargo");

  // ---------------- LOAD USER ----------------
  const loadUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  // ---------------- LOAD CARGOS ----------------
  const loadCargos = async () => {
    try {
      const res = await api.get("/api/");
      setCargos(res.data);
    } catch (err) {
      console.log("Error loading cargos", err);
    }
  };

  // ---------------- LOAD TRUCKS ----------------
  const loadTrucks = async () => {
    try {
      const res = await api.get("/api/trucks");
      setTrucks(res.data);
    } catch (err) {
      console.log("Error loading trucks", err);
    }
  };

  // ---------------- ADD CARGO ----------------
  const addCargo = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/", {
        owner_id: Number(cargoForm.owner_id),
        origin: cargoForm.origin,
        destination: cargoForm.destination,
        weight_kg: Number(cargoForm.weight_kg),
        volume_m3: Number(cargoForm.volume_m3),
        deadline: cargoForm.deadline,
      });

      setCargoForm({
        owner_id: 0,
        origin: "",
        destination: "",
        weight_kg: "",
        volume_m3: "",
        deadline: "",
      });

      loadCargos();
      alert("Cargo added successfully!");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to add cargo.");
    }
  };

  // ---------------- ADD TRUCK ----------------
  const addTruck = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/add", {
        vehicle_number: truckForm.vehicle_number,
        vin_number: truckForm.vin_number,
        permit_number: truckForm.permit_number,
        location: truckForm.location,
        route_destination: truckForm.route_destination,
        capacity_weight: Number(truckForm.capacity_weight),
        capacity_volume: Number(truckForm.capacity_volume),
      });

      setTruckForm({
        vehicle_number: "",
        vin_number: "",
        permit_number: "",
        location: "",
        route_destination: "",
        capacity_weight: "",
        capacity_volume: "",
      });

      loadTrucks();
      alert("Truck added successfully!");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to add truck.");
    }
  };

  // ---------------- RUN MATCHING ----------------
  const runMatching = async () => {
    try {
      const res = await api.post("/api/run");
      setMatches(res.data);
      setActiveTab("matching");
      alert("Matching complete!");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Matching failed.");
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    loadUser();
    loadCargos();
    loadTrucks();
  }, []);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logoBox}>
          <h2 style={styles.logo}>TransL</h2>
          <p style={styles.subtitle}>Transport Load Matching System</p>
        </div>

        <div style={styles.userBox}>
          <div style={styles.userInfo}>
            <span style={styles.userEmail}>{user?.email}</span>
            <span style={styles.userRole}>User Dashboard</span>
          </div>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>Welcome to TransL</h1>
          <p style={styles.heroText}>
            Manage cargos, trucks, and run automatic load matching instantly.
          </p>
        </div>

        <button style={styles.matchBtn} onClick={runMatching}>
          🚀 Run Matching
        </button>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "cargo" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("cargo")}
        >
          Cargo
        </button>

        <button
          style={activeTab === "truck" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("truck")}
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

      {/* MAIN CONTENT */}
      <div style={styles.content}>
        {/* ---------------- CARGO TAB ---------------- */}
        {activeTab === "cargo" && (
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.heading}>➕ Add Cargo</h3>

              <form onSubmit={addCargo} style={styles.form}>
                <input
                  type="number"
                  placeholder="Owner ID"
                  value={cargoForm.owner_id}
                  onChange={(e) =>
                    setCargoForm({ ...cargoForm, owner_id: e.target.value })
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="text"
                  placeholder="Origin"
                  value={cargoForm.origin}
                  onChange={(e) =>
                    setCargoForm({ ...cargoForm, origin: e.target.value })
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="text"
                  placeholder="Destination"
                  value={cargoForm.destination}
                  onChange={(e) =>
                    setCargoForm({ ...cargoForm, destination: e.target.value })
                  }
                  style={styles.input}
                  required
                />

                <div style={styles.row}>
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={cargoForm.weight_kg}
                    onChange={(e) =>
                      setCargoForm({ ...cargoForm, weight_kg: e.target.value })
                    }
                    style={styles.input}
                    required
                  />

                  <input
                    type="number"
                    placeholder="Volume (m³)"
                    value={cargoForm.volume_m3}
                    onChange={(e) =>
                      setCargoForm({ ...cargoForm, volume_m3: e.target.value })
                    }
                    style={styles.input}
                    required
                  />
                </div>

                <input
                  type="datetime-local"
                  value={cargoForm.deadline}
                  onChange={(e) =>
                    setCargoForm({ ...cargoForm, deadline: e.target.value })
                  }
                  style={styles.input}
                  required
                />

                <button style={styles.primaryBtn}>Add Cargo</button>
              </form>
            </div>

            <div style={styles.card}>
              <h3 style={styles.heading}>📦 Cargo List</h3>

              {cargos.length === 0 ? (
                <p style={styles.emptyText}>No cargos found.</p>
              ) : (
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Weight</th>
                        <th>Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargos.map((c) => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.origin}</td>
                          <td>{c.destination}</td>
                          <td>{c.weight_kg} kg</td>
                          <td>{c.volume_m3} m³</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- TRUCK TAB ---------------- */}
        {activeTab === "truck" && (
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.heading}>➕ Add Truck</h3>

              <form onSubmit={addTruck} style={styles.form}>
                <input
                  type="text"
                  placeholder="Vehicle Number"
                  value={truckForm.vehicle_number}
                  onChange={(e) =>
                    setTruckForm({
                      ...truckForm,
                      vehicle_number: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="text"
                  placeholder="VIN Number"
                  value={truckForm.vin_number}
                  onChange={(e) =>
                    setTruckForm({ ...truckForm, vin_number: e.target.value })
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="text"
                  placeholder="Permit Number"
                  value={truckForm.permit_number}
                  onChange={(e) =>
                    setTruckForm({
                      ...truckForm,
                      permit_number: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="text"
                  placeholder="Current Location"
                  value={truckForm.location}
                  onChange={(e) =>
                    setTruckForm({ ...truckForm, location: e.target.value })
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="text"
                  placeholder="Route Destination"
                  value={truckForm.route_destination}
                  onChange={(e) =>
                    setTruckForm({
                      ...truckForm,
                      route_destination: e.target.value,
                    })
                  }
                  style={styles.input}
                  required
                />

                <div style={styles.row}>
                  <input
                    type="number"
                    placeholder="Capacity Weight"
                    value={truckForm.capacity_weight}
                    onChange={(e) =>
                      setTruckForm({
                        ...truckForm,
                        capacity_weight: e.target.value,
                      })
                    }
                    style={styles.input}
                    required
                  />

                  <input
                    type="number"
                    placeholder="Capacity Volume"
                    value={truckForm.capacity_volume}
                    onChange={(e) =>
                      setTruckForm({
                        ...truckForm,
                        capacity_volume: e.target.value,
                      })
                    }
                    style={styles.input}
                    required
                  />
                </div>

                <button style={styles.primaryBtn}>Add Truck</button>
              </form>
            </div>

            <div style={styles.card}>
              <h3 style={styles.heading}>🚚 Truck List</h3>

              {trucks.length === 0 ? (
                <p style={styles.emptyText}>No trucks found.</p>
              ) : (
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Vehicle</th>
                        <th>Location</th>
                        <th>Destination</th>
                        <th>Weight Cap.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trucks.map((t) => (
                        <tr key={t.id}>
                          <td>{t.id}</td>
                          <td>{t.vehicle_number}</td>
                          <td>{t.location}</td>
                          <td>{t.route_destination}</td>
                          <td>{t.capacity_weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- MATCHING TAB ---------------- */}
        {activeTab === "matching" && (
          <div style={styles.card}>
            <h3 style={styles.heading}>🔗 Matching Results</h3>

            {matches.length === 0 ? (
              <p style={styles.emptyText}>
                No matches available. Click "Run Matching".
              </p>
            ) : (
              <div style={styles.matchGrid}>
                {matches.map((m, index) => (
                  <div key={index} style={styles.matchCard}>
                    <h4 style={{ margin: 0, color: "#00d1b2" }}>
                      Match #{index + 1}
                    </h4>
                    <p style={styles.matchText}>
                      Cargo ID: <b>{m.cargo_id}</b>
                    </p>
                    <p style={styles.matchText}>
                      Truck ID: <b>{m.truck_id}</b>
                    </p>
                    <p style={styles.matchText}>
                      Score: <b>{m.score}</b>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #151515, #050505)",
    fontFamily: "Arial",
    color: "white",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 35px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(10,10,10,0.9)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },

  logoBox: {
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "bold",
    color: "#00d1b2",
    letterSpacing: "1px",
  },

  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#888",
  },

  userBox: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },

  userEmail: {
    fontSize: "14px",
    color: "#ccc",
  },

  userRole: {
    fontSize: "12px",
    color: "#666",
  },

  logoutBtn: {
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #ff4d4d, #ff1a1a)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "35px",
    margin: "25px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, rgba(0,209,178,0.15), rgba(0,0,0,0))",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  heroTitle: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "bold",
    color: "#fff",
  },

  heroText: {
    marginTop: "8px",
    color: "#aaa",
    fontSize: "15px",
    maxWidth: "550px",
  },

  matchBtn: {
    padding: "14px 22px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(90deg, #00d1b2, #00ffa6)",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  tab: {
    padding: "12px 22px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "#ccc",
    cursor: "pointer",
    fontWeight: "bold",
  },

  tabActive: {
    padding: "12px 22px",
    borderRadius: "14px",
    border: "1px solid rgba(0,209,178,0.8)",
    background: "rgba(0,209,178,0.15)",
    color: "#00d1b2",
    cursor: "pointer",
    fontWeight: "bold",
  },

  content: {
    padding: "0px 30px 40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "rgba(20,20,20,0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "22px",
    borderRadius: "18px",
    boxShadow: "0px 0px 25px rgba(0,0,0,0.65)",
    backdropFilter: "blur(8px)",
  },

  heading: {
    marginBottom: "15px",
    color: "#00d1b2",
    fontSize: "18px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    background: "rgba(0,0,0,0.4)",
    color: "white",
    fontSize: "14px",
  },

  row: {
    display: "flex",
    gap: "10px",
  },

  primaryBtn: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #00d1b2, #00ffa6)",
    color: "black",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "5px",
  },

  emptyText: {
    color: "#888",
    fontSize: "14px",
  },

  tableWrap: {
    overflowX: "auto",
    marginTop: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  matchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
    marginTop: "15px",
  },

  matchCard: {
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(0,209,178,0.3)",
    padding: "15px",
    borderRadius: "14px",
  },

  matchText: {
    margin: "6px 0",
    color: "#ddd",
  },
};