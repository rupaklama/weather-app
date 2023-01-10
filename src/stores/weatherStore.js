/* eslint-disable prettier/prettier */
import { makeAutoObservable, runInAction } from "mobx";

export default class WeatherStore {
  weather = null;

  initialLoading = false;

  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchWeather = async query => {
    this.initialLoading = true;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=dd9dbc16899659de44ea30ebc32456a9&units=imperial`
      );

      const data = await response.json();

      if (response.status === 200) {
        runInAction(() => {
          this.weather = data;
          this.initialLoading = false;
        });
      }

      if (response.status !== 200) {
        runInAction(() => {
          this.initialLoading = false;
          this.error = data;
        });

        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      }
    } catch (err) {
      console.log(err);

      runInAction(() => {
        this.initialLoading = false;
        this.error = err;
      });
    }
  };
}
