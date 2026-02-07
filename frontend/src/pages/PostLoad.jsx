import { useState } from "react";
import api from "../api/axios";

export default function PostLoad() {
  const [material, setMaterial] = useState("");
  const [capacity, setCapacity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const postLoad = async () => {
    try {
      await api.post("/load/post", {
        material,
        requiredCapacity: Number(capacity),
        from,
        to,
      });
      alert("Load Posted Successfully");
      setMaterial("");
      setCapacity("");
      setFrom("");
      setTo("");
    } catch (error) {
      console.error("Failed to post load:", error);
      alert("Failed to post load. Please check your inputs.");
    }
  };

  return (
    <div className="page centered">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 className="page-title">Post New Load</h2>
          <p className="page-subtitle">
            Enter cargo details to find matching trucks.
          </p>
        </div>
        <div className="form">
          <div className="form-row">
            <div className="stack">
              <label className="label">Material Name</label>
              <input
                className="input"
                placeholder="e.g. Steel Pipes"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>
            <div className="stack">
              <label className="label">Required Capacity (Tons)</label>
              <input
                className="input"
                placeholder="e.g. 10"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="stack">
              <label className="label">Origin City</label>
              <input
                className="input"
                placeholder="e.g. Delhi"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="stack">
              <label className="label">Destination City</label>
              <input
                className="input"
                placeholder="e.g. Mumbai"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
          <button onClick={postLoad} className="btn btn-primary">
            Submit Load
          </button>
        </div>
      </div>
    </div>
  );
}
