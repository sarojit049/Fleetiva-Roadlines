import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";

describe("LandingPage", () => {
  it("renders hero content", () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getAllByText(/Fleetiva Roadlines/i)[0]).toBeInTheDocument();
    expect(
      screen.getByText(/Move freight faster/i)
    ).toBeInTheDocument();
  });
});
