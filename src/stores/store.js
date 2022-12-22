import { createContext, useContext } from "react";
import WeatherStore from "./weatherStore";

export const store = {
  weatherStore: new WeatherStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext(StoreContext);
};
