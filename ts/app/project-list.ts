/// <reference path="../ts-definitions/DefinitelyTyped/angularLocalStorage/angularLocalStorage.d.ts"/>
/// <reference path="../model/project.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public projects: model.Project[] = [];

    constructor($q, $scope, storage: angularLocalStorage.IStorageService) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(model.Project.query())
        .then((projects: model.Project[]) => {
          return storage.set('projects', projects.map(JSON.stringify));
        })
        .finally(() => {
          this.projects = storage.get('projects').map(model.Project.parse);
        });
    }
  }
}
