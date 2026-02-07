import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState("all");

  useEffect(() => {
    api
      .get("/logs")
      .then((res) => setLogs(res.data))
      .catch((error) => console.error("Log fetch error:", error))
      .finally(() => setLoading(false));
  }, []);

  const clearLogs = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all system logs? This action cannot be undone."
      )
    )
      return;

    try {
      await api.delete("/logs");
      setLogs([]);
      alert("Logs cleared successfully");
    } catch (error) {
      console.error("Failed to clear logs:", error);
      alert("Failed to clear logs");
    }
  };

  const uniqueTenants = Array.from(
    new Set(logs.map((log) => log.tenant?._id).filter(Boolean))
  ).map((id) => logs.find((log) => log.tenant?._id === id).tenant);

  const filteredLogs = logs.filter((log) => {
    if (selectedTenant === "all") return true;
    return log.tenant?._id === selectedTenant;
  });

  const downloadLogs = () => {
    if (filteredLogs.length === 0) return;

    const headers = [
      "Timestamp",
      "Method",
      "Status",
      "URL",
      "Message",
      "Tenant",
      "User"
    ];
    const csvRows = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          new Date(log.createdAt).toLocaleString(),
          log.method,
          log.statusCode,
          log.url,
          `"${log.message.replace(/"/g, '""')}"`,
          log.tenant?.name || "N/A",
          log.user?.name || "Guest"
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `system_logs_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page">
      <div className="page-content">
        <div className="page-header">
          <div>
            <h2 className="page-title">System Error Logs</h2>
            <p className="page-subtitle">
              Monitoring the last 100 API errors across all tenants.
            </p>
          </div>
          <div className="toolbar">
            {filteredLogs.length > 0 && (
              <button className="btn btn-secondary" onClick={downloadLogs}>
                Download Logs (CSV)
              </button>
            )}
            {logs.length > 0 && (
              <button className="btn btn-danger" onClick={clearLogs}>
                Clear All Logs
              </button>
            )}
          </div>
        </div>

        <div className="toolbar">
          <select
            className="select"
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
          >
            <option value="all">All Tenants</option>
            {uniqueTenants.map((tenant) => (
              <option key={tenant._id} value={tenant._id}>
                {tenant.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-muted">Loading logs...</p>
        ) : (
          <div className="stack">
            {filteredLogs.length === 0 ? (
              <div className="card">
                <p style={{ margin: 0, fontWeight: 600 }}>
                  No errors found for the selected criteria.
                </p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log._id} className="card">
                  <div className="page-header">
                    <span
                      className={`tag ${
                        log.statusCode >= 500 ? "danger" : "warning"
                      }`}
                    >
                      {log.method} {log.statusCode}
                    </span>
                    <span className="text-muted">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ margin: "12px 0 4px", fontWeight: 600 }}>
                    Path: {log.url}
                  </p>
                  <p className="text-muted" style={{ margin: "0 0 8px" }}>
                    Error: {log.message}
                  </p>
                  <div className="toolbar" style={{ fontSize: 13 }}>
                    <span>Tenant: {log.tenant?.name || "N/A"}</span>
                    <span>User: {log.user?.name || "Guest"}</span>
                  </div>
                  {log.stack && (
                    <details style={{ marginTop: 12 }}>
                      <summary style={{ cursor: "pointer", color: "#1d4ed8" }}>
                        View Stack Trace
                      </summary>
                      <pre
                        style={{
                          marginTop: 8,
                          background: "#f1f5f9",
                          padding: 12,
                          borderRadius: 8,
                          overflowX: "auto",
                          fontSize: 12
                        }}
                      >
                        {log.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
