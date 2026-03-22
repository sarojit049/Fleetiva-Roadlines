import { useState, useEffect } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button onClick={scrollToTop} style={styles.button}>
          ↑
        </button>
      )}
    </>
  );
}

const styles = {
  button: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    padding: "10px 15px",
    fontSize: "18px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#333",
    color: "#fff",
    zIndex: 1000,
  },
};