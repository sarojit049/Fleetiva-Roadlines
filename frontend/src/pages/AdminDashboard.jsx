import { useEffect, useState } from "react";
import api from "../api/axios";
import { getApiBaseUrl } from "../api/baseUrl";

export default function AdminDashboard() {
  const [loads, setLoads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [matchingTrucks, setMatchingTrucks] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loadsRes, bookingsRes, usersRes] = await Promise.all([
        api.get("/load/available"),
        api.get("/booking/all"),
        api.get("/users")
      ]);
      setLoads(loadsRes.data);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const findMatch = async (loadId) => {
    try {
      const res = await api.get(`/match/${loadId}`);
      setMatchingTrucks((prev) => ({ ...prev, [loadId]: res.data }));
    } catch (error) {
      console.error("Error finding matches:", error);
      alert("Error finding matches");
    }
  };

  const createBooking = async (loadId, truckId) => {
    try {
      await api.post("/booking/create", { loadId, truckId });
      alert("Booking Created Successfully!");
      fetchData();
      setMatchingTrucks((prev) => {
        const next = { ...prev };
        delete next[loadId];
        return next;
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Error creating booking");
    }
  };

  const recordPayment = async (bookingId) => {
    try {
      await api.post(`/booking/${bookingId}/payment`, { status: "paid" });
      alert("Payment Recorded Successfully!");
      fetchData();
    } catch (error) {
      console.error("Error recording payment:", error);
      alert("Error recording payment");
    }
  };

  const API_BASE = getApiBaseUrl();

  const downloadBilty = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/bilty?token=${localStorage.getItem("accessToken")}`,
      "_blank"
    );
  const downloadInvoice = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/invoice?token=${localStorage.getItem("accessToken")}`,
      "_blank"
    );

  const filteredLoads = loads.filter((load) => {
    const matchesSearch =
      load.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.to.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || load.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page">
      <div className="page-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">Admin Dashboard</h2>
            <p className="page-subtitle">
              Monitor users, match loads, and track active bookings in real time.
            </p>
          </div>
        </div>

        <section className="stack">
          <h3 className="section-title">User Management</h3>
          <div className="card-grid cols-3">
            {users.map((user) => (
              <div key={user._id} className="card">
                <p style={{ margin: 0, fontWeight: 600 }}>{user.name}</p>
                <p className="text-muted" style={{ margin: "6px 0 12px" }}>
                  {user.phone}
                </p>
                <span
                  className={`tag ${user.role === "driver" ? "success" : "info"}`}
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="stack">
          <h3 className="section-title">Available Loads</h3>
          <div className="toolbar">
            <input
              type="text"
              placeholder="Search material or location..."
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="matched">Matched</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            filteredLoads.map((load) => (
              <div key={load._id} className="card">
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {load.material} ({load.requiredCapacity}T)
                </p>
                <p className="text-muted" style={{ margin: "6px 0 16px" }}>
                  {load.from} → {load.to}
                </p>
                <button className="btn btn-primary" onClick={() => findMatch(load._id)}>
                  Find Matching Trucks
                </button>
                {matchingTrucks[load._id]?.map((truck) => (
                  <div key={truck._id} className="card" style={{ marginTop: 12 }}>
                    <div className="page-header">
                      <div>
                        <p style={{ margin: 0, fontWeight: 600 }}>
                          {truck.vehicleNumber}
                        </p>
                        <p className="text-muted" style={{ margin: "4px 0 0" }}>
                          Capacity: {truck.capacity}T
                        </p>
                      </div>
                      <button
                        className="btn btn-success"
                        onClick={() => createBooking(load._id, truck._id)}
                      >
                        Assign Truck
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </section>

        <section className="stack">
          <h3 className="section-title">Active Bookings</h3>
          {bookings.map((b) => (
            <div key={b._id} className="card">
              <div className="page-header">
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    Booking #{b._id.slice(-6)}
                  </p>
                  <p className="text-muted" style={{ margin: "6px 0 0" }}>
                    Status: {b.status} • Payment: {b.paymentStatus}
                  </p>
                </div>
                <span
                  className={`tag ${
                    b.status === "delivered"
                      ? "success"
                      : b.status === "matched"
                      ? "info"
                      : "warning"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <div className="toolbar" style={{ marginTop: 16 }}>
                <button className="btn btn-secondary" onClick={() => downloadBilty(b._id)}>
                  Download Bilty
                </button>
                <button className="btn btn-secondary" onClick={() => downloadInvoice(b._id)}>
                  Download Invoice
                </button>
                {b.paymentStatus !== "paid" && (
                  <button className="btn btn-outline" onClick={() => recordPayment(b._id)}>
                    Record Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
