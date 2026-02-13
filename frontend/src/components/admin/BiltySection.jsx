/**
 * BiltySection Component
 * Handles the creation, viewing, and editing of Bilty records.
 * @param {Object} props
 * @param {Array} props.bilties - List of all Bilty records
 * @param {Object} props.newBilty - State for the "Create Bilty" form
 * @param {Function} props.setNewBilty - Setter for the creation form state
 * @param {Function} props.handleBiltyChange - Curried handler for form input changes
 * @param {Function} props.createBilty - Handler to submit a new Bilty
 * @param {string} props.editingBiltyId - ID of the Bilty currently being edited
 * @param {Object} props.biltyForm - State for the edit form
 * @param {Function} props.setBiltyForm - Setter for the edit form state
 * @param {Function} props.startEditBilty - Handler to populate and show the edit form
 * @param {Function} props.updateBilty - Handler to submit Bilty updates
 * @param {Function} props.deleteBilty - Handler to remove a Bilty record
 * @param {Function} props.cancelEditBilty - Handler to close the edit form
 */
export default function BiltySection({
    bilties,
    newBilty,
    setNewBilty,
    handleBiltyChange,
    createBilty,
    editingBiltyId,
    biltyForm,
    setBiltyForm,
    startEditBilty,
    updateBilty,
    deleteBilty,
    cancelEditBilty
}) {
    return (
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
    );
}
