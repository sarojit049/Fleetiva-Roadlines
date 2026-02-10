import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "../pages/Login";
import { AppContext } from "../context/appContextStore";

vi.mock("../api/axios", () => ({
  default: {
    post: vi.fn(() =>
      Promise.resolve({
        data: {
          accessToken: "token",
          user: { role: "customer", email: "user@example.com" },
        },
      })
    ),
  },
}));

vi.mock("../utils/storage", () => ({
  safeStorage: {
    set: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock("../firebase", () => ({
  auth: null,
  googleProvider: null,
  hasFirebaseConfig: false,
}));

describe("Login", () => {
  it("submits login credentials", async () => {
    const user = userEvent.setup();
    const setLoading = vi.fn();
    const setUser = vi.fn();

    render(
      <MemoryRouter>
        <AppContext.Provider value={{ loading: false, setLoading, setUser }}>
          <Login />
        </AppContext.Provider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/Email Address/i), "user@example.com");
    await user.type(screen.getByLabelText(/Password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(setUser).toHaveBeenCalledWith(
      expect.objectContaining({ email: "user@example.com" })
    );
  });
});
