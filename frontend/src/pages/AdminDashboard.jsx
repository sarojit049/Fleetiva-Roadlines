import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { downloadFile } from "../utils/download";
import UserSection from "../components/admin/UserSection";
import LoadSection from "../components/admin/LoadSection";
import BookingSection from "../components/admin/BookingSection";
import BiltySection from "../components/admin/BiltySection";

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
      toast.error("Error finding matches");
    }
  };

  const createBooking = async (loadId, truckId) => {
    try {
      await api.post("/booking/create", { loadId, truckId });
      toast.success("Booking Created Successfully!");
      fetchData();
      setMatchingTrucks((prev) => {
        const next = { ...prev };
        delete next[loadId];
        return next;
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Error creating booking");
    }
  };

  const recordPayment = async (bookingId, status) => {
    try {
      await api.post(`/booking/${bookingId}/payment`, { status });
      toast.success(
        status === "paid"
          ? "Payment Recorded Successfully!"
          : "Payment status reset to pending."
      );
      fetchData();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Error recording payment");
    }
  };

  const createBilty = async (event) => {
    event.preventDefault();
    try {
      await api.post("/bilty", newBilty);
      toast.success("Bilty Created Successfully!");
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
      toast.error("Error creating bilty");
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
      toast.success("Bilty Updated Successfully!");
      setEditingBiltyId(null);
      fetchData();
    } catch (error) {
      console.error("Error updating bilty:", error);
      toast.error("Error updating bilty");
    }
  };

  const deleteBilty = async (biltyId) => {
    if (!window.confirm("Delete this bilty record?")) return;
    try {
      await api.delete(`/bilty/${biltyId}`);
      toast.success("Bilty Deleted Successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting bilty:", error);
      toast.error("Error deleting bilty");
    }
  };

  const cancelEditBilty = () => {
    setEditingBiltyId(null);
  };

  const handleBiltyChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const downloadBilty = async (id) => {
    try {
      await downloadFile(`/booking/${id}/bilty`, `bilty-${id}.pdf`);
      toast.success("Bilty downloaded successfully");
    } catch {
      toast.error("Failed to download Bilty");
    }
  };

  const downloadInvoice = async (id) => {
    try {
      await downloadFile(`/booking/${id}/invoice`, `invoice-${id}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch {
      toast.error("Failed to download Invoice");
    }
  };

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

        <div className="stack">
          <UserSection users={users} />

          <LoadSection
            loading={loading}
            filteredLoads={filteredLoads}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            findMatch={findMatch}
            matchingTrucks={matchingTrucks}
            createBooking={createBooking}
          />

          <BookingSection
            bookings={bookings}
            downloadBilty={downloadBilty}
            downloadInvoice={downloadInvoice}
            recordPayment={recordPayment}
          />

          <BiltySection
            bilties={bilties}
            newBilty={newBilty}
            setNewBilty={setNewBilty}
            handleBiltyChange={handleBiltyChange}
            createBilty={createBilty}
            editingBiltyId={editingBiltyId}
            biltyForm={biltyForm}
            setBiltyForm={setBiltyForm}
            startEditBilty={startEditBilty}
            updateBilty={updateBilty}
            deleteBilty={deleteBilty}
            cancelEditBilty={cancelEditBilty}
          />
        </div>
      </div>
    </div>
  );
}
