import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Dashboard from "../pages/Dashboard";

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
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading bookings/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Steel/i)).toBeInTheDocument();
    });
  });
});
