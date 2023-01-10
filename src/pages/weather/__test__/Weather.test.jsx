/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { setupServer } from "msw/node";
import { rest } from "msw";

import Weather from "../Weather";
import { StoreContext, store } from "../../../stores/store";

const data = {
  coord: { lon: -74.0776, lat: 40.7282 },
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
  base: "stations",
  main: { temp: 42.67, feels_like: 34.95, temp_min: 39.07, temp_max: 45.14, pressure: 1013, humidity: 49 },
  visibility: 10000,
  wind: { speed: 16.11, deg: 280 },
  clouds: { all: 0 },
  dt: 1673299664,
  sys: { type: 2, id: 2008776, country: "US", sunrise: 1673266801, sunset: 1673300774 },
  timezone: -18000,
  id: 5099836,
  name: "Jersey City",
  cod: 200,
};

let counter = 0;

let query;

const server = setupServer(
  rest.get("https://api.openweathermap.org/data/2.5/weather", (req, res, ctx) => {
    counter += 1;

    query = req.url.searchParams.get("q");

    return res(ctx.status(200), ctx.json(data));
  })
);

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const setup = () => {
  render(
    <StoreContext.Provider value={store}>
      <Weather />
    </StoreContext.Provider>
  );
};

describe("The <Weather /> component", () => {
  describe("layout", () => {
    it("should render without any errors", () => {
      setup();

      const { asFragment } = render(<Weather />);
      expect(asFragment()).toMatchSnapshot();
    });

    it("should display a Sub Heading", () => {
      setup();

      const headingEl = screen.getByRole("heading", { name: /find your current weather forecast/i });
      expect(headingEl).toBeInTheDocument();
    });

    it("should have the Input initially empty", () => {
      setup();

      const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });
      expect(searchInputEl.value).toBe("");
    });

    it("should display a Button", () => {
      setup();

      const buttonEl = screen.getByRole("button", { name: /get forecast/i });
      expect(buttonEl).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("displays loader after api call", async () => {
      setup();

      const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });

      userEvent.type(searchInputEl, "jersey city");

      const buttonEl = screen.getByRole("button", { name: /get forecast/i });
      userEvent.click(buttonEl);

      expect(await screen.findByRole("status")).toBeInTheDocument();

      await screen.findByText(data.name);
    });

    it("sets user geo coords on mount", async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementationOnce(success =>
          Promise.resolve(
            success({
              coords: {
                latitude: 40.7215682,
                longitude: -74.047455,
              },
            })
          )
        ),
      };

      global.navigator.geolocation = mockGeolocation;

      setup();

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(2);

      await screen.findByRole("status");

      expect(await screen.findByRole("heading", { name: /your city/i })).toBeInTheDocument();
    });

    it("makes an api call with user input value on button submit", async () => {
      setup();

      const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });

      userEvent.type(searchInputEl, "jersey city");

      const buttonEl = screen.getByRole("button", { name: /get forecast/i });
      userEvent.click(buttonEl);

      await screen.findByRole("status");

      expect(await screen.findByText(data.name)).toBeInTheDocument();
      expect(counter).toBe(1);
    });

    it("displays search history after api call", async () => {
      setup();

      const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });

      userEvent.type(searchInputEl, "jersey city");

      const buttonEl = screen.getByRole("button", { name: /get forecast/i });
      userEvent.click(buttonEl);

      expect(await screen.findByRole("heading", { name: /search history/i })).toBeInTheDocument();
    });

    it("displays an error message on api call fail", async () => {
      server.use(
        rest.get("https://api.openweathermap.org/data/2.5/weather", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );

      setup();

      const searchInputEl = screen.getByRole("textbox", { name: /enter your city/i });

      userEvent.type(searchInputEl, "jersey city");

      const buttonEl = screen.getByRole("button", { name: /get forecast/i });
      userEvent.click(buttonEl);

      await screen.findByRole("status");

      expect(await screen.findByRole("article")).toBeInTheDocument();
    });
  });
});
