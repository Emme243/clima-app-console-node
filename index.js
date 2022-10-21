require("dotenv").config();
const {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1: {
        // Mostart mensaje
        const termino = await leerInput("Ciudad: ");
        // Buscar lugares
        const lugares = await busquedas.ciudad(termino);
        // Seleccionar el lugar
        const lugarId = await listarLugares(lugares);
        const lugar = lugares.find((lugar) => lugar.id === lugarId);
        if (lugarId === "0") continue;
        // Guardar en DB
        busquedas.agreagarHistorial(lugar.nombre);
        // Clima
        const clima = await busquedas.climaLugar(lugar.lat, lugar.lng);
        // Mostrar resultados
        console.log("\nInformación de la ciudad\n");
        console.log("Ciudad:", lugar.nombre);
        console.log("Lat:", lugar.lat);
        console.log("Lng:", lugar.lng);
        console.log("Temperatura:", clima.temp);
        console.log("Mínima:", clima.min);
        console.log("Máxima:", clima.max);
        console.log("Cómo está el clima:", clima.desc);

        break;
      }
      case 2: {
        busquedas.historialCapitalizado.forEach((lugar) => console.log(lugar));
        break;
      }
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
