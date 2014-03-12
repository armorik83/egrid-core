/// <reference path="../model/project.ts"/>
/// <reference path="../model/project-collection.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public projects = new model.ProjectCollection();

    constructor($window, $q, $rootScope) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(this.projects.query())
        .then((projects: model.Project[]) => {
          Object.keys(projects).forEach((v, i, ar) => {
              this.projects.addItem(projects[v]);
            });
        });
    }
  }
}
