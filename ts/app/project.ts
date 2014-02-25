/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectController {
    public project: model.Project = new model.Project();

    constructor(private $q, $stateParams, private $state, private $modal, storage: angularLocalStorage.IStorageService) {
      var key = $stateParams.projectId;

      this.$q.when(this.project.fetch(key))
        .then((p: model.Project) => {
          this.project = p;
        });
    }

    public update() {
      this.$q.when(this.project.publish())
        .then((project: model.Project) => {
          // バインドしてるから要らない気はする
          this.project.name = project.name;
          this.project.note = project.note;
        });
    }

    public confirm() {
      var modalInstance = this.$modal.open({
        templateUrl: '/partials/remove-item-dialog.html',
        controller: ($scope, $modalInstance) => {
          $scope.ok = () => {
            $modalInstance.close();
          },
          $scope.cancel = () => {
            $modalInstance.dismiss();
          }
        }
      });

      modalInstance.result.then(() => { this.remove(); });
    }

    private remove() {
      this.$q.when(this.project.remove())
        .then(() => {
          this.$state.go('project.all.list');
        });
    }
  }
}
