/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  export class CollaboratorCollection extends CollectionBase<Collaborator> {
    constructor() {
      super(new Dictionary<Collaborator>());
    }

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public query(projectKey?: string): JQueryPromise<Collaborator[]> {
      var $deferred = $.Deferred();
      var k = CollectionBase.pluralize(Collaborator.type);
      var mapper = (o: any) => {
          var item = new Collaborator(o).load(o);

          this.pairs.value.setItem(item.key, item);

          return item;
        };

      $.ajax({
          url: Collaborator.listUrl(projectKey),
          type: 'GET',
        })
        .then((result: string) => {
          var objects = JSON.parse(result) || [];

          objects
            .map(mapper);

          window.localStorage.setItem(k, JSON.stringify(this.pairs));

          return $deferred
            .resolve(this.pairs.value.toArray());
        }, (...reasons: any[]) => {
          var objects = window.localStorage.getItem(k) || [];
          var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

          $.extend(NotationDeserializer.load(objects), NotationDeserializer.load(unsaved))
            .map(mapper);

          return $deferred
            .resolve(this.pairs.value.toArray());
        });

      return $deferred.promise();
    }

    /**
     * this.collection に対し Entity.save() を呼び出します。
     */
    public flush(): JQueryPromise<Collaborator[]> {
      var $deferred = $.Deferred();
      var k = 'unsavedItems.' + CollectionBase.pluralize(Collaborator.type);
      var unsavedItems: any = JSON.parse(window.localStorage.getItem(k)) || {};

      $.when(Object
        .keys(unsavedItems)
        .map((value: any, index: number, ar: any[]) => {
            var item = new Collaborator();

            return item.load(unsavedItems[value]).save();
          }))
        .then((...items: Collaborator[]) => {
            // window.localStorage.removeItem(k);

            return $deferred.resolve(this.toArray());
          }, () => {
            return $deferred.reject();
          });

      return $deferred.promise();
    }

    public isDirty(): boolean {
      var k = 'unsavedItems.' + CollectionBase.pluralize(Collaborator.type);
      var unsavedItems: any = JSON.parse(window.localStorage.getItem(k)) || {};

      return !!Object.keys(unsavedItems).length;
    }
  }
}
