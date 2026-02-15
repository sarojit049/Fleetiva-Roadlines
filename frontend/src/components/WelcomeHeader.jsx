export default function WelcomeHeader({ name, subtitle, children }) {
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    return (
        <div className="welcome-header">
            <div className="welcome-header-bg" />
            <div className="welcome-header-content">
                <div className="welcome-text">
                    <h1 className="welcome-greeting">
                        {greeting}, <span className="welcome-name">{name || "there"}</span> 👋
                    </h1>
                    {subtitle && <p className="welcome-subtitle">{subtitle}</p>}
                </div>
                {children && <div className="welcome-actions">{children}</div>}
            </div>
        </div>
    );
}
