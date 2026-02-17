/**
 * UserSection Component
 * Displays a grid of users with their contact info and roles.
 * @param {Object} props
 * @param {Array} props.users - List of user objects to display
 */
export default function UserSection({ users }) {
    return (
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
    );
}
