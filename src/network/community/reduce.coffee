newman = require './newman'
adjacencyList = require '../../graph/adjacency-list'

module.exports = (graph, f=(vertices) -> (graph.get u for u in vertices)) ->
  communities = newman graph

  mergedGraph = adjacencyList()
  mergedVertices = []
  for community, i in communities
    mergedData = f community, i
    mergedVertices.push mergedGraph.addVertex mergedData

  for community1, i in communities
    for j in [i + 1...communities.length]
      community2 = communities[j]
      for u in community1
        for v in community2
          if graph.edge u, v
            mergedGraph.addEdge i, j
          else if graph.edge v, u
            mergedGraph.addEdge j, i

  mergedGraph
