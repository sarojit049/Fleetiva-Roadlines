export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {["Bookings", "Revenue", "Users"].map((item) => (
          <div key={item} className="p-4 border rounded shadow">
            <h3 className="font-semibold">{item}</h3>
            <p className="text-2xl mt-2">123</p>
          </div>
        ))}
      </div>
    </div>
  );
}
