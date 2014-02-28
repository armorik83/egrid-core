/// <reference path="../model/project-grid.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ProjectGridCreateController {
    projectKey : string;
    data : model.ProjectGrid;

    constructor(private $q, $stateParams, private $state) {
      this.projectKey = $stateParams.projectId;

      this.data = new model.ProjectGrid({
        projectKey: this.projectKey
      });
    }

    submit() {
      this.$q.when(this.data.save())
        .then((grid : model.ProjectGrid) => {
          this.$state.go('projects.get.grids.get.detail', { projectGridKey: grid.key });
        })
        ;
    }
  }
}
