import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { HelmetProvider } from "react-helmet-async";
import Dashboard from "../pages/Dashboard";
import { AppContext } from "../context/AppContext";

// Mock AppContext
const MockAppProvider = ({ children }) => (
  <AppContext.Provider value={{ user: { name: "Test User" }, logout: vi.fn() }}>
    {children}
  </AppContext.Provider>
);

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          {
            _id: "booking1",
            status: "assigned",
            from: "Delhi",
            to: "Mumbai",
            load: { material: "Steel" },
          },
        ],
      })
    ),
  },
}));

vi.mock("../utils/storage", () => ({
  safeStorage: {
    get: vi.fn(() => "token"),
  },
}));

describe("Dashboard", () => {
  it("loads and renders bookings", async () => {
    render(
      <MockAppProvider>
        <HelmetProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </HelmetProvider>
      </MockAppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Steel/i)).toBeInTheDocument();
    });
  });
});
