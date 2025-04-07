const stations = {
  Arcadia: {
    x: 350,
    y: 150,
    fuelPrice: 4,
    goods: {
      food: 15,
      minerals: 12,
      tech: 30,
      crystals: 28,
      alloys: 15,
      circuits: 22,
      drones: 25,
      lasers: 30,
      armor: 22,
      engines: 35,
      turbines: 25,
    },
  },
  Eclipse: {
    x: 250,
    y: 200,
    fuelPrice: 6,
    goods: {
      food: 9,
      minerals: 19,
      tech: 32,
      crystals: 25,
      alloys: 18,
      circuits: 25,
      drones: 28,
      lasers: 32,
      armor: 25,
      engines: 38,
      turbines: 28,
    },
  },
  Helios: {
    x: 300,
    y: 250,
    fuelPrice: 3,
    goods: {
      food: 16,
      minerals: 21,
      tech: 34,
      crystals: 30,
      alloys: 20,
      circuits: 28,
      drones: 30,
      lasers: 35,
      armor: 28,
      engines: 40,
      turbines: 30,
    },
  },
  Lunaris: {
    x: 400,
    y: 300,
    fuelPrice: 5,
    goods: {
      food: 14,
      minerals: 18,
      tech: 31,
      crystals: 22,
      alloys: 12,
      circuits: 20,
      drones: 22,
      lasers: 28,
      armor: 20,
      engines: 32,
      turbines: 22,
    },
  },
  Nova: {
    x: 150,
    y: 350,
    fuelPrice: 8,
    goods: {
      food: 11,
      minerals: 25,
      tech: 38,
      crystals: 35,
      alloys: 25,
      circuits: 32,
      drones: 35,
      lasers: 40,
      armor: 32,
      engines: 45,
      turbines: 35,
    },
  },
  Orbis: {
    x: 200,
    y: 250,
    fuelPrice: 7,
    goods: {
      food: 12,
      minerals: 22,
      tech: 35,
      crystals: 28,
      alloys: 18,
      circuits: 25,
      drones: 28,
      lasers: 32,
      armor: 25,
      engines: 38,
      turbines: 28,
    },
  },
  Solara: {
    x: 300,
    y: 350,
    fuelPrice: 6,
    goods: {
      food: 13,
      minerals: 17,
      tech: 33,
      crystals: 25,
      alloys: 15,
      circuits: 22,
      drones: 25,
      lasers: 30,
      armor: 22,
      engines: 35,
      turbines: 25,
    },
  },
  Zentara: {
    x: 100,
    y: 100,
    fuelPrice: 5,
    goods: {
      food: 10,
      minerals: 20,
      tech: 40,
      crystals: 20,
      alloys: 10,
      circuits: 18,
      drones: 20,
      lasers: 25,
      armor: 18,
      engines: 30,
      turbines: 20,
    },
  },
  Aethereia: {
    x: 450,
    y: 100,
    fuelPrice: 4,
    goods: {
      food: 18,
      minerals: 15,
      tech: 28,
      crystals: 22,
      alloys: 12,
      circuits: 20,
      drones: 22,
      lasers: 25,
      armor: 20,
      engines: 30,
      turbines: 22,
    },
  },
  Borealis: {
    x: 500,
    y: 200,
    fuelPrice: 5,
    goods: {
      food: 20,
      minerals: 18,
      tech: 30,
      crystals: 25,
      alloys: 15,
      circuits: 22,
      drones: 25,
      lasers: 28,
      armor: 22,
      engines: 32,
      turbines: 25,
    },
  },
  Celestia: {
    x: 550,
    y: 300,
    fuelPrice: 6,
    goods: {
      food: 22,
      minerals: 20,
      tech: 32,
      crystals: 28,
      alloys: 18,
      circuits: 25,
      drones: 28,
      lasers: 30,
      armor: 25,
      engines: 35,
      turbines: 28,
    },
  },
  Deltara: {
    x: 400,
    y: 400,
    fuelPrice: 7,
    goods: {
      food: 25,
      minerals: 22,
      tech: 35,
      crystals: 30,
      alloys: 20,
      circuits: 28,
      drones: 30,
      lasers: 32,
      armor: 28,
      engines: 38,
      turbines: 30,
    },
  },
  Elysium: {
    x: 350,
    y: 450,
    fuelPrice: 8,
    goods: {
      food: 28,
      minerals: 25,
      tech: 38,
      crystals: 32,
      alloys: 22,
      circuits: 30,
      drones: 32,
      lasers: 35,
      armor: 30,
      engines: 40,
      turbines: 32,
    },
  },
  Fluxia: {
    x: 450,
    y: 500,
    fuelPrice: 9,
    goods: {
      food: 30,
      minerals: 28,
      tech: 40,
      crystals: 35,
      alloys: 25,
      circuits: 32,
      drones: 35,
      lasers: 38,
      armor: 32,
      engines: 42,
      turbines: 35,
    },
  },
  Geminus: {
    x: 500,
    y: 550,
    fuelPrice: 10,
    goods: {
      food: 32,
      minerals: 30,
      tech: 42,
      crystals: 38,
      alloys: 28,
      circuits: 35,
      drones: 38,
      lasers: 40,
      armor: 35,
      engines: 45,
      turbines: 38,
    },
  },
  Helix: {
    x: 550,
    y: 600,
    fuelPrice: 11,
    goods: {
      food: 35,
      minerals: 32,
      tech: 45,
      crystals: 40,
      alloys: 30,
      circuits: 38,
      drones: 40,
      lasers: 42,
      armor: 38,
      engines: 48,
      turbines: 40,
    },
  },
  Infinity: {
    x: 400,
    y: 650,
    fuelPrice: 12,
    goods: {
      food: 38,
      minerals: 35,
      tech: 48,
      crystals: 42,
      alloys: 32,
      circuits: 40,
      drones: 42,
      lasers: 45,
      armor: 40,
      engines: 50,
      turbines: 42,
    },
  },
  Jovian: {
    x: 350,
    y: 700,
    fuelPrice: 13,
    goods: {
      food: 40,
      minerals: 38,
      tech: 50,
      crystals: 45,
      alloys: 35,
      circuits: 42,
      drones: 45,
      lasers: 48,
      armor: 42,
      engines: 52,
      turbines: 45,
    },
  },
};

const connections = [
  ["Zentara", "Orbis"],
  ["Orbis", "Eclipse"],
  ["Eclipse", "Helios"],
  ["Helios", "Arcadia"],
  ["Arcadia", "Lunaris"],
  ["Lunaris", "Solara"],
  ["Solara", "Nova"],
  ["Nova", "Orbis"],
  ["Arcadia", "Aethereia"],
  ["Lunaris", "Borealis"],
  ["Solara", "Celestia"],
  ["Nova", "Deltara"],
  ["Orbis", "Elysium"],
  ["Eclipse", "Fluxia"],
  ["Helios", "Geminus"],
  ["Arcadia", "Helix"],
  ["Lunaris", "Infinity"],
  ["Solara", "Jovian"],
];

const player = {
  location: "Orbis",
  fuel: 100,
  credits: 100,
  cargo: {},
  cargoCapacity: 10,
  fuelEfficiency: 1.0,
  discovered: {},
  visitedPrices: [],
};