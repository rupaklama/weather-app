/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Weather from "../Weather";
import { StoreContext, store } from "../../../stores/store";

describe("The <Weather /> component", () => {
  beforeEach(() => {
    render(
      <StoreContext.Provider value={store}>
        <Weather />
      </StoreContext.Provider>
    );
  });

  it("should render without any errors", () => {
    const { asFragment } = render(<Weather />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should display a Sub Heading", () => {
    const headingEl = screen.getByRole("heading", { name: /find your current weather forecast/i });
    expect(headingEl).toBeInTheDocument();

    screen.debug();
  });

  it("should display the Input initially empty", () => {
    const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });
    expect(searchInputEl.value).toBe("");
  });

  it("should be able to type in the Input", () => {
    const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });
    userEvent.type(searchInputEl, "your city");
    expect(searchInputEl.value).toBe("your city");
  });

  it("should display a Button", () => {
    const buttonEl = screen.getByRole("button", { name: /get forecast/i });
    expect(buttonEl).toBeInTheDocument();
  });

  it("should able to submit the Input value on Button click and displays the data", async () => {
    const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });
    userEvent.type(searchInputEl, "vegas");

    const buttonEl = screen.getByRole("button", { name: /get forecast/i });
    userEvent.click(buttonEl);

    expect(await screen.findByRole("article")).toBeInTheDocument();
  });
});
