import Skeleton from "../Skeleton";

/**
 * LoadSection Component
 * Manages available loads, filtering, and truck matching.
 * @param {Object} props
 * @param {boolean} props.loading - Loading state for the section
 * @param {Array} props.filteredLoads - Loads matching the search/filter criteria
 * @param {string} props.searchTerm - Current search input
 * @param {Function} props.setSearchTerm - Handler for search input changes
 * @param {string} props.statusFilter - Current status filter value
 * @param {Function} props.setStatusFilter - Handler for status filter changes
 * @param {Function} props.findMatch - Handler to fetch matching trucks for a load
 * @param {Object} props.matchingTrucks - Dictionary of matched trucks by load ID
 * @param {Function} props.createBooking - Handler to create a booking for a load/truck pair
 */
export default function LoadSection({
    loading,
    filteredLoads,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    findMatch,
    matchingTrucks,
    createBooking
}) {
    return (
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
                <div className="stack">
                    {[1, 2].map(n => (
                        <div key={n} className="card">
                            <Skeleton width="40%" height="24px" />
                            <div style={{ marginTop: "12px" }}>
                                <Skeleton width="30%" height="16px" />
                            </div>
                        </div>
                    ))}
                </div>
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
    );
}
