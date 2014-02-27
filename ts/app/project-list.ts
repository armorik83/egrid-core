/// <reference path="../model/project.ts"/>
/// <reference path="../model/project-collection.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public projects = new model.ProjectCollection();

    constructor($q) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(this.projects.query())
        .then((projects: model.Project[]) => {
          projects.forEach((v) => {
              this.projects.addItem(v);
            });

          if (this.projects.isDirty())
            // どうすればいいかわからない
            this.projects
              .flush()
              .then((ps) => {
                  ps.forEach((p) => {
                      this.projects.addItem(p);
                    });
                });
        });
    }
  }
}
