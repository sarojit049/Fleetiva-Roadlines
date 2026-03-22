import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { AppContext } from "../context/AppContext";

vi.mock("../api/axios");
vi.mock("react-hot-toast", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const MockAppProvider = ({ children }) => (
    <AppContext.Provider value={{ user: { name: "Admin Test", role: "superadmin" }, logout: vi.fn() }}>
        {children}
    </AppContext.Provider>
);

const renderWithProviders = (ui) => {
    return render(
        <MockAppProvider>
            <MemoryRouter>
                <HelmetProvider>
                    {ui}
                </HelmetProvider>
            </MemoryRouter>
        </MockAppProvider>
    );
};

describe("SuperAdminDashboard", () => {
    const mockTenants = [
        { _id: "1", name: "Company A", isActive: true, plan: "pro" },
        { _id: "2", name: "Company B", isActive: false, plan: "basic" },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        api.get.mockResolvedValue({ data: mockTenants });
    });

    it("renders tenants correctly", async () => {
        renderWithProviders(<SuperAdminDashboard />);

        // Updated for new layout content
        expect(screen.getByText(/Oversee tenant subscriptions/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Company A")).toBeInTheDocument();
            expect(screen.getByText("Company B")).toBeInTheDocument();
        });
    });

    it("toggles tenant status on button click", async () => {
        api.patch.mockResolvedValueOnce({});

        renderWithProviders(<SuperAdminDashboard />);

        const deactivateBtn = await screen.findByText("Deactivate");
        fireEvent.click(deactivateBtn);

        await waitFor(() => {
            expect(api.patch).toHaveBeenCalledWith("/tenants/1/status", { isActive: false });
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Status updated successfully");
        });
    });

    it("shows toast error on toggle failure", async () => {
        api.patch.mockRejectedValueOnce(new Error("Update failed"));

        renderWithProviders(<SuperAdminDashboard />);

        const deactivateBtn = await screen.findByText("Deactivate");
        fireEvent.click(deactivateBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error updating tenant status");
        });
    });

    it("filters tenants by search query", async () => {
        renderWithProviders(<SuperAdminDashboard />);

        await waitFor(() => screen.getByText("Company A"));

        const searchInput = screen.getByPlaceholderText(/Search companies.../i);
        fireEvent.change(searchInput, { target: { value: "Company A" } });

        await waitFor(() => {
            expect(screen.getByText("Company A")).toBeInTheDocument();
            expect(screen.queryByText("Company B")).not.toBeInTheDocument();
        });
    });

    it("filters tenants by status", async () => {
        renderWithProviders(<SuperAdminDashboard />);

        await waitFor(() => screen.getByText("Company A"));

        const statusSelect = screen.getByRole("combobox");

        // Filter by Active
        fireEvent.change(statusSelect, { target: { value: "active" } });
        await waitFor(() => {
            expect(screen.getByText("Company A")).toBeInTheDocument();
            expect(screen.queryByText("Company B")).not.toBeInTheDocument();
        });

        // Filter by Inactive
        fireEvent.change(statusSelect, { target: { value: "inactive" } });
        await waitFor(() => {
            expect(screen.queryByText("Company A")).not.toBeInTheDocument();
            expect(screen.getByText("Company B")).toBeInTheDocument();
        });
    });
});
