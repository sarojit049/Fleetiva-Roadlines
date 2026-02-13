const PageContainer = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
