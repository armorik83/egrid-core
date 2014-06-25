factory = require '../graph/graph'


module.exports = (vertices, edges) ->
  fact = factory()
  if vertices?
    if edges?
      graph = fact vertices, edges
    else
      graph = vertices
  else
    graph = fact()

  undoStack = []
  redoStack = []
  execute = (transaction) ->
    transaction.execute()
    undoStack.push transaction
    redoStack = []
    return

  class EgmGraph
    constructor: ->

    graph: ->
      graph

    addConstruct: (text) ->
      v = null
      value =
        text: text
        original: true
      for u in graph.vertices()
        if graph.get(u).text is value.text
          return +u
      execute
        execute: ->
          v = graph.addVertex value, v
        revert: ->
          graph.removeVertex v
      v

    removeConstruct: (u) ->
      value = graph.get u
      edges = graph.inEdges(u).concat graph.outEdges(u)
      execute
        execute: ->
          graph.clearVertex u
          graph.removeVertex u
        revert: ->
          graph.addVertex value, u
          for [v, w] in edges
            graph.addEdge v, w
      return

    updateConstruct: (u, key, value) ->
      properties = graph.get u
      oldValue = properties[key]
      execute
        execute: ->
          properties[key] = value
        revert: ->
          properties[key] = oldValue
      return

    addEdge: (u, v) ->
      execute
        execute: ->
          graph.addEdge u, v
        revert: ->
          graph.removeEdge u, v
      return

    removeEdge: (u, v) ->
      execute
        execute: ->
          graph.removeEdge u, v
        revert: ->
          graph.addEdge u, v
      return

    ladderUp: (u, text) ->
      v = null
      value =
        text: text
        original: false
      dup = (+w for w in graph.vertices() when graph.get(w).text is value.text)
      if dup.length > 0
        v = dup[0]
        execute
          execute: ->
            graph.addEdge v, u
          revert: ->
            graph.removeEdge v, u
      else
        execute
          execute: ->
            v = graph.addVertex value, v
            graph.addEdge v, u
          revert: ->
            graph.removeEdge v, u
            graph.removeVertex v
      v

    ladderDown: (u, text) ->
      v = null
      value =
        text: text
        original: false
      dup = (+w for w in graph.vertices() when graph.get(w).text is value.text)
      if dup.length > 0
        v = dup[0]
        execute
          execute: ->
            graph.addEdge u, v
          revert: ->
            graph.removeEdge u, v
      else
        execute
          execute: ->
            v = graph.addVertex value, v
            graph.addEdge u, v
          revert: ->
            graph.removeEdge u, v
            graph.removeVertex v
      v

    canUndo: ->
      undoStack.length > 0

    canRedo: ->
      redoStack.length > 0

    undo: ->
      throw new Error 'Undo stack is empty' unless @canUndo()
      transaction = undoStack.pop()
      transaction.revert()
      redoStack.push transaction
      return

    redo: ->
      throw new Error 'Redo stack is empty' unless @canRedo()
      transaction = redoStack.pop()
      transaction.execute()
      undoStack.push transaction
      return

  new EgmGraph
