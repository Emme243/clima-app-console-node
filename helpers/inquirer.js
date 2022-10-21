const inquirer = require("inquirer");
const colors = require("colors");

const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "¿Qué desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2.".green} Historial`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir`,
      },
    ],
  },
];

async function inquirerMenu() {
  console.clear();
  console.log("==========================".green);
  console.log("  Seleccione una opción".white);
  console.log("==========================".green);

  const { opcion } = await inquirer.prompt(preguntas);
  return opcion;
}

async function pausa() {
  console.log("\n");
  await inquirer.prompt([
    {
      type: "input",
      message: `Presionse ${"ENTER".green} para continuar`,
      name: "isReady",
    },
  ]);
}

async function leerInput(message) {
  const question = [
    {
      type: "question",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) return "Por favor ingrese un favor";
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
}

async function listarLugares(lugares = []) {
  const choices = lugares.map((lugar, idx) => ({
    value: lugar.id,
    name: `${colors.green(idx + 1)}. ${lugar.nombre}`,
  }));

  choices.unshift({
    value: "0",
    name: "0".green + ". Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "lugarId",
      message: "Seleccione lugar: ",
      choices,
    },
  ];
  const { lugarId } = await inquirer.prompt(preguntas);
  return lugarId;
}

async function confirmar(message) {
  const question = [
    {
      type: "confirm",
      name: "isOk",
      message,
    },
  ];

  const { isOk } = await inquirer.prompt(question);
  return isOk;
}

async function mostrarListadoChecklist(tareas = []) {
  const choices = tareas.map((tarea, idx) => ({
    value: tarea.id,
    name: `${colors.green(idx + 1)}. ${tarea.desc}`,
    checked: Boolean(tarea.completadoEn),
  }));

  const pregunta = [
    {
      type: "checkbox",
      name: "ids",
      message: "Seleccione",
      choices,
    },
  ];
  const { ids } = await inquirer.prompt(pregunta);
  return ids;
}

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoChecklist,
};
