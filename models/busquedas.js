const axios = require("axios");
const fs = require("fs");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map((lugar, idx) => {
      const index = `${idx + 1}`.green;
      const sentence = lugar
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substr(1))
        .join(" ");

      return `${index}. ${sentence}`;
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenweather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async ciudad(lugar) {
    const instance = axios.create({
      baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
      params: this.paramsMapbox,
    });

    const response = await instance.get();
    return response.data.features.map((lugar) => ({
      id: lugar.id,
      nombre: lugar.place_name,
      lng: lugar.center[0],
      lat: lugar.center[1],
    }));
  }

  async climaLugar(lat, lon) {
    const instance = axios.create({
      baseURL: "https://api.openweathermap.org/data/2.5/weather",
      params: this.paramsOpenweather,
    });

    const { data } = await instance.get("", {
      params: { lat, lon },
    });

    return {
      desc: data.weather[0].description,
      min: data.main.temp_min,
      max: data.main.temp_max,
      temp: data.main.temp,
    };
  }

  agreagarHistorial(lugar) {
    if (this.historial.includes(lugar.toLowerCase())) return;
    this.historial.unshift(lugar.toLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) return;
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;
