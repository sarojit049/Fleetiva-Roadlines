/**
 * BookingSection Component
 * Lists active bookings and provides actions for documents and payments.
 * @param {Object} props
 * @param {Array} props.bookings - List of active booking objects
 * @param {Function} props.downloadBilty - Handler to download the Bilty PDF
 * @param {Function} props.downloadInvoice - Handler to download the Invoice PDF
 * @param {Function} props.recordPayment - Handler to toggle payment status
 */
export default function BookingSection({ bookings, downloadBilty, downloadInvoice, recordPayment }) {
    return (
        <section className="stack">
            <h3 className="section-title">Active Bookings</h3>
            {bookings.length === 0 ? (
                <div className="card">
                    <p className="text-muted">No active bookings yet.</p>
                </div>
            ) : (
                bookings.map((b) => (
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
                            {b.paymentStatus !== "paid" ? (
                                <button
                                    className="btn btn-outline"
                                    onClick={() => recordPayment(b._id, "paid")}
                                >
                                    Mark Paid
                                </button>
                            ) : (
                                <button
                                    className="btn btn-outline"
                                    onClick={() => recordPayment(b._id, "pending")}
                                >
                                    Mark Unpaid
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </section>
    );
}
