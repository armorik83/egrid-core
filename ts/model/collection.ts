/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  export class Dictionary<TValue> {
    private pairs = {};

    public addItem(k: string, v: TValue) {
      this.pairs[k] = v;
    }

    public getItem(k: string) {
      return this.pairs[k];
    }

    public toArray(): TValue[] {
      return Object.keys(this.pairs).map((v: string, i: number, ar: string[]) => {
        return this.pairs[v];
      });
    }
  }

  /**
  * @class Collection
  */
  export class Collection<T extends Entity> {
    private pairs = new Dictionary<T>();

    public addItem(item: T): void {
      this.pairs.addItem(item.key, item);
    }

    public getItem(n: string): T {
      return this.pairs.getItem(n);
    }

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public query(type: new() => T): JQueryPromise<T[]> {
      var $deferred = $.Deferred();
      var entity = new type(); // 申し訳ない

      $.ajax({
          url: entity.url(),
          type: 'GET',
        })
        .then((result: string) => {
          var objects: any[] = JSON.parse(result);

          window.localStorage.setItem(Collection.pluralize(entity.getType()), result);

          return $deferred
            .resolve(objects
              .map((o: any) => {
                var i = new type();

                return i.load(o);
              }));
        }, (...reasons: any[]) => {
          var objects = JSON.parse(window.localStorage.getItem(Collection.pluralize(entity.getType()))) || [];

          return $deferred
            .resolve(objects
              .map((o: any) => {
                var i = new type();

                return i.load(o);
              }));
        });

      return $deferred.promise();
    }

    /**
     * this.collection に対し Entity.save() を呼び出します。
     */
    public flush(type: new() => T): JQueryPromise<T[]> {
      var $deferred = $.Deferred();
      var entity = new type();
      var k = 'unsavedItems.' + Collection.pluralize(entity.getType());
      var unsavedItems: any = JSON.parse(window.localStorage.getItem(k)) || {};

      $.when.apply($, Object
        .keys(unsavedItems)
        .map((value: any, index: number, ar: any[]) => {
            var item = new type();

            return item.load(unsavedItems[value]).save();
          }))
        .then((...items: T[]) => {
          window.localStorage.removeItem(k);

            window.localStorage.removeItem(k);

            return $deferred.resolve(items);
          }, () => {
            return $deferred.reject();
          });

      return $deferred.promise();
    }

    public isDirty(type: new() => T): boolean {
      var entity = new type();
      var k = 'unsavedItems.' + Collection.pluralize(entity.getType());
      var unsavedItems: any = JSON.parse(window.localStorage.getItem(k)) || {};

      return !!Object.keys(unsavedItems).length;
    }

    public toArray(): T[] {
      return this.pairs.toArray();
    }

    public static pluralize(word: string): string {
      return word + 's';
    }
  }
}
