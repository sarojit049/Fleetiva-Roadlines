import { useState } from "react";
import api from "../api/axios";

export default function PostTruck() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  const postTruck = async () => {
    try {
      await api.post("/truck/post", {
        vehicleNumber,
        capacity: Number(capacity),
        vehicleType,
        currentLocation,
      });
      alert("Truck Posted Successfully");
      setVehicleNumber("");
      setCapacity("");
      setVehicleType("");
      setCurrentLocation("");
    } catch (error) {
      console.error("Failed to post truck:", error);
      alert("Failed to post truck.");
    }
  };

  return (
    <div className="page centered">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 className="page-title">Post Available Truck</h2>
          <p className="page-subtitle">
            List your vehicle to receive load assignments.
          </p>
        </div>
        <div className="form">
          <div className="form-row">
            <div className="stack">
              <label className="label">Vehicle Number</label>
              <input
                className="input"
                placeholder="e.g. MH12AB1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
            </div>
            <div className="stack">
              <label className="label">Capacity (Tons)</label>
              <input
                className="input"
                placeholder="e.g. 12"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="stack">
              <label className="label">Vehicle Type</label>
              <input
                className="input"
                placeholder="e.g. 10-Wheeler"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
            </div>
            <div className="stack">
              <label className="label">Current Location</label>
              <input
                className="input"
                placeholder="e.g. Pune"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
              />
            </div>
          </div>
          <button onClick={postTruck} className="btn btn-primary">
            Post Truck Availability
          </button>
        </div>
      </div>
    </div>
  );
}
