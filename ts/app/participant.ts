/// <reference path="../model/participant.ts"/>
/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ParticipantController implements model.ParticipantData {
    name : string;
    note : string;
    project : model.ProjectData;
    projectKey : string;
    participant : model.Participant;

    constructor(private $q, $stateParams, private $scope, private $state, private $modal) {
      this.participant = new model.Participant({ projectKey: $stateParams.projectId });

      this.$q.when(this.participant.get($stateParams.participantId))
        .then((p: model.Participant) => {
        }, (jqXHR: JQueryPromise<model.Project>, textStatus: string, errorThrown: string) => {
        });
    }

    public update() {
      this.$q.when(this.participant.save())
        .then((participant: model.Participant) => {
          // バインドしてるから要らない気はする
          this.participant.name = participant.name;
          this.participant.note = participant.note;
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
      this.$q.when(this.participant.remove())
        .then(() => {
          this.$state.go('projects.get.participants.all.list');
        });
    }
  }
}
