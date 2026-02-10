import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios";
import { getApiBaseUrl } from "../api/baseUrl";
import { safeStorage } from "../utils/storage";

export default function AdminDashboard() {
  const [loads, setLoads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [bilties, setBilties] = useState([]);
  const [matchingTrucks, setMatchingTrucks] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingBiltyId, setEditingBiltyId] = useState(null);
  const [biltyForm, setBiltyForm] = useState({
    booking: "",
    lrNumber: "",
    consignorName: "",
    consigneeName: "",
    pickupLocation: "",
    dropLocation: "",
    materialType: "",
    weight: "",
    truckType: "",
    driverName: "",
    driverPhone: "",
    vehicleNumber: "",
    freightAmount: "",
    advancePaid: "",
    balanceAmount: "",
    paymentMode: "cash",
    shipmentStatus: "assigned"
  });
  const [newBilty, setNewBilty] = useState({
    booking: "",
    lrNumber: "",
    consignorName: "",
    consigneeName: "",
    pickupLocation: "",
    dropLocation: "",
    materialType: "",
    weight: "",
    truckType: "",
    driverName: "",
    driverPhone: "",
    vehicleNumber: "",
    freightAmount: "",
    advancePaid: "",
    balanceAmount: "",
    paymentMode: "cash",
    shipmentStatus: "assigned"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loadsRes, bookingsRes, usersRes, biltiesRes] = await Promise.all([
        api.get("/load/available"),
        api.get("/booking/all"),
        api.get("/users"),
        api.get("/bilty")
      ]);
      setLoads(loadsRes.data);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setBilties(biltiesRes.data);
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

  const createBilty = async (event) => {
    event.preventDefault();
    try {
      await api.post("/bilty", newBilty);
      alert("Bilty Created Successfully!");
      setNewBilty({
        booking: "",
        lrNumber: "",
        consignorName: "",
        consigneeName: "",
        pickupLocation: "",
        dropLocation: "",
        materialType: "",
        weight: "",
        truckType: "",
        driverName: "",
        driverPhone: "",
        vehicleNumber: "",
        freightAmount: "",
        advancePaid: "",
        balanceAmount: "",
        paymentMode: "cash",
        shipmentStatus: "assigned"
      });
      fetchData();
    } catch (error) {
      console.error("Error creating bilty:", error);
      alert("Error creating bilty");
    }
  };

  const startEditBilty = (bilty) => {
    setEditingBiltyId(bilty._id);
    setBiltyForm({
      booking: bilty.booking?._id || "",
      lrNumber: bilty.lrNumber || "",
      consignorName: bilty.consignorName || "",
      consigneeName: bilty.consigneeName || "",
      pickupLocation: bilty.pickupLocation || "",
      dropLocation: bilty.dropLocation || "",
      materialType: bilty.materialType || "",
      weight: bilty.weight || "",
      truckType: bilty.truckType || "",
      driverName: bilty.driverName || "",
      driverPhone: bilty.driverPhone || "",
      vehicleNumber: bilty.vehicleNumber || "",
      freightAmount: bilty.freightAmount || "",
      advancePaid: bilty.advancePaid || "",
      balanceAmount: bilty.balanceAmount || "",
      paymentMode: bilty.paymentMode || "cash",
      shipmentStatus: bilty.shipmentStatus || "assigned"
    });
  };

  const updateBilty = async (event) => {
    event.preventDefault();
    try {
      const { booking: _booking, ...payload } = biltyForm;

      await api.patch(`/bilty/${editingBiltyId}`, payload);
      alert("Bilty Updated Successfully!");
      setEditingBiltyId(null);
      fetchData();
    } catch (error) {
      console.error("Error updating bilty:", error);
      alert("Error updating bilty");
    }
  };

  const deleteBilty = async (biltyId) => {
    if (!window.confirm("Delete this bilty record?")) return;
    try {
      await api.delete(`/bilty/${biltyId}`);
      alert("Bilty Deleted Successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting bilty:", error);
      alert("Error deleting bilty");
    }
  };

  const cancelEditBilty = () => {
    setEditingBiltyId(null);
  };

  const handleBiltyChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const API_BASE = getApiBaseUrl();

  const downloadBilty = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/bilty?token=${safeStorage.get("accessToken")}`,
      "_blank"
    );
  const downloadInvoice = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/invoice?token=${safeStorage.get("accessToken")}`,
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
      <Helmet>
        <title>Admin Dashboard - Fleetiva Roadlines</title>
        <meta name="description" content="Administer users, match loads with trucks, and manage bookings." />
      </Helmet>
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
                  className={`tag ${b.status === "delivered"
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

        <section className="stack">
          <h3 className="section-title">Bilty Management</h3>
          <div className="card">
            <form className="stack" onSubmit={createBilty}>
              <div className="toolbar">
                <input
                  className="input"
                  name="booking"
                  placeholder="Booking ID"
                  value={newBilty.booking}
                  onChange={handleBiltyChange(setNewBilty)}
                />
                <input
                  className="input"
                  name="lrNumber"
                  placeholder="LR Number (optional)"
                  value={newBilty.lrNumber}
                  onChange={handleBiltyChange(setNewBilty)}
                />
              </div>
              <div className="toolbar">
                <input
                  className="input"
                  name="consignorName"
                  placeholder="Consignor Name"
                  value={newBilty.consignorName}
                  onChange={handleBiltyChange(setNewBilty)}
                />
                <input
                  className="input"
                  name="consigneeName"
                  placeholder="Consignee Name"
                  value={newBilty.consigneeName}
                  onChange={handleBiltyChange(setNewBilty)}
                />
              </div>
              <div className="toolbar">
                <input
                  className="input"
                  name="pickupLocation"
                  placeholder="Pickup Location"
                  value={newBilty.pickupLocation}
                  onChange={handleBiltyChange(setNewBilty)}
                />
                <input
                  className="input"
                  name="dropLocation"
                  placeholder="Drop Location"
                  value={newBilty.dropLocation}
                  onChange={handleBiltyChange(setNewBilty)}
                />
              </div>
              <div className="toolbar">
                <input
                  className="input"
                  name="materialType"
                  placeholder="Material Type"
                  value={newBilty.materialType}
                  onChange={handleBiltyChange(setNewBilty)}
                />
                <input
                  className="input"
                  name="weight"
                  type="number"
                  placeholder="Weight (T)"
                  value={newBilty.weight}
                  onChange={handleBiltyChange(setNewBilty)}
                />
              </div>
              <div className="toolbar">
                <input
                  className="input"
                  name="truckType"
                  placeholder="Truck Type"
                  value={newBilty.truckType}
                  onChange={handleBiltyChange(setNewBilty)}
                />
                <input
                  className="input"
                  name="vehicleNumber"
                  placeholder="Vehicle Number"
                  value={newBilty.vehicleNumber}
                  onChange={handleBiltyChange(setNewBilty)}
                />
              </div>
              <div className="toolbar">
                <input
                  className="input"
                  name="driverName"
                  placeholder="Driver Name"
                  value={newBilty.driverName}
                  onChange={handleBiltyChange(setNewBilty)}
                />
                <input
                  className="input"
                  name="driverPhone"
                  placeholder="Driver Phone"
                  value={newBilty.driverPhone}
                  onChange={handleBiltyChange(setNewBilty)}
                />
              </div>
              <div className="toolbar">
                <input
                  className="input"
                  name="freightAmount"
                  type="number"
                  placeholder="Freight Amount"
                  value={newBilty.freightAmount}
                  onChange={handleBiltyChange(setNewBilty)}
                />
                <input
                  className="input"
                  name="advancePaid"
                  type="number"
                  placeholder="Advance Paid"
                  value={newBilty.advancePaid}
                  onChange={handleBiltyChange(setNewBilty)}
                />
                <input
                  className="input"
                  name="balanceAmount"
                  type="number"
                  placeholder="Balance Amount"
                  value={newBilty.balanceAmount}
                  onChange={handleBiltyChange(setNewBilty)}
                />
              </div>
              <div className="toolbar">
                <select
                  className="select"
                  name="paymentMode"
                  value={newBilty.paymentMode}
                  onChange={handleBiltyChange(setNewBilty)}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
                <select
                  className="select"
                  name="shipmentStatus"
                  value={newBilty.shipmentStatus}
                  onChange={handleBiltyChange(setNewBilty)}
                >
                  <option value="assigned">Assigned</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button className="btn btn-primary" type="submit">
                  Create Bilty
                </button>
              </div>
            </form>
          </div>

          {bilties.map((bilty) => (
            <div key={bilty._id} className="card">
              <div className="page-header">
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    Bilty {bilty.lrNumber}
                  </p>
                  <p className="text-muted" style={{ margin: "6px 0 0" }}>
                    Booking #{bilty.booking?._id?.slice(-6)} • Status: {bilty.shipmentStatus}
                  </p>
                </div>
                <div className="toolbar">
                  <button
                    className="btn btn-secondary"
                    onClick={() => startEditBilty(bilty)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => deleteBilty(bilty._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editingBiltyId === bilty._id && (
                <form className="stack" onSubmit={updateBilty} style={{ marginTop: 16 }}>
                  <div className="toolbar">
                    <input
                      className="input"
                      name="lrNumber"
                      placeholder="LR Number"
                      value={biltyForm.lrNumber}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                    <input
                      className="input"
                      name="consignorName"
                      placeholder="Consignor Name"
                      value={biltyForm.consignorName}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                    <input
                      className="input"
                      name="consigneeName"
                      placeholder="Consignee Name"
                      value={biltyForm.consigneeName}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                  </div>
                  <div className="toolbar">
                    <input
                      className="input"
                      name="pickupLocation"
                      placeholder="Pickup Location"
                      value={biltyForm.pickupLocation}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                    <input
                      className="input"
                      name="dropLocation"
                      placeholder="Drop Location"
                      value={biltyForm.dropLocation}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                    <input
                      className="input"
                      name="materialType"
                      placeholder="Material Type"
                      value={biltyForm.materialType}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                  </div>
                  <div className="toolbar">
                    <input
                      className="input"
                      name="weight"
                      type="number"
                      placeholder="Weight (T)"
                      value={biltyForm.weight}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                    <input
                      className="input"
                      name="truckType"
                      placeholder="Truck Type"
                      value={biltyForm.truckType}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                    <input
                      className="input"
                      name="vehicleNumber"
                      placeholder="Vehicle Number"
                      value={biltyForm.vehicleNumber}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                  </div>
                  <div className="toolbar">
                    <input
                      className="input"
                      name="driverName"
                      placeholder="Driver Name"
                      value={biltyForm.driverName}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                    <input
                      className="input"
                      name="driverPhone"
                      placeholder="Driver Phone"
                      value={biltyForm.driverPhone}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                  </div>
                  <div className="toolbar">
                    <input
                      className="input"
                      name="freightAmount"
                      type="number"
                      placeholder="Freight Amount"
                      value={biltyForm.freightAmount}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                    <input
                      className="input"
                      name="advancePaid"
                      type="number"
                      placeholder="Advance Paid"
                      value={biltyForm.advancePaid}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                    <input
                      className="input"
                      name="balanceAmount"
                      type="number"
                      placeholder="Balance Amount"
                      value={biltyForm.balanceAmount}
                      onChange={handleBiltyChange(setBiltyForm)}
                    />
                  </div>
                  <div className="toolbar">
                    <select
                      className="select"
                      name="paymentMode"
                      value={biltyForm.paymentMode}
                      onChange={handleBiltyChange(setBiltyForm)}
                    >
                      <option value="cash">Cash</option>
                      <option value="bank">Bank</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                    </select>
                    <select
                      className="select"
                      name="shipmentStatus"
                      value={biltyForm.shipmentStatus}
                      onChange={handleBiltyChange(setBiltyForm)}
                    >
                      <option value="assigned">Assigned</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button className="btn btn-primary" type="submit">
                      Save Changes
                    </button>
                    <button className="btn btn-outline" type="button" onClick={cancelEditBilty}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
