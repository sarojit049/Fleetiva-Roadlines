import { useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios";

export default function PostLoad() {
  const [consignorName, setConsignorName] = useState("");
  const [consigneeName, setConsigneeName] = useState("");
  const [material, setMaterial] = useState("");
  const [capacity, setCapacity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const postLoad = async () => {
    try {
      await api.post("/load/post", {
        consignorName,
        consigneeName,
        material,
        requiredCapacity: Number(capacity),
        from,
        to,
      });
      alert("Load Posted Successfully");
      setConsignorName("");
      setConsigneeName("");
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
      <Helmet>
        <title>Post Load - Fleetiva Roadlines</title>
        <meta name="description" content="Post a new load requirement to find matching trucks." />
      </Helmet>
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
              <label className="label" htmlFor="consignor">Consignor Name</label>
              <input
                id="consignor"
                className="input"
                placeholder="e.g. ABC Steel Ltd"
                value={consignorName}
                onChange={(e) => setConsignorName(e.target.value)}
              />
            </div>
            <div className="stack">
              <label className="label" htmlFor="consignee">Consignee Name</label>
              <input
                id="consignee"
                className="input"
                placeholder="e.g. XYZ Infra Pvt Ltd"
                value={consigneeName}
                onChange={(e) => setConsigneeName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="stack">
              <label className="label" htmlFor="material">Material Name</label>
              <input
                id="material"
                className="input"
                placeholder="e.g. Steel Pipes"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>
            <div className="stack">
              <label className="label" htmlFor="capacity">Required Capacity (Tons)</label>
              <input
                id="capacity"
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
              <label className="label" htmlFor="from">Origin City</label>
              <input
                id="from"
                className="input"
                placeholder="e.g. Delhi"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="stack">
              <label className="label" htmlFor="to">Destination City</label>
              <input
                id="to"
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
