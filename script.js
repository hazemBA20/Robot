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
  function findNodes([from, to], graph) {
    if (from in graph) graph[from].push(to);
    else graph[from] = [to];
  }
  for ([from, to] of edges.map((element) => element.split("-")))
    findNodes([from, to], graph);
  return graph;
}
console.log(buildGraph(roads));
