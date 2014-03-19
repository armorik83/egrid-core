/// <reference path="../model/project.ts"/>
/// <reference path="../model/sem-project.ts"/>
/// <reference path="controller-base.ts"/>

module egrid.app {
  export class SemProjectController extends ControllerBase implements model.SemProjectData {
    name : string;
    project : model.ProjectData;
    projectKey : string;
    semProject : model.SemProject;

    constructor($window, $q, $rootScope, $stateParams, $state, $timeout, $filter, alertLifeSpan) {
      super($rootScope, $timeout, $filter, alertLifeSpan);

      this.semProject = new model.SemProject({ projectKey: $stateParams.projectId });

      $q.when(this.semProject.get($stateParams.semProjectId))
        .then((p: model.SemProject) => {
        }, (reason) => {
          if (reason.status === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }

          if (reason.status === 404 || reason.status === 500) {
            $state.go('projects.get.participants.all.list');

            this.showAlert('MESSAGES.ITEM_NOT_FOUND', 'warning');
          }
        });
    }
  }
}
