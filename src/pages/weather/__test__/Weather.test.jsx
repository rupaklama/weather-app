/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axe } from "jest-axe";

import Weather from "../Weather";

describe("The <Weather /> component", () => {
  it("should render without any errors", () => {
    const { asFragment } = render(<Weather />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should display a Sub Heading", () => {
    render(<Weather />);
    const headingEl = screen.getByRole("heading", { name: /find your current weather forecast/i });
    expect(headingEl).toBeInTheDocument();

    screen.debug();
  });

  it("should display the Input initially empty", () => {
    render(<Weather />);
    const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });
    expect(searchInputEl.value).toBe("");
  });

  it("should be able to type in the Input", () => {
    render(<Weather />);
    const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });
    userEvent.type(searchInputEl, "your city");
    expect(searchInputEl.value).toBe("your city");
  });

  it("should display a Button", () => {
    render(<Weather />);
    const buttonEl = screen.getByRole("button", { name: /get forecast/i });
    expect(buttonEl).toBeInTheDocument();
  });

  it("should able to submit the Input value on Button click and displays the data", async () => {
    render(<Weather />);

    const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });
    userEvent.type(searchInputEl, "vegas");

    const buttonEl = screen.getByRole("button", { name: /get forecast/i });
    userEvent.click(buttonEl);

    expect(await screen.findByRole("article")).toBeInTheDocument();
  });

  it("should not fail any accessibility tests", async () => {
    const { container } = render(<Weather />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
