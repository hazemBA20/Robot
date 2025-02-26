const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];
function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (from in graph) {
      graph[from].push(to);
    } else {
      graph[from] = [to];
    }
  }
  for (let [from, to] of edges.map((r) => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}
const roadGraph = buildGraph(roads);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }
  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels
        .map((p) => {
          if (p.place != this.place) return p;
          return { place: destination, address: p.address };
        })
        .filter((p) => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

function runRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}
function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}

VillageState.random = function (parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));

    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place === address);
    parcels.push({ place, address });
  }
  return new VillageState("Alice's House", parcels);
};
const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office",
];

function routeRobot(state, memory) {
  if (memory.length === 0) memory = mailRoute;
  return { direction: memory[0], memory: memory.slice(1) };
}
function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    for (let place of graph[at]) {
      if (place === to) return route.concat(place);
      if (!work.some((element) => element.at === place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}
function goalOrientedRobot({ place, parcels }, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}
function smartGoalOrientedRobot({ place, parcels }, route) {
  if (route.length == 0) {
    //checks if we are picking up a parcel
    if (parcels.some((a) => a.place === place)) {
      console.log("picked up a parcel");
      let currentParcel = parcels.find((a) => a.place === place);
      route = findRoute(roadGraph, place, currentParcel.address);
      parcels = parcels.filter((e) => e != currentParcel);
    } else {
      console.log("finding a parcel");
      let nextParcel = parcels.reduce(
        (prev, next) => {
          let len1 = findRoute(roadGraph, place, prev.address).length;
          let len2 = findRoute(roadGraph, place, next.address).length;
          return len2 > len1 ? next : prev;
        },
        { address: place }
      );
      route = findRoute(roadGraph, place, nextParcel.place);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}

function compareRobots(robot1, memory1, robot2, memory2) {
  function run(state, robot, memory) {
    for (let turn = 0; ; turn++) {
      if (state.parcels.length == 0) {
        return turn;
      }
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
    }
  }
  arr1 = [];
  arr2 = [];
  for (let i = 0; i < 100; i++) {
    let randomState = VillageState.random();
    arr1.push(run(randomState, robot1, memory1));
    arr2.push(run(randomState, robot2, memory2));
  }
  let average1 = arr1.reduce((a, b) => a + b, 0) / 100;
  let average2 = arr2.reduce((a, b) => a + b, 0) / 100;
  console.log(`Robot1 : ${average1} \nRobot2 : ${average2}`);
}
let initialState = VillageState.random();
console.log(initialState);
// console.log(initialState);
runRobot(initialState, smartGoalOrientedRobot, []);

// compareRobots(routeRobot, [], goalOrientedRobot, []);
//console.log(roadGraph);
