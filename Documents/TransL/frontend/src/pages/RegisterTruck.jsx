import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterTruck() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vehicle_number: "",
    vin_number: "",
    permit_number: "",
    rc_number: "",
    driver_phone: "",
    location: "",
    route_destination: "",
    capacity_weight: "",
    capacity_volume: "",
  });

  const [loading, setLoading] = useState(false);

  const submitTruck = async () => {
    // validation
    if (
      !form.vehicle_number.trim() ||
      !form.vin_number.trim() ||
      !form.permit_number.trim() ||
      !form.rc_number.trim() ||
      !form.driver_phone.trim() ||
      !form.location.trim() ||
      !form.route_destination.trim() ||
      !form.capacity_weight ||
      !form.capacity_volume
    ) {
      toast.error("Please fill all truck fields.");
      return;
    }

    if (!/^\d+$/.test(form.driver_phone)) {
      toast.error("Driver phone number must contain only numbers.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/add", {
        vehicle_number: form.vehicle_number,
        vin_number: form.vin_number,
        permit_number: form.permit_number,
        rc_number: form.rc_number,
        driver_phone: form.driver_phone,
        location: form.location,
        route_destination: form.route_destination,
        capacity_weight: Number(form.capacity_weight),
        capacity_volume: Number(form.capacity_volume),
      });

      toast.success("Truck registered successfully!");

      setForm({
        vehicle_number: "",
        vin_number: "",
        permit_number: "",
        rc_number: "",
        driver_phone: "",
        location: "",
        route_destination: "",
        capacity_weight: "",
        capacity_volume: "",
      });

      setTimeout(() => {
        navigate("/match");
      }, 1200);
    } catch (err) {
      console.log(err.response?.data || err.message);

      if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Failed to register truck. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <Navbar />

      <div className="portal-wrap">
        <div className="portal-header">
          <h2>Register your truck</h2>
          <p>Add your truck to the TransL network.</p>
        </div>

        <div className="form-card">
          <div className="form-section-title">Truck details</div>

          <div className="form-row">
            <div className="form-group">
              <label>Vehicle number</label>
              <input
                value={form.vehicle_number}
                onChange={(e) =>
                  setForm({ ...form, vehicle_number: e.target.value })
                }
                placeholder="Ex: KA01AB1234"
              />
            </div>

            <div className="form-group">
              <label>VIN number</label>
              <input
                value={form.vin_number}
                onChange={(e) => setForm({ ...form, vin_number: e.target.value })}
                placeholder="Ex: VIN12345XYZ"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Permit number</label>
              <input
                value={form.permit_number}
                onChange={(e) =>
                  setForm({ ...form, permit_number: e.target.value })
                }
                placeholder="Ex: PERMIT9988"
              />
            </div>

            <div className="form-group">
              <label>RC number</label>
              <input
                value={form.rc_number}
                onChange={(e) => setForm({ ...form, rc_number: e.target.value })}
                placeholder="Ex: RC998877"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Driver phone number</label>
              <input
                value={form.driver_phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    driver_phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="Ex: 9876543210"
              />
            </div>

            <div className="form-group">
              <label>Current location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ex: Bangalore"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Route destination</label>
              <input
                value={form.route_destination}
                onChange={(e) =>
                  setForm({ ...form, route_destination: e.target.value })
                }
                placeholder="Ex: Hyderabad"
              />
            </div>

            <div className="form-group">
              <label>Capacity weight (kg)</label>
              <input
                type="number"
                value={form.capacity_weight}
                onChange={(e) =>
                  setForm({ ...form, capacity_weight: e.target.value })
                }
                placeholder="Ex: 5000"
              />
            </div>
          </div>

          <div className="form-row single">
            <div className="form-group">
              <label>Capacity volume (m³)</label>
              <input
                type="number"
                value={form.capacity_volume}
                onChange={(e) =>
                  setForm({ ...form, capacity_volume: e.target.value })
                }
                placeholder="Ex: 20"
              />
            </div>
          </div>

          <div className="submit-row">
            <button
              className="btn-form"
              onClick={submitTruck}
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Registering..." : "Register truck →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}