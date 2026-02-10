import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import api from "../api/axios";
import { safeStorage } from "../utils/storage";

export default function OAuth() {
  const navigate = useNavigate();
  const authUnavailable = !auth || !googleProvider;

  const handleGoogleClick = async () => {
    if (authUnavailable) {
      console.warn("Firebase authentication is not configured.");
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await api.post("/auth/google", { idToken });

      safeStorage.set("accessToken", res.data.accessToken);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      style={styles.button}
      disabled={authUnavailable}
    >
      Continue with Google
    </button>
  );
}

const styles = {
  button: {
    marginTop: 10,
    padding: 12,
    background: "#fff",
    border: "1px solid #d1d5db",
    cursor: "pointer",
  },
};
