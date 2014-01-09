/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../model/participant-grid.ts"/>
/// <reference path="../core/egm.ts"/>

module egrid.app {
  export class ParticipantGridController {
    projectKey : string;
    participantKey : string;
    egm : EGM;

    constructor($q, $routeParams, $scope) {
      this.projectKey = $routeParams.projectId;
      this.participantKey = $routeParams.participantId;
      this.egm = new EGM;

      $q.when(model.ParticipantGrid.get(this.projectKey, this.participantKey))
        .then((grid : model.ParticipantGrid) => {
          var nodes = grid.nodes.map(d => new egrid.Node(d.text, d.weight, d.original));
          var links = grid.links.map(d => new egrid.Link(nodes[d.source], nodes[d.target], d.weight));
          this.egm
            .nodes(nodes)
            .links(links)
            ;
        })
        ;

      var initialized = false;
      $scope.$parent.drawSvg = () => {
        if (!initialized) {
          this.draw();
          initialized = true;
        }
      };
    }

    draw() {
      d3.select("#display")
        .call(this.egm.display($("#display").width(), $("#display").height()))
        ;
      this.egm
        .draw()
        .focusCenter()
    }
  }
}
