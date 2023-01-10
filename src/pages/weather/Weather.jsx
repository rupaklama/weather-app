/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
import { observer } from "mobx-react-lite";

import React, { useEffect, useState } from "react";
import RotateLoader from "react-spinners/RotateLoader";

import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import styles from "./Weather.module.css";

import { useStore } from "../../stores/store";

const override = {
  display: "block",
  margin: "0 auto",
};

const Weather = observer(() => {
  const { weatherStore } = useStore();
  const { initialLoading, error, weather } = weatherStore;

  const [userCoordinates, setUserCoordinates] = useState({ lon: "", lat: "" });

  const [userCity, setUserCity] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchQueries, setSearchQueries] = useState([]);

  useEffect(() => {
    window.navigator.geolocation?.getCurrentPosition(
      position => setUserCoordinates({ lon: position.coords.longitude, lat: position.coords.latitude }),

      err => console.log(err)
    );

    if (userCoordinates.lat && userCoordinates.lon) {
      const fetchUserCity = () =>
        fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${userCoordinates.lat}&lon=${userCoordinates.lon}&appid=dd9dbc16899659de44ea30ebc32456a9`
        )
          .then(res => res.json())
          .then(data => {
            // console.log(data);
            if (data) {
              weatherStore.fetchWeather(data[0]?.name);
              setUserCity(data[0]?.name);
            }
          })
          .catch(err => console.error(err));

      fetchUserCity();
    }
  }, [userCoordinates.lat, userCoordinates.lon, weatherStore]);

  if (initialLoading)
    return <RotateLoader cssOverride={override} role="status" aria-label="Loading Spinner" color="#36ddbc" />;

  if (error) return <article className={styles.error}>Sorry, {error?.message}. Try again!</article>;

  return (
    <section>
      <div>
        <p className={styles.emojiOne}> ⛈ </p>

        <h2 className={styles.heading}>Find your current weather forecast</h2>
      </div>

      <div className={styles.input}>
        <Input
          label="Enter your city"
          placeholder={userCity}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      <div className={styles.button}>
        <Button
          label="Get Forecast"
          onClick={() => {
            weatherStore.fetchWeather(searchText);

            setSearchQueries([...searchQueries, ...searchText.split("0")]);
          }}
        />
      </div>

      <h3>Your City: {userCity}</h3>

      <div className={styles.search}>
        {searchQueries.length > 0 && <h4 className={styles.searchHeading}>search history:</h4>}

        <ul>
          {searchQueries.map((item, i) => (
            <li key={`query${i}`} className={styles.queryList}>
              {item},
            </li>
          ))}
        </ul>
      </div>

      {weather ? (
        <article>
          <div>
            <p className={styles.paragraph}>
              <strong>
                <span className={styles.emojiTwo}> 🌤 </span>
                <br />
                {weather && weather.name}
              </strong>
            </p>
          </div>

          <div className={styles.article}>
            <p>
              temp: {weather && weather.main.temp}, humidity: {weather && weather.main.humidity},
            </p>

            <ul>
              {weather &&
                weather.weather.map(item => (
                  <li key={item.id} className={styles.weatherList}>
                    {item.description}
                  </li>
                ))}
            </ul>
          </div>
        </article>
      ) : null}
    </section>
  );
});
export default Weather;
