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

    expect(screen.getByText(/Fleetiva Roadlines/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Smart freight matching/i)
    ).toBeInTheDocument();
  });
});
