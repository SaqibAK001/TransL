import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostLoad() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    weight_kg: "",
    volume_m3: "",
    deadline: "",
    sender_phone: "",
    receiver_phone: "",
  });

  const [loading, setLoading] = useState(false);

  const submitCargo = async () => {
    // validation
    if (
      !form.origin.trim() ||
      !form.destination.trim() ||
      !form.weight_kg ||
      !form.volume_m3 ||
      !form.deadline ||
      !form.sender_phone.trim() ||
      !form.receiver_phone.trim()
    ) {
      toast.error("Please fill all cargo fields.");
      return;
    }

    if (!/^\d+$/.test(form.sender_phone)) {
      toast.error("Sender phone number must contain only numbers.");
      return;
    }

    if (!/^\d+$/.test(form.receiver_phone)) {
      toast.error("Receiver phone number must contain only numbers.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/", {
        origin: form.origin,
        destination: form.destination,
        weight_kg: Number(form.weight_kg),
        volume_m3: Number(form.volume_m3),
        deadline: form.deadline,
        sender_phone: form.sender_phone,
        receiver_phone: form.receiver_phone,
      });

      toast.success("Cargo posted successfully!");

      setForm({
        origin: "",
        destination: "",
        weight_kg: "",
        volume_m3: "",
        deadline: "",
        sender_phone: "",
        receiver_phone: "",
      });

      setTimeout(() => {
        navigate("/match");
      }, 1200);
    } catch (err) {
      console.log(err.response?.data || err.message);

      if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Failed to post cargo. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <Navbar />

      <div className="portal-wrap">
        <div className="portal-header">
          <h2>Post a Load</h2>
          <p>Add cargo details to get AI-based truck matching.</p>
        </div>

        <div className="form-card">
          <div className="form-section-title">Cargo details</div>

          <div className="form-row">
            <div className="form-group">
              <label>Origin</label>
              <input
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                placeholder="Ex: Bangalore"
              />
            </div>

            <div className="form-group">
              <label>Destination</label>
              <input
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
                placeholder="Ex: Mumbai"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={form.weight_kg}
                onChange={(e) =>
                  setForm({ ...form, weight_kg: e.target.value })
                }
                placeholder="Ex: 2500"
              />
            </div>

            <div className="form-group">
              <label>Volume (m³)</label>
              <input
                type="number"
                value={form.volume_m3}
                onChange={(e) =>
                  setForm({ ...form, volume_m3: e.target.value })
                }
                placeholder="Ex: 10"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sender phone number</label>
              <input
                value={form.sender_phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sender_phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="Ex: 9876543210"
              />
            </div>

            <div className="form-group">
              <label>Receiver phone number</label>
              <input
                value={form.receiver_phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    receiver_phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="Ex: 9123456780"
              />
            </div>
          </div>

          <div className="form-row single">
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="datetime-local"
                value={form.deadline}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
              />
            </div>
          </div>

          <div className="submit-row">
            <button
              className="btn-form"
              onClick={submitCargo}
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Posting..." : "Post Load →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}