export default function Skeleton({ width, height, borderRadius = "8px", className = "" }) {
    return (
        <div
            className={`skeleton-shimmer ${className}`}
            style={{
                width: width || "100%",
                height: height || "20px",
                borderRadius,
            }}
        />
    );
}
