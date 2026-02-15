export default function StatCard({ icon, label, value, accent = "#6366f1", trend }) {
    return (
        <div className="stat-card" style={{ "--stat-accent": accent }}>
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-body">
                <span className="stat-card-label">{label}</span>
                <span className="stat-card-value">{value}</span>
                {trend && (
                    <span className={`stat-card-trend ${trend > 0 ? "up" : "down"}`}>
                        {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
    );
}
