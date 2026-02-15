import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export default function MyTrucks() {
    const navigate = useNavigate();
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/truck/driver")
            .then((res) => setTrucks(Array.isArray(res.data) ? res.data : []))
            .catch(() => setTrucks([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="page">
                <div className="page-content">
                    <h1 className="page-title">My Trucks</h1>
                    <p>Loading your trucks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">My Trucks</h1>
                        <p className="page-subtitle">
                            Manage your fleet availability.
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/post-truck")}
                    >
                        Post New Truck
                    </button>
                </div>

                {trucks.length === 0 ? (
                    <div className="card">
                        <p>No trucks posted yet.</p>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: "1rem" }}
                            onClick={() => navigate("/post-truck")}
                        >
                            Post a Truck
                        </button>
                    </div>
                ) : (
                    <div className="card-grid cols-2">
                        {trucks.map((truck) => (
                            <div key={truck._id} className="card">
                                <div className="page-header">
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600 }}>
                                            {truck.vehicleNumber}
                                        </p>
                                        <p className="text-muted" style={{ margin: "4px 0 0" }}>
                                            {truck.vehicleType} • {truck.capacity} Tons
                                        </p>
                                    </div>
                                    <span
                                        className={`tag ${truck.isAvailable ? "success" : "warning"
                                            }`}
                                    >
                                        {truck.isAvailable ? "Available" : "Assigned"}
                                    </span>
                                </div>
                                <div style={{ marginTop: "1rem" }}>
                                    <p className="text-muted">
                                        Location: {truck.currentLocation}
                                    </p>
                                    <p className="text-muted">
                                        Posted: {formatDate(truck.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
