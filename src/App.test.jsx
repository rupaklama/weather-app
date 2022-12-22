/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";

import { axe } from "jest-axe";

import App from "./App";

describe("The <Weather /> component", () => {
  it("should display a header", () => {
    render(<App />);
    const headingEl = screen.getByText("Weather Buddy");

    expect(headingEl).toBeInTheDocument();

    screen.debug();
  });

  it("should display a footer", () => {
    render(<App />);
    const footerEl = screen.getByText(/developed by Rupak Lama/i);

    expect(footerEl).toBeInTheDocument();
  });

  it("should not fail any accessibility tests", async () => {
    const { container } = render(<App />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
