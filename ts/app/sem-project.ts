/// <reference path="../model/project.ts"/>
/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class SemProjectController implements model.SemProjectData {
    name : string;
    project : model.ProjectData;
    projectKey : string;
    semProjectKey : string;

    constructor($q, $stateParams) {
      this.projectKey = $stateParams.projectId;
      this.semProjectKey = $stateParams.semProjectId;
      $q.when(model.SemProject.get(this.projectKey, this.semProjectKey))
        .then((semProject : model.SemProject) => {
          this.name = semProject.name;
          this.project = semProject.project;
        })
        ;
    }
  }
}
