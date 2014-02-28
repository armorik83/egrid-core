var egrid;
(function (egrid) {
    (function (app) {
        (function (modules) {
            angular.module('paginator.filters', []).filter('pager', function () {
                return function (input, currentPage, itemsPerPage) {
                    var begin = (currentPage - 1) * itemsPerPage;

                    return input.slice(begin, begin + itemsPerPage);
                };
            });
            angular.module('paginator', ['paginator.filters']);
        })(app.modules || (app.modules = {}));
        var modules = app.modules;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ValueObject = (function () {
            function ValueObject(v) {
                this.value_ = v;
            }
            Object.defineProperty(ValueObject.prototype, "value", {
                get: function () {
                    return this.value_;
                },
                enumerable: true,
                configurable: true
            });

            ValueObject.prototype.toString = function () {
                return this.value_.toString();
            };
            return ValueObject;
        })();
        model.ValueObject = ValueObject;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var Entity = (function () {
            function Entity() {
            }

            Object.defineProperty(Entity.prototype, "key", {
                get: function () {
                    return (this.key_) ? this.key_.value : '';
                },
                set: function (key) {
                    if (!this.key_)
                        this.key_ = new egrid.model.ValueObject(key);
                },
                enumerable: true,
                configurable: true
            });

            Entity.prototype.load = function (o) {
                throw new Error('NotImplementedException');
            };

            Entity.prototype.get = function (key) {
                throw new Error('NotImplementedException');
            };

            Entity.prototype.save = function () {
                throw new Error('NotImplementedException');
            };

            Entity.listUrl = function (key) {
                throw new Error('NotImplementedException');
            };

            Entity.prototype.url = function (key) {
                throw new Error('NotImplementedException');
            };

            Entity.prototype.toJSON = function (t) {
                var replacement = {};

                for (var k in this) {
                    if (!(this[k] instanceof egrid.model.ValueObject)) {
                        replacement[k] = this[k];
                    }
                }

                return replacement;
            };
            return Entity;
        })();
        model.Entity = Entity;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var Dictionary = (function () {
            function Dictionary() {
                this.pairs = {};
            }
            Dictionary.prototype.getItem = function (k) {
                return this.pairs[k];
            };

            Dictionary.prototype.removeItem = function (k) {
                delete this.pairs[k];
            };

            Dictionary.prototype.setItem = function (k, v) {
                this.pairs[k] = v;
            };

            Dictionary.prototype.toArray = function () {
                var _this = this;
                return Object.keys(this.pairs).map(function (v, i, ar) {
                    return _this.pairs[v];
                });
            };

            Dictionary.prototype.toJSON = function () {
                var _this = this;
                var replacement = {};

                Object.keys(this.pairs).forEach(function (k) {
                    replacement[k] = _this.pairs[k];
                });

                return replacement;
            };
            return Dictionary;
        })();
        model.Dictionary = Dictionary;

        var NotationDeserializer = (function () {
            function NotationDeserializer() {
            }
            NotationDeserializer.load = function (o) {
                var b = JSON.parse(o);
                return Object.keys(b).map(function (v, i, ar) {
                    return b[v];
                });
            };
            return NotationDeserializer;
        })();
        model.NotationDeserializer = NotationDeserializer;

        var CollectionBase = (function () {
            function CollectionBase(pairs) {
                this.pairs_ = new egrid.model.ValueObject(pairs);
            }
            Object.defineProperty(CollectionBase.prototype, "pairs", {
                get: function () {
                    return this.pairs_;
                },
                enumerable: true,
                configurable: true
            });

            CollectionBase.prototype.addItem = function (item) {
                this.pairs.value.setItem(item.key, item);
            };

            CollectionBase.prototype.getItem = function (k) {
                return this.pairs.value.getItem(k);
            };

            CollectionBase.prototype.removeItem = function (k) {
                return this.pairs.value.removeItem(k);
            };

            CollectionBase.prototype.query = function (key) {
                throw new Error('NotImplementedException');
            };

            CollectionBase.prototype.flush = function (type) {
                throw new Error('NotImplementedException');
            };

            CollectionBase.prototype.isDirty = function () {
                throw new Error('NotImplementedException');
            };

            CollectionBase.prototype.toArray = function () {
                return this.pairs.value.toArray();
            };

            CollectionBase.pluralize = function (word) {
                return word + 's';
            };
            return CollectionBase;
        })();
        model.CollectionBase = CollectionBase;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var egrid;
(function (egrid) {
    (function (model) {
        var Project = (function (_super) {
            __extends(Project, _super);
            function Project(obj) {
                _super.call(this);

                if (obj) {
                    this.name = obj.name;
                    this.note = obj.note;
                }
            }
            Object.defineProperty(Project.prototype, "createdAt", {
                get: function () {
                    return this.createdAt_.value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Project.prototype, "updatedAt", {
                get: function () {
                    return this.updatedAt_.value;
                },
                enumerable: true,
                configurable: true
            });

            Project.prototype.setCreatedAt = function (date) {
                if (!this.createdAt_)
                    this.createdAt_ = new egrid.model.ValueObject(date);
            };

            Project.prototype.setUpdatedAt = function (date) {
                if (!this.updatedAt_)
                    this.updatedAt_ = new egrid.model.ValueObject(date);
            };

            Project.prototype.load = function (o) {
                this.key = o.key;

                this.name = o.name;
                this.note = o.note;

                this.setCreatedAt(o.createdAt);
                this.setUpdatedAt(o.updatedAt);

                return this;
            };

            Project.prototype.get = function (key) {
                var _this = this;
                var $deferred = $.Deferred();

                $.ajax({
                    url: this.url(key),
                    type: 'GET',
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);

                        return _this.load(obj);
                    }
                }).then(function (project) {
                    return $deferred.resolve(project);
                }, function () {
                    var k = egrid.model.CollectionBase.pluralize(Project.type);
                    var objects = window.localStorage.getItem(k) || [];
                    var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

                    var target = $.extend(JSON.parse(objects), JSON.parse(unsaved));

                    return target[key] ? $deferred.resolve(_this.load(target[key])) : $deferred.reject();
                });

                return $deferred.promise();
            };

            Project.prototype.save = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var key = this.key;

                return $.ajax({
                    url: key ? this.url(key) : Project.listUrl(),
                    type: key ? 'PUT' : 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        key: key,
                        name: this.name,
                        note: this.note
                    }),
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);

                        return _this.load(obj);
                    }
                }).then(function (p) {
                    return $deferred.resolve(p);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var o = {};
                    var key = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(Project.type);
                    var unsavedItems;

                    o[_this.key] = _this;

                    unsavedItems = $.extend({}, JSON.parse(window.localStorage.getItem(key)), o);

                    window.localStorage.setItem(key, JSON.stringify(unsavedItems));

                    return $deferred.reject();
                });

                return $deferred.promise();
            };

            Project.listUrl = function () {
                return '/api/projects';
            };

            Project.prototype.url = function (key) {
                return Project.listUrl() + '/' + key;
            };

            Project.prototype.remove = function () {
                return $.ajax({
                    url: this.url(this.key),
                    type: 'DELETE'
                });
            };
            Project.type = 'Project';
            return Project;
        })(egrid.model.Entity);
        model.Project = Project;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var User = (function () {
            function User() {
            }
            return User;
        })();
        model.User = User;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var Collaborator = (function (_super) {
            __extends(Collaborator, _super);
            function Collaborator(obj) {
                _super.call(this);

                if (obj) {
                    this.isManager = obj.isManager;
                    this.project = obj.project;
                    this.projectKey = obj.projectKey;
                    this.user = obj.user;
                    this.userEmail = obj.userEmail;
                }
            }
            Collaborator.prototype.load = function (o) {
                this.key = o.key;

                this.project = o.project;

                return this;
            };

            Collaborator.prototype.get = function (key) {
                var _this = this;
                var $deferred = $.Deferred();

                $.ajax({
                    url: this.url(key),
                    type: 'GET',
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);

                        return _this.load(obj);
                    }
                }).then(function (collaborator) {
                    return $deferred.resolve(collaborator);
                }, function () {
                    var k = egrid.model.CollectionBase.pluralize(Collaborator.type);
                    var objects = window.localStorage.getItem(k) || [];
                    var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

                    var target = $.extend(JSON.parse(objects), JSON.parse(unsaved));

                    return target[key] ? $deferred.resolve(_this.load(target[key])) : $deferred.reject();
                });

                return $deferred.promise();
            };

            Collaborator.prototype.save = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var key = this.key;

                return $.ajax({
                    url: key ? this.url(key) : Collaborator.listUrl(this.projectKey),
                    type: this.key ? 'PUT' : 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        key: this.key,
                        isManager: this.isManager,
                        projectKey: this.projectKey,
                        userEmail: this.userEmail
                    }),
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);

                        return _this.load(obj);
                    }
                }).then(function (c) {
                    return $deferred.resolve(c);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var o = {};
                    var key = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(Collaborator.type);
                    var unsavedItems;

                    o[_this.key] = _this;

                    unsavedItems = $.extend({}, JSON.parse(window.localStorage.getItem(key)), o);

                    window.localStorage.setItem(key, JSON.stringify(unsavedItems));

                    return $deferred.reject();
                });

                return $deferred.promise();
            };

            Collaborator.listUrl = function (key) {
                return egrid.model.Project.listUrl() + '/' + key + '/collaborators';
            };

            Collaborator.prototype.url = function (key) {
                return Collaborator.listUrl(this.projectKey) + '/' + key;
            };

            Collaborator.prototype.remove = function () {
                return $.ajax({
                    url: this.url(this.key),
                    type: 'DELETE'
                });
            };
            Collaborator.type = 'Collaborator';
            Collaborator.url = '/api/projects/:projectId/collaborators/:collaboratorId';
            return Collaborator;
        })(egrid.model.Entity);
        model.Collaborator = Collaborator;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var Participant = (function (_super) {
            __extends(Participant, _super);
            function Participant(obj) {
                _super.call(this);

                if (obj) {
                    this.name = obj.name;
                    this.note = obj.note;
                    this.project = obj.project;
                    this.projectKey = obj.projectKey;
                }
            }
            Object.defineProperty(Participant.prototype, "createdAt", {
                get: function () {
                    return this.createdAt_.value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Participant.prototype, "updatedAt", {
                get: function () {
                    return this.updatedAt_.value;
                },
                enumerable: true,
                configurable: true
            });

            Participant.prototype.setCreatedAt = function (date) {
                if (!this.createdAt_)
                    this.createdAt_ = new egrid.model.ValueObject(date);
            };

            Participant.prototype.setUpdatedAt = function (date) {
                if (!this.updatedAt_)
                    this.updatedAt_ = new egrid.model.ValueObject(date);
            };

            Participant.prototype.load = function (o) {
                this.key = o.key;

                this.name = o.name;
                this.note = o.note;

                this.project = o.project;

                this.setCreatedAt(o.createdAt);
                this.setUpdatedAt(o.updatedAt);

                return this;
            };

            Participant.prototype.get = function (key) {
                var _this = this;
                var $deferred = $.Deferred();

                $.ajax({
                    url: this.url(key),
                    type: 'GET',
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);

                        return _this.load(obj);
                    }
                }).then(function (participant) {
                    return $deferred.resolve(participant);
                }, function () {
                    var k = egrid.model.CollectionBase.pluralize(Participant.type);
                    var objects = window.localStorage.getItem(k) || [];
                    var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

                    var target = $.extend(JSON.parse(objects), JSON.parse(unsaved));

                    return target[key] ? $deferred.resolve(_this.load(target[key])) : $deferred.reject();
                });

                return $deferred.promise();
            };

            Participant.prototype.save = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var key = this.key;

                return $.ajax({
                    url: key ? this.url(key) : Participant.listUrl(this.projectKey),
                    type: this.key ? 'PUT' : 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        key: key,
                        name: this.name,
                        note: this.note
                    }),
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);

                        return _this.load(obj);
                    }
                }).then(function (p) {
                    return $deferred.resolve(p);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var o = {};
                    var key = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(Participant.type);
                    var unsavedItems;

                    o[_this.key] = _this;

                    unsavedItems = $.extend({}, JSON.parse(window.localStorage.getItem(key)), o);

                    window.localStorage.setItem(key, JSON.stringify(unsavedItems));

                    return $deferred.reject();
                });

                return $deferred.promise();
            };

            Participant.listUrl = function (key) {
                return egrid.model.Project.listUrl() + '/' + key + '/participants';
            };

            Participant.prototype.url = function (key) {
                return Participant.listUrl(this.projectKey) + '/' + key;
            };

            Participant.prototype.remove = function () {
                return $.ajax({
                    url: this.url(this.key),
                    type: 'DELETE'
                });
            };
            Participant.type = 'Participant';
            Participant.url = '/api/projects/:projectId/participants/:participantId';
            return Participant;
        })(egrid.model.Entity);
        model.Participant = Participant;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var SemProject = (function (_super) {
            __extends(SemProject, _super);
            function SemProject(obj) {
                _super.call(this);

                if (obj) {
                    this.name = obj.name;
                    this.project = obj.project;
                    this.projectKey = obj.projectKey;
                }
            }
            Object.defineProperty(SemProject.prototype, "createdAt", {
                get: function () {
                    return this.createdAt_.value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SemProject.prototype, "updatedAt", {
                get: function () {
                    return this.updatedAt_.value;
                },
                enumerable: true,
                configurable: true
            });

            SemProject.prototype.setCreatedAt = function (date) {
                if (!this.createdAt_)
                    this.createdAt_ = new egrid.model.ValueObject(date);
            };

            SemProject.prototype.setUpdatedAt = function (date) {
                if (!this.updatedAt_)
                    this.updatedAt_ = new egrid.model.ValueObject(date);
            };

            SemProject.prototype.load = function (o) {
                this.key = o.key;

                this.name = o.name;

                this.project = o.project;

                this.setCreatedAt(o.createdAt);
                this.setUpdatedAt(o.updatedAt);

                return this;
            };

            SemProject.prototype.get = function (key) {
                var _this = this;
                var $deferred = $.Deferred();

                $.ajax({
                    url: this.url(key),
                    type: 'GET',
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);

                        return _this.load(obj);
                    }
                }).then(function (semProject) {
                    return $deferred.resolve(semProject);
                }, function () {
                    var k = egrid.model.CollectionBase.pluralize(SemProject.type);
                    var objects = window.localStorage.getItem(k) || [];
                    var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

                    var target = $.extend(JSON.parse(objects), JSON.parse(unsaved));

                    return target[key] ? $deferred.resolve(_this.load(target[key])) : $deferred.reject();
                });

                return $deferred.promise();
            };

            SemProject.prototype.save = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var key = this.key;

                return $.ajax({
                    url: key ? this.url(key) : SemProject.listUrl(this.projectKey),
                    type: this.key ? 'PUT' : 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        key: this.key,
                        name: this.name
                    }),
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);

                        return _this.load(obj);
                    }
                }).then(function (p) {
                    return $deferred.resolve(p);
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var o = {};
                    var key = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(SemProject.type);
                    var unsavedItems;

                    o[_this.key] = _this;

                    unsavedItems = $.extend({}, JSON.parse(window.localStorage.getItem(key)), o);

                    window.localStorage.setItem(key, JSON.stringify(unsavedItems));

                    return $deferred.reject();
                });

                return $deferred.promise();
            };

            SemProject.listUrl = function (key) {
                return egrid.model.Project.listUrl() + '/' + key + '/sem-projects';
            };

            SemProject.prototype.url = function (key) {
                return SemProject.listUrl(this.projectKey) + '/' + key;
            };
            SemProject.type = 'SemProject';
            SemProject.url = '/api/projects/:projectId/sem-projects/:semProjectId';
            return SemProject;
        })(egrid.model.Entity);
        model.SemProject = SemProject;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var Url = (function () {
            function Url() {
            }
            Url.participantUrl = function (arg, participantKey, action) {
                var projectKey;
                if (typeof participantKey !== 'string') {
                    projectKey = arg.projectKey;
                    participantKey = arg.key();
                } else {
                    projectKey = arg;
                }
                return action ? '/projects/' + projectKey + '/participants/' + participantKey + '/' + action : '/projects/' + projectKey + '/participants/' + participantKey;
            };

            Url.participantGridUrl = function (arg, participantKey) {
                return Url.participantUrl(arg, participantKey) + '/grid';
            };

            Url.projectListUrl = function () {
                return Url.projectListUrlBase;
            };

            Url.projectUrl = function (project, action) {
                var result;

                if (project instanceof egrid.model.Project) {
                    result = '/projects/' + project.key();
                } else {
                    result = '/projects/' + project;
                }

                return action ? result + '/' + action : result;
            };

            Url.projectGridUrl = function (project) {
                return Url.projectUrl(project) + '/grid';
            };

            Url.semProjectUrl = function (semProject, action) {
                return action ? '/projects/' + semProject.projectKey + '/sem-projects/' + semProject.key + '/' + action : '/projects/' + semProject.projectKey + '/sem-projects/' + semProject.key;
            };
            Url.participantUrlBase = '/projects/:projectId/participants/:participantId';
            Url.participantGridUrlBase = '/projects/:projectId/participants/:participantId/grid';
            Url.projectUrlBase = '/projects/:projectId';
            Url.projectGridUrlBase = '/projects/:projectId/grid';
            Url.projectListUrlBase = '/projects';
            Url.semProjectUrlBase = '/projects/:projectId/sem-projects/:semProjectId';
            return Url;
        })();
        app.Url = Url;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var CollaboratorCreateController = (function () {
            function CollaboratorCreateController($q, $stateParams, $state, $timeout) {
                this.$q = $q;
                this.$state = $state;
                this.$timeout = $timeout;
                this.projectKey = $stateParams.projectId;
            }
            CollaboratorCreateController.prototype.submit = function () {
                var _this = this;
                var c = new egrid.model.Collaborator(this);

                this.$q.when(c.save()).then((function () {
                    _this.$timeout(function () {
                        _this.$state.go('projects.get.collaborators.all.list', null, { reload: true });
                    }, 200);
                }), (function () {
                    console.log('error');
                }));
            };
            return CollaboratorCreateController;
        })();
        app.CollaboratorCreateController = CollaboratorCreateController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var CollaboratorCollection = (function (_super) {
            __extends(CollaboratorCollection, _super);
            function CollaboratorCollection() {
                _super.call(this, new egrid.model.Dictionary());
            }
            CollaboratorCollection.prototype.query = function (projectKey) {
                var _this = this;
                var $deferred = $.Deferred();
                var k = egrid.model.CollectionBase.pluralize(egrid.model.Collaborator.type);
                var mapper = function (o) {
                    var item = new egrid.model.Collaborator(o).load(o);

                    _this.pairs.value.setItem(item.key, item);

                    return item;
                };

                $.ajax({
                    url: egrid.model.Collaborator.listUrl(projectKey),
                    type: 'GET'
                }).then(function (result) {
                    var objects = JSON.parse(result) || [];

                    objects.map(mapper);

                    window.localStorage.setItem(k, JSON.stringify(_this.pairs));

                    return $deferred.resolve(_this.pairs.value.toArray());
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var objects = window.localStorage.getItem(k) || [];
                    var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

                    $.extend(egrid.model.NotationDeserializer.load(objects), egrid.model.NotationDeserializer.load(unsaved)).map(mapper);

                    return $deferred.resolve(_this.pairs.value.toArray());
                });

                return $deferred.promise();
            };

            CollaboratorCollection.prototype.flush = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var k = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(egrid.model.Collaborator.type);
                var unsavedItems = JSON.parse(window.localStorage.getItem(k)) || {};

                $.when(Object.keys(unsavedItems).map(function (value, index, ar) {
                    var item = new egrid.model.Collaborator();

                    return item.load(unsavedItems[value]).save();
                })).then(function () {
                    var items = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        items[_i] = arguments[_i + 0];
                    }
                    return $deferred.resolve(_this.toArray());
                }, function () {
                    return $deferred.reject();
                });

                return $deferred.promise();
            };

            CollaboratorCollection.prototype.isDirty = function () {
                var k = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(egrid.model.Collaborator.type);
                var unsavedItems = JSON.parse(window.localStorage.getItem(k)) || {};

                return !!Object.keys(unsavedItems).length;
            };
            return CollaboratorCollection;
        })(egrid.model.CollectionBase);
        model.CollaboratorCollection = CollaboratorCollection;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var CollaboratorListController = (function () {
            function CollaboratorListController($q, $stateParams, $state, $log, $scope, $modal) {
                var _this = this;
                this.$q = $q;
                this.$state = $state;
                this.$log = $log;
                this.$scope = $scope;
                this.$modal = $modal;
                this.collaborators = new egrid.model.CollaboratorCollection();
                this.projectId = $stateParams.projectId;

                $q.when(this.collaborators.query(this.projectId)).then(function (collaborators) {
                    collaborators.forEach(function (v) {
                        _this.collaborators.addItem(v);
                    });

                    if (_this.collaborators.isDirty())
                        _this.collaborators.flush().then(function (ps) {
                            ps.forEach(function (p) {
                                _this.collaborators.addItem(p);
                            });
                        });
                });
            }
            CollaboratorListController.prototype.confirm = function (key) {
                var _this = this;
                var modalInstance = this.$modal.open({
                    templateUrl: '/partials/remove-item-dialog.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.ok = function () {
                            $modalInstance.close();
                        }, $scope.cancel = function () {
                            $modalInstance.dismiss();
                        };
                    }
                });

                modalInstance.result.then(function () {
                    _this.remove(key);
                });
            };

            CollaboratorListController.prototype.remove = function (key) {
                var _this = this;
                this.$q.when(this.collaborators.getItem(key).remove()).then(function () {
                    _this.collaborators.removeItem(key);
                });
            };
            return CollaboratorListController;
        })();
        app.CollaboratorListController = CollaboratorListController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var ParticipantController = (function () {
            function ParticipantController($q, $stateParams, $scope, $state, $modal) {
                this.$q = $q;
                this.$scope = $scope;
                this.$state = $state;
                this.$modal = $modal;
                this.participant = new egrid.model.Participant({ projectKey: $stateParams.projectId });

                this.$q.when(this.participant.get($stateParams.participantId)).then(function (p) {
                }, function (jqXHR, textStatus, errorThrown) {
                });
            }
            ParticipantController.prototype.update = function () {
                var _this = this;
                this.$q.when(this.participant.save()).then(function (participant) {
                    _this.participant.name = participant.name;
                    _this.participant.note = participant.note;
                });
            };

            ParticipantController.prototype.confirm = function () {
                var _this = this;
                var modalInstance = this.$modal.open({
                    templateUrl: '/partials/remove-item-dialog.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.ok = function () {
                            $modalInstance.close();
                        }, $scope.cancel = function () {
                            $modalInstance.dismiss();
                        };
                    }
                });

                modalInstance.result.then(function () {
                    _this.remove();
                });
            };

            ParticipantController.prototype.remove = function () {
                var _this = this;
                this.$q.when(this.participant.remove()).then(function () {
                    _this.$state.go('projects.get.participants.all.list');
                });
            };
            return ParticipantController;
        })();
        app.ParticipantController = ParticipantController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var ParticipantCreateController = (function () {
            function ParticipantCreateController($q, $stateParams, $state) {
                this.$q = $q;
                this.$state = $state;
                this.projectKey = $stateParams.projectId;
            }
            ParticipantCreateController.prototype.submit = function () {
                var _this = this;
                var participant = new egrid.model.Participant(this);
                this.$q.when(participant.save()).then(function () {
                    _this.$state.go('projects.get.participants.get.detail', { projectId: _this.projectKey, participantId: participant.key });
                }, function () {
                    _this.$state.go('projects.get.participants.all.list');
                });
            };
            return ParticipantCreateController;
        })();
        app.ParticipantCreateController = ParticipantCreateController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ParticipantGrid = (function () {
            function ParticipantGrid(obj) {
                this.projectKey = obj.projectKey;
                this.participantKey = obj.participantKey;
                this.nodes = obj.nodes;
                this.links = obj.links;
            }
            ParticipantGrid.prototype.update = function () {
                var _this = this;
                return $.ajax({
                    url: this.url(),
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        nodes: this.nodes,
                        links: this.links
                    }),
                    dataFilter: function (_) {
                        return _this;
                    }
                });
            };

            ParticipantGrid.prototype.url = function () {
                return ParticipantGrid.url(this.projectKey, this.participantKey);
            };

            ParticipantGrid.get = function (projectKey, participantKey) {
                return $.ajax({
                    url: ParticipantGrid.url(projectKey, participantKey),
                    type: 'GET',
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);
                        return new ParticipantGrid(obj);
                    }
                });
            };

            ParticipantGrid.url = function (projectKey, participantKey) {
                return '/api/projects/' + projectKey + '/participants/' + participantKey + '/grid';
            };
            return ParticipantGrid;
        })();
        model.ParticipantGrid = ParticipantGrid;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var Svg;
(function (Svg) {
    (function (Transform) {
        var Translate = (function () {
            function Translate(x, y) {
                this.x = x;
                this.y = y;
            }
            Translate.prototype.toString = function () {
                return "translate(" + this.x + "," + this.y + ")";
            };
            return Translate;
        })();
        Transform.Translate = Translate;

        var Scale = (function () {
            function Scale(sx, sy) {
                if (typeof sy === "undefined") { sy = undefined; }
                this.sx = sx;
                this.sy = sy;
            }
            Scale.prototype.toString = function () {
                if (this.sy) {
                    return "scale(" + this.sx + "," + this.sy + ")";
                } else {
                    return "scale(" + this.sx + ")";
                }
            };
            return Scale;
        })();
        Transform.Scale = Scale;

        var Rotate = (function () {
            function Rotate(angle) {
                this.angle = angle;
            }
            Rotate.prototype.toString = function () {
                return "rotate(" + this.angle + ")";
            };
            return Rotate;
        })();
        Transform.Rotate = Rotate;
    })(Svg.Transform || (Svg.Transform = {}));
    var Transform = Svg.Transform;

    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    })();
    Svg.Point = Point;

    var Rect = (function () {
        function Rect(x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.theta = theta;
        }
        Rect.prototype.left = function () {
            return new Point(-this.width / 2 * Math.cos(this.theta) + this.x, this.width / 2 * Math.sin(this.theta) + this.y);
        };

        Rect.prototype.right = function () {
            return new Point(this.width / 2 * Math.cos(this.theta) + this.x, this.width / 2 * Math.sin(this.theta) + this.y);
        };

        Rect.prototype.top = function () {
            return new Point(this.height / 2 * Math.sin(this.theta) + this.x, -this.height / 2 * Math.cos(this.theta) + this.y);
        };

        Rect.prototype.bottom = function () {
            return new Point(this.height / 2 * Math.sin(this.theta) + this.x, this.height / 2 * Math.cos(this.theta) + this.y);
        };

        Rect.prototype.center = function () {
            return new Point(this.x, this.y);
        };

        Rect.left = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(-width / 2 * Math.cos(theta) + x, width / 2 * Math.sin(theta) + y);
        };

        Rect.right = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(width / 2 * Math.cos(theta) + x, width / 2 * Math.sin(theta) + y);
        };

        Rect.top = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(height / 2 * Math.sin(theta) + x, -height / 2 * Math.cos(theta) + y);
        };

        Rect.bottom = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(height / 2 * Math.sin(theta) + x, height / 2 * Math.cos(theta) + y);
        };

        Rect.center = function (x, y, width, height, theta) {
            if (typeof theta === "undefined") { theta = 0; }
            return new Point(x, y);
        };
        return Rect;
    })();
    Svg.Rect = Rect;

    var ViewBox = (function () {
        function ViewBox(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        ViewBox.prototype.toString = function () {
            return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;
        };
        return ViewBox;
    })();
    Svg.ViewBox = ViewBox;
})(Svg || (Svg = {}));
var egrid;
(function (egrid) {
    var Node = (function () {
        function Node(text, weight, original, participants) {
            if (typeof weight === "undefined") { weight = undefined; }
            if (typeof original === "undefined") { original = undefined; }
            if (typeof participants === "undefined") { participants = undefined; }
            this.text = text;
            this.x = 0;
            this.y = 0;
            this.theta = 0;
            this.weight = weight || 1;
            this.key = Node.nextKey++;
            this.active = true;
            this.original = original || false;
            this.participants = participants || [];
        }
        Node.prototype.left = function () {
            return Svg.Rect.left(this.x, this.y, this.width, this.height);
        };

        Node.prototype.right = function () {
            return Svg.Rect.right(this.x, this.y, this.width, this.height);
        };

        Node.prototype.top = function () {
            return Svg.Rect.top(this.x, this.y, this.width, this.height);
        };

        Node.prototype.bottom = function () {
            return Svg.Rect.bottom(this.x, this.y, this.width, this.height);
        };

        Node.prototype.center = function () {
            return Svg.Rect.center(this.x, this.y, this.width, this.height);
        };

        Node.prototype.toString = function () {
            return this.key.toString();
        };
        Node.nextKey = 0;
        return Node;
    })();
    egrid.Node = Node;

    var Link = (function () {
        function Link(source, target, weight) {
            if (typeof weight === "undefined") { weight = undefined; }
            this.source = source;
            this.target = target;
            this.weight = weight || 1;
            this.key = Link.nextKey++;
        }
        Link.prototype.toString = function () {
            return this.key.toString();
        };
        Link.nextKey = 0;
        return Link;
    })();
    egrid.Link = Link;

    var CommandTransaction = (function () {
        function CommandTransaction() {
            this.commands = [];
        }
        CommandTransaction.prototype.execute = function () {
            this.commands.forEach(function (command) {
                command.execute();
            });
        };

        CommandTransaction.prototype.revert = function () {
            this.commands.reverse().forEach(function (command) {
                command.revert();
            });
            this.commands.reverse();
        };

        CommandTransaction.prototype.push = function (command) {
            this.commands.push(command);
        };
        return CommandTransaction;
    })();

    var Grid = (function () {
        function Grid() {
            this.nodes_ = [];
            this.links_ = [];
            this.undoStack = [];
            this.redoStack = [];
        }
        Grid.prototype.appendNode = function (node) {
            var _this = this;
            this.execute({
                execute: function () {
                    node.index = _this.nodes_.length;
                    _this.nodes_.push(node);
                    _this.updateConnections();
                },
                revert: function () {
                    node.index = undefined;
                    _this.nodes_.pop();
                    _this.updateConnections();
                }
            });
        };

        Grid.prototype.appendLink = function (sourceIndex, targetIndex) {
            var _this = this;
            var sourceNode = this.nodes_[sourceIndex];
            var targetNode = this.nodes_[targetIndex];
            var link = new Link(sourceNode, targetNode);
            this.execute({
                execute: function () {
                    _this.links_.push(link);
                    _this.updateLinkIndex();
                    _this.updateConnections();
                },
                revert: function () {
                    _this.links_.pop();
                    _this.updateLinkIndex();
                    _this.updateConnections();
                }
            });
            return link;
        };

        Grid.prototype.removeNode = function (removeNodeIndex) {
            var _this = this;
            var removeNode = this.nodes_[removeNodeIndex];
            var removedLinks;
            var previousLinks;
            this.execute({
                execute: function () {
                    _this.nodes_.splice(removeNodeIndex, 1);
                    previousLinks = _this.links_;
                    _this.links_ = _this.links_.filter(function (link) {
                        return link.source != removeNode && link.target != removeNode;
                    });
                    _this.updateNodeIndex();
                    _this.updateConnections();
                },
                revert: function () {
                    _this.nodes_.splice(removeNodeIndex, 0, removeNode);
                    _this.links_ = previousLinks;
                    _this.updateNodeIndex();
                    _this.updateConnections();
                }
            });
        };

        Grid.prototype.removeLink = function (removeLinkIndex) {
            var _this = this;
            var removeLink = this.links_[removeLinkIndex];
            this.execute({
                execute: function () {
                    _this.links_.splice(removeLinkIndex, 1);
                    _this.updateLinkIndex();
                    _this.updateConnections();
                },
                revert: function () {
                    _this.links_.splice(removeLinkIndex, 0, removeLink);
                    _this.updateLinkIndex();
                    _this.updateConnections();
                }
            });
        };

        Grid.prototype.updateNodeText = function (nodeIndex, newText) {
            var node = this.nodes_[nodeIndex];
            var oldText = node.text;
            this.execute({
                execute: function () {
                    node.text = newText;
                },
                revert: function () {
                    node.text = oldText;
                }
            });
        };

        Grid.prototype.updateLinkWeight = function (linkIndex, newWeight) {
            var link = this.links_[linkIndex];
            var oldWeight = link.weight;
            this.execute({
                execute: function () {
                    link.weight = newWeight;
                },
                revert: function () {
                    link.weight = oldWeight;
                }
            });
        };

        Grid.prototype.incrementLinkWeight = function (linkIndex) {
            this.updateLinkWeight(linkIndex, this.links_[linkIndex].weight + 1);
        };

        Grid.prototype.decrementLinkWeight = function (linkIndex) {
            this.updateLinkWeight(linkIndex, this.links_[linkIndex].weight - 1);
        };

        Grid.prototype.mergeNode = function (fromIndex, toIndex) {
            var _this = this;
            var fromNode = this.nodes_[fromIndex];
            var toNode = this.nodes_[toIndex];
            var newLinks = this.links_.filter(function (link) {
                return (link.source == fromNode && !_this.hasPath(toNode.index, link.target.index)) || (link.target == fromNode && !_this.hasPath(link.source.index, toNode.index));
            }).map(function (link) {
                if (link.source == fromNode) {
                    return new Link(toNode, link.target);
                } else {
                    return new Link(link.source, toNode);
                }
            });
            this.transactionWith(function () {
                _this.updateNodeText(toIndex, toNode.text + ", " + fromNode.text);
                _this.removeNode(fromIndex);
                _this.execute({
                    execute: function () {
                        newLinks.forEach(function (link) {
                            _this.links_.push(link);
                        });
                        _this.updateConnections();
                    },
                    revert: function () {
                        for (var i = 0; i < newLinks.length; ++i) {
                            _this.links_.pop();
                        }
                        _this.updateConnections();
                    }
                });
            });
        };

        Grid.prototype.radderUpAppend = function (fromIndex, newNode) {
            var _this = this;
            this.transactionWith(function () {
                _this.appendNode(newNode);
                _this.radderUp(fromIndex, newNode.index);
            });
        };

        Grid.prototype.radderUp = function (fromIndex, toIndex) {
            return this.appendLink(toIndex, fromIndex);
        };

        Grid.prototype.radderDownAppend = function (fromIndex, newNode) {
            var _this = this;
            this.transactionWith(function () {
                _this.appendNode(newNode);
                _this.radderDown(fromIndex, newNode.index);
            });
        };

        Grid.prototype.radderDown = function (fromIndex, toIndex) {
            return this.appendLink(fromIndex, toIndex);
        };

        Grid.prototype.canUndo = function () {
            return this.undoStack.length > 0;
        };

        Grid.prototype.undo = function () {
            var commands = this.undoStack.pop();
            commands.revert();
            this.redoStack.push(commands);
        };

        Grid.prototype.canRedo = function () {
            return this.redoStack.length > 0;
        };

        Grid.prototype.redo = function () {
            var commands = this.redoStack.pop();
            commands.execute();
            this.undoStack.push(commands);
        };

        Grid.prototype.toJSON = function () {
            return {
                nodes: this.nodes_.map(function (node) {
                    return {
                        text: node.text,
                        weight: node.weight,
                        original: node.original
                    };
                }),
                links: this.links_.map(function (link) {
                    return {
                        source: link.source.index,
                        target: link.target.index,
                        weight: link.weight
                    };
                })
            };
        };

        Grid.prototype.nodes = function (arg) {
            if (arg === undefined) {
                return this.nodes_;
            }
            this.nodes_ = arg;
            this.updateNodeIndex();
            this.updateConnections();
            return this;
        };

        Grid.prototype.findNode = function (text) {
            var result = null;
            this.nodes_.forEach(function (node) {
                if (node.text == text) {
                    result = node;
                }
            });
            return result;
        };

        Grid.prototype.links = function (arg) {
            if (arg === undefined) {
                return this.links_;
            }
            this.links_ = arg;
            this.updateLinkIndex();
            this.updateConnections();
            return this;
        };

        Grid.prototype.link = function (index1, index2) {
            if (typeof index2 === "undefined") { index2 = undefined; }
            if (index2 === undefined) {
                return this.links_[index1];
            } else {
                return this.links_.reduce(function (p, link) {
                    if (link.source.index == index1 && link.target.index == index2) {
                        return link;
                    } else {
                        return p;
                    }
                }, undefined);
            }
        };

        Grid.prototype.layout = function (checkActive, lineUpTop, lineUpBottom) {
            if (typeof checkActive === "undefined") { checkActive = false; }
            if (typeof lineUpTop === "undefined") { lineUpTop = true; }
            if (typeof lineUpBottom === "undefined") { lineUpBottom = true; }
            var nodes = this.nodes_;
            var links = this.links_;
            if (checkActive) {
                nodes = nodes.filter(function (node) {
                    return node.active;
                });
                links = links.filter(function (link) {
                    return link.source.active && link.target.active;
                });
            }

            dagre.layout().nodes(nodes).edges(links).lineUpTop(lineUpTop).lineUpBottom(lineUpBottom).rankDir("LR").rankSep(200).edgeSep(20).run();

            nodes.forEach(function (node) {
                node.x = node.dagre.x;
                node.y = node.dagre.y;
                node.width = node.dagre.width;
                node.height = node.dagre.height;
            });

            links.forEach(function (link) {
                link.previousPoints = link.points;
                link.points = link.dagre.points.map(function (p) {
                    return p;
                });
                link.points.unshift(link.source.right());
                link.points.push(link.target.left());
            });
        };

        Grid.prototype.hasPath = function (fromIndex, toIndex) {
            return this.pathMatrix[fromIndex][toIndex];
        };

        Grid.prototype.hasLink = function (fromIndex, toIndex) {
            return this.linkMatrix[fromIndex][toIndex];
        };

        Grid.prototype.numConnectedNodes = function (index, checkActive) {
            if (typeof checkActive === "undefined") { checkActive = false; }
            var _this = this;
            var result = 0;
            this.nodes_.forEach(function (node, j) {
                if (!checkActive || (checkActive && node.active)) {
                    if (_this.pathMatrix[index][j] || _this.pathMatrix[j][index]) {
                        result += 1;
                    }
                }
            });
            return result;
        };

        Grid.prototype.execute = function (command) {
            var _this = this;
            if (this.transaction) {
                command.execute();
                this.transaction.push(command);
            } else {
                this.transactionWith(function () {
                    _this.execute(command);
                });
            }
        };

        Grid.prototype.transactionWith = function (f) {
            this.beginTransaction();
            f();
            this.commitTransaction();
        };

        Grid.prototype.beginTransaction = function () {
            this.transaction = new CommandTransaction();
        };

        Grid.prototype.commitTransaction = function () {
            this.undoStack.push(this.transaction);
            this.redoStack = [];
            this.transaction = undefined;
        };

        Grid.prototype.rollbackTransaction = function () {
            this.transaction.revert();
            this.transaction = undefined;
        };

        Grid.prototype.updateConnections = function () {
            var _this = this;
            this.linkMatrix = this.nodes_.map(function (_) {
                return _this.nodes_.map(function (_) {
                    return false;
                });
            });
            this.links_.forEach(function (link) {
                _this.linkMatrix[link.source.index][link.target.index] = true;
            });
            this.nodes_.forEach(function (node) {
                node.isTop = node.isBottom = true;
            });
            this.pathMatrix = this.nodes_.map(function (fromNode, fromIndex) {
                return _this.nodes_.map(function (toNode, toIndex) {
                    var checkedFlags = _this.nodes_.map(function (_) {
                        return false;
                    });
                    var front = [fromIndex];
                    while (front.length > 0) {
                        var nodeIndex = front.pop();
                        if (nodeIndex == toIndex) {
                            if (nodeIndex != fromIndex) {
                                fromNode.isBottom = false;
                                toNode.isTop = false;
                            }
                            return true;
                        }
                        if (!checkedFlags[nodeIndex]) {
                            _this.nodes_.forEach(function (_, j) {
                                if (_this.linkMatrix[nodeIndex][j]) {
                                    front.push(j);
                                }
                            });
                        }
                    }
                    return false;
                });
            });
        };

        Grid.prototype.updateNodeIndex = function () {
            this.nodes_.forEach(function (node, i) {
                node.index = i;
            });
        };

        Grid.prototype.updateLinkIndex = function () {
            this.links_.forEach(function (link, i) {
                link.index = i;
            });
        };

        Grid.prototype.updateIndex = function () {
            this.updateNodeIndex();
            this.updateLinkIndex();
        };
        return Grid;
    })();
    egrid.Grid = Grid;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    var DAG = (function () {
        function DAG() {
            this.grid_ = new egrid.Grid;
        }
        DAG.prototype.grid = function () {
            return this.grid_;
        };

        DAG.prototype.nodes = function (arg) {
            if (arg === undefined) {
                return this.grid_.nodes();
            }
            this.grid_.nodes(arg);
            return this;
        };

        DAG.prototype.links = function (arg) {
            if (arg === undefined) {
                return this.grid_.links();
            }
            this.grid_.links(arg);
            return this;
        };

        DAG.prototype.notify = function () {
            if (this.uiCallback) {
                this.uiCallback();
            }
            return this;
        };

        DAG.prototype.registerUiCallback = function (callback) {
            this.uiCallback = callback;
            return this;
        };

        DAG.prototype.undo = function () {
            if (this.grid().canUndo()) {
                this.grid().undo();
                this.draw();
                this.notify();
            }
            return this;
        };

        DAG.prototype.redo = function () {
            if (this.grid().canRedo()) {
                this.grid().redo();
                this.draw();
                this.notify();
            }
            return this;
        };

        DAG.prototype.draw = function () {
            return this;
        };

        DAG.prototype.focusCenter = function () {
            return this;
        };

        DAG.prototype.display = function (regionWidth, regionHeight) {
            if (typeof regionWidth === "undefined") { regionWidth = undefined; }
            if (typeof regionHeight === "undefined") { regionHeight = undefined; }
            return function (selection) {
            };
        };

        DAG.prototype.export = function () {
            return {
                links: this.links().map(function (v, i, a) {
                    return {
                        source: v.source,
                        target: v.target,
                        weight: v.weight
                    };
                }),
                ndoes: this.nodes().map(function (v, i, a) {
                    return {
                        text: v.text,
                        weight: v.weight
                    };
                })
            };
        };
        return DAG;
    })();
    egrid.DAG = DAG;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (ViewMode) {
        ViewMode[ViewMode["Normal"] = 0] = "Normal";
        ViewMode[ViewMode["Edge"] = 1] = "Edge";
    })(egrid.ViewMode || (egrid.ViewMode = {}));
    var ViewMode = egrid.ViewMode;

    (function (InactiveNode) {
        InactiveNode[InactiveNode["Hidden"] = 0] = "Hidden";
        InactiveNode[InactiveNode["Transparent"] = 1] = "Transparent";
    })(egrid.InactiveNode || (egrid.InactiveNode = {}));
    var InactiveNode = egrid.InactiveNode;

    var EgmOption = (function () {
        function EgmOption() {
        }
        EgmOption.default = function () {
            var option = new EgmOption;
            option.viewMode = 0 /* Normal */;
            option.inactiveNode = 1 /* Transparent */;
            option.scalingConnection = true;
            option.lineUpTop = true;
            option.lineUpBottom = true;
            option.showGuide = false;
            return option;
        };
        return EgmOption;
    })();
    egrid.EgmOption = EgmOption;

    (function (Raddering) {
        Raddering[Raddering["RadderUp"] = 0] = "RadderUp";
        Raddering[Raddering["RadderDown"] = 1] = "RadderDown";
    })(egrid.Raddering || (egrid.Raddering = {}));
    var Raddering = egrid.Raddering;

    var EGM = (function (_super) {
        __extends(EGM, _super);
        function EGM() {
            _super.call(this);
            this.removeLinkButtonEnabled = false;
            this.options_ = EgmOption.default();
        }
        EGM.prototype.options = function (arg) {
            if (arg === undefined) {
                return this.options_;
            }
            this.options_ = arg;
            return this;
        };

        EGM.prototype.draw = function () {
            var _this = this;
            var spline = d3.svg.line().x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            }).interpolate("basis");

            var nodes = this.nodes();
            var links = this.links();
            if (this.options_.inactiveNode == 0 /* Hidden */) {
                nodes = nodes.filter(function (d) {
                    return d.active;
                });
                links = links.filter(function (d) {
                    return d.source.active && d.target.active;
                });
            }

            var nodesSelection = this.contentsSelection.select(".nodes").selectAll(".element").data(nodes, Object);
            nodesSelection.exit().remove();
            nodesSelection.enter().append("g").call(this.appendElement());

            var nodeSizeScale = this.nodeSizeScale();
            nodesSelection.each(function (node) {
                var rect = _this.calcRect(node.text);
                var n = _this.grid().numConnectedNodes(node.index, true);
                node.baseWidth = rect.width;
                node.baseHeight = rect.height;
                node.width = node.baseWidth * nodeSizeScale(n);
                node.height = node.baseHeight * nodeSizeScale(n);
            });
            nodesSelection.selectAll("text").text(function (d) {
                return d.text;
            }).attr("x", function (d) {
                return EGM.rx - d.baseWidth / 2;
            }).attr("y", function (d) {
                return EGM.rx;
            }).style("font-size", "2em");
            nodesSelection.selectAll("rect").attr("x", function (d) {
                return -d.baseWidth / 2;
            }).attr("y", function (d) {
                return -d.baseHeight / 2;
            }).attr("rx", function (d) {
                return (d.original || d.isTop || d.isBottom) ? 0 : EGM.rx;
            }).attr("width", function (d) {
                return d.baseWidth;
            }).attr("height", function (d) {
                return d.baseHeight;
            }).style("fill", "none").style("stroke", "purple").style("stroke-width", 5);

            var linksSelection = this.contentsSelection.select(".links").selectAll(".link").data(links, Object);
            linksSelection.exit().remove();
            linksSelection.enter().append("g").classed("link", true).each(function (link) {
                link.points = [link.source.right(), link.target.left()];
            }).call(function (selection) {
                selection.append("path");
                if (_this.removeLinkButtonEnabled) {
                    selection.call(_this.appendRemoveLinkButton());
                }
            });
            linksSelection.style("fill", "none").style("stroke", "purple");

            this.grid().layout(this.options_.inactiveNode == 0 /* Hidden */, this.options_.lineUpTop, this.options_.lineUpBottom);

            this.rootSelection.selectAll(".contents .links .link path").filter(function (link) {
                return link.previousPoints.length != link.points.length;
            }).attr("d", function (link) {
                if (link.points.length > link.previousPoints.length) {
                    while (link.points.length != link.previousPoints.length) {
                        link.previousPoints.unshift(link.previousPoints[0]);
                    }
                } else {
                    link.previousPoints.splice(1, link.previousPoints.length - link.points.length);
                }
                return spline(link.previousPoints);
            });

            var linkWidthScale = this.linkWidthScale();
            var selectedNode = this.selectedNode();
            var transition = this.rootSelection.transition();
            transition.selectAll(".element").attr("opacity", function (node) {
                return node.active ? 1 : 0.3;
            }).attr("transform", function (node) {
                return (new Svg.Transform.Translate(node.center().x, node.center().y)).toString() + (new Svg.Transform.Rotate(node.theta / Math.PI * 180)).toString() + (new Svg.Transform.Scale(nodeSizeScale(_this.grid().numConnectedNodes(node.index, true)))).toString();
            });
            transition.selectAll(".link path").attr("d", function (link) {
                return spline(link.points);
            }).attr("opacity", function (link) {
                return link.source.active && link.target.active ? 1 : 0.3;
            }).attr("stroke-width", function (d) {
                return linkWidthScale(d.weight);
            });
            transition.selectAll(".link .removeLinkButton").attr("transform", function (link) {
                return "translate(" + link.points[1].x + "," + link.points[1].y + ")";
            }).style('visibility', function (link) {
                return link.source == selectedNode || link.target == selectedNode ? 'visible' : 'hidden';
            });
            transition.each("end", function () {
                _this.notify();
            });

            this.rescale();

            this.drawGuide();

            return this;
        };

        EGM.prototype.drawNodeConnection = function () {
            var _this = this;
            var d = this.selectedNode();
            this.rootSelection.selectAll(".connected").classed("connected", false);
            if (d) {
                d3.selectAll(".element").filter(function (d2) {
                    return _this.grid().hasPath(d.index, d2.index) || _this.grid().hasPath(d2.index, d.index);
                }).classed("connected", true);
                d3.selectAll(".link").filter(function (link) {
                    return (_this.grid().hasPath(d.index, link.source.index) && _this.grid().hasPath(d.index, link.target.index)) || (_this.grid().hasPath(link.source.index, d.index) && _this.grid().hasPath(link.target.index, d.index));
                }).classed("connected", true);
                d3.selectAll(".link .removeLinkButton").style('visibility', function (link) {
                    return link.source == d || link.target == d ? 'visible' : 'hidden';
                });
            }
        };

        EGM.prototype.getTextBBox = function (text) {
            return this.rootSelection.select(".measure").text(text).node().getBBox();
        };

        EGM.prototype.calcRect = function (text) {
            var bbox = this.getTextBBox(text);
            return new Svg.Rect(bbox.x, bbox.y, bbox.width + EGM.rx * 2, bbox.height + EGM.rx * 2);
        };

        EGM.prototype.appendElement = function () {
            var _this = this;
            return function (selection) {
                var egm = _this;
                var onElementClick = function () {
                    var selection = d3.select(this);
                    if (selection.classed("selected")) {
                        egm.unselectElement();
                        d3.event.stopPropagation();
                    } else {
                        egm.selectElement(selection);
                        d3.event.stopPropagation();
                    }
                    egm.notify();
                };
                selection.classed("element", true).on("click", onElementClick).on("touchstart", onElementClick);

                selection.append("rect");
                selection.append("text");
            };
        };

        EGM.prototype.appendRemoveLinkButton = function () {
            var _this = this;
            return function (selection) {
                selection.append("g").classed("removeLinkButton", true).attr("transform", function (link) {
                    return "translate(" + link.points[1].x + "," + link.points[1].y + ")";
                }).style('visibility', 'hidden').on("click", function (d) {
                    _this.grid().removeLink(d.index);
                    _this.draw();
                }).call(function (selection) {
                    selection.append("circle").attr("r", 16).attr("fill", "lightgray").attr("stroke", "none");
                    selection.append("image").attr("x", -8).attr("y", -8).attr("width", "16px").attr("height", "16px").attr("xlink:href", "images/glyphicons_207_remove_2.png");
                });
            };
        };

        EGM.prototype.nodeSizeScale = function () {
            var _this = this;
            return d3.scale.linear().domain(d3.extent(this.nodes(), function (node) {
                return _this.grid().numConnectedNodes(node.index, true);
            })).range([1, this.options_.scalingConnection ? 3 : 1]);
        };

        EGM.prototype.linkWidthScale = function () {
            return d3.scale.linear().domain(d3.extent(this.links(), function (link) {
                return link.weight;
            })).range([5, 15]);
        };

        EGM.prototype.rescale = function () {
            var filterdNodes = this.options_.inactiveNode == 0 /* Hidden */ ? this.nodes().filter(function (node) {
                return node.active;
            }) : this.nodes();
            var left = d3.min(filterdNodes, function (node) {
                return node.left().x;
            });
            var right = d3.max(filterdNodes, function (node) {
                return node.right().x;
            });
            var top = d3.min(filterdNodes, function (node) {
                return node.top().y;
            });
            var bottom = d3.max(filterdNodes, function (node) {
                return node.bottom().y;
            });

            var s = d3.min([
                1,
                0.9 * d3.min([
                    this.displayWidth / (right - left),
                    this.displayHeight / (bottom - top)]) || 1
            ]);
            this.contentsZoomBehavior.scaleExtent([s, 1]);
        };

        EGM.prototype.resize = function (width, height) {
            this.displayWidth = width;
            this.displayHeight = height;
            this.rootSelection.attr("viewBox", (new Svg.ViewBox(0, 0, this.displayWidth, this.displayHeight)).toString());
            this.drawGuide();
        };

        EGM.prototype.display = function (regionWidth, regionHeight) {
            if (typeof regionWidth === "undefined") { regionWidth = undefined; }
            if (typeof regionHeight === "undefined") { regionHeight = undefined; }
            var _this = this;
            return function (selection) {
                _this.rootSelection = selection;

                _this.displayWidth = regionWidth || $(window).width();
                _this.displayHeight = regionHeight || $(window).height();
                selection.attr("viewBox", (new Svg.ViewBox(0, 0, _this.displayWidth, _this.displayHeight)).toString());
                selection.append("text").classed("measure", true);

                selection.append("rect").attr("fill", "#fff").attr("width", _this.displayWidth).attr("height", _this.displayHeight);

                _this.contentsSelection = selection.append("g").classed("contents", true);
                _this.contentsSelection.append("g").classed("links", true);
                _this.contentsSelection.append("g").classed("nodes", true);
                _this.createGuide(selection);

                _this.contentsZoomBehavior = d3.behavior.zoom().on("zoom", function () {
                    var translate = new Svg.Transform.Translate(d3.event.translate[0], d3.event.translate[1]);
                    var scale = new Svg.Transform.Scale(d3.event.scale);
                    _this.contentsSelection.attr("transform", translate.toString() + scale.toString());

                    _this.notify();
                });
                selection.call(_this.contentsZoomBehavior);
                selection.on('dblclick.zoom', null);
            };
        };

        EGM.prototype.createGuide = function (selection) {
            var guideSelection = selection.append('g').classed('guide', true).style('visibility', 'hidden');
            guideSelection.append('defs').call(function (selection) {
                selection.append('marker').attr({
                    'id': 'arrow-start-marker',
                    'markerUnits': 'strokeWidth',
                    'markerWidth': 3,
                    'markerHeight': 3,
                    'viewBox': '0 0 10 10',
                    'refX': 5,
                    'refY': 5
                }).append('polygon').attr({
                    'points': '10,0 5,5 10,10 0,5',
                    'fill': 'black'
                });
                selection.append('marker').attr({
                    'id': 'arrow-end-marker',
                    'markerUnits': 'strokeWidth',
                    'markerWidth': 3,
                    'markerHeight': 3,
                    'viewBox': '0 0 10 10',
                    'refX': 5,
                    'refY': 5
                }).append('polygon').attr({
                    'points': '0,0 5,5 0,10 10,5',
                    'fill': 'black'
                });
            });

            guideSelection.append('rect').classed('guide-rect', true).attr({
                'opacity': 0.9,
                'fill': 'lightgray'
            });
            guideSelection.append('path').classed('guide-axis', true).attr({
                'stroke': 'black',
                'stroke-width': 5,
                'marker-start': 'url(#arrow-start-marker)',
                'marker-end': 'url(#arrow-end-marker)'
            });
            guideSelection.append('text').classed('guide-upper-label', true).text('上位項目').attr({
                'y': 25,
                'text-anchor': 'start',
                'font-size': '1.5em'
            });
            guideSelection.append('text').classed('guide-lower-label', true).text('下位項目').attr({
                'y': 25,
                'text-anchor': 'end',
                'font-size': '1.5em'
            });
            var upperElementTexts = [
                '○○だと、なぜいいのですか？',
                '○○が重要な理由は？',
                '○○だとどのように感じますか？',
                '○○であることには、どんないい点があるのですか？'
            ];
            guideSelection.append('g').selectAll('text.guide-upper-question').data(upperElementTexts).enter().append('text').classed('guide-upper-question', true).text(function (d) {
                return d;
            }).attr({
                'y': function (_, i) {
                    return 20 * i + 60;
                },
                'text-anchor': 'start'
            });
            var lowerElementTexts = [
                '○○のどこがいいのですか？',
                'どういった点で○○が重要なのですか？',
                '○○であるためには、具体的に何がどうなっていることが必要だと思いますか？'
            ];
            guideSelection.append('g').selectAll('text.guide-lower-question').data(lowerElementTexts).enter().append('text').classed('guide-lower-question', true).text(function (d) {
                return d;
            }).attr({
                'y': function (_, i) {
                    return 20 * i + 60;
                },
                'text-anchor': 'end'
            });
        };

        EGM.prototype.drawGuide = function () {
            var guideHeight = 130;
            var line = d3.svg.line();
            var axisFrom = [this.displayWidth * 0.1, 35];
            var axisTo = [this.displayWidth * 0.9, 35];
            var guideSelection = this.rootSelection.select('.guide').attr('transform', 'translate(0,' + (this.displayHeight - guideHeight) + ')').style('visibility', this.options_.showGuide ? 'visible' : 'hidden');
            guideSelection.select('.guide-rect').attr({
                'width': this.displayWidth,
                'height': guideHeight
            });
            guideSelection.select('.guide-axis').attr('d', line([axisFrom, axisTo]));
            guideSelection.select('.guide-upper-label').attr('x', axisFrom[0]);
            guideSelection.select('.guide-lower-label').attr('x', axisTo[0]);
            guideSelection.selectAll('.guide-upper-question').attr('x', axisFrom[0]);
            guideSelection.selectAll('.guide-lower-question').attr('x', axisTo[0]);
        };

        EGM.prototype.createNode = function (text) {
            var node = new egrid.Node(text);
            return node;
        };

        EGM.prototype.focusNode = function (node) {
            var s = this.contentsZoomBehavior.scale() || 1;
            var translate = new Svg.Transform.Translate(this.displayWidth / 2 - node.center().x * s, this.displayHeight / 2 - node.center().y * s);
            var scale = new Svg.Transform.Scale(s);
            this.contentsZoomBehavior.translate([translate.x, translate.y]);
            this.contentsSelection.transition().attr("transform", translate.toString() + scale.toString());
        };

        EGM.prototype.focusCenter = function () {
            var left = d3.min(this.nodes(), function (node) {
                return node.left().x;
            });
            var right = d3.max(this.nodes(), function (node) {
                return node.right().x;
            });
            var top = d3.min(this.nodes(), function (node) {
                return node.top().y;
            });
            var bottom = d3.max(this.nodes(), function (node) {
                return node.bottom().y;
            });

            var s = d3.min([
                1, 0.9 * d3.min([
                    this.displayWidth / (right - left),
                    this.displayHeight / (bottom - top)]) || 1]);
            var translate = new Svg.Transform.Translate((this.displayWidth - (right - left) * s) / 2, (this.displayHeight - (bottom - top) * s) / 2);
            var scale = new Svg.Transform.Scale(s);
            this.contentsZoomBehavior.translate([translate.x, translate.y]);
            this.contentsZoomBehavior.scale(scale.sx);
            this.contentsSelection.transition().attr("transform", translate.toString() + scale.toString());
            return this;
        };

        EGM.prototype.selectElement = function (selection) {
            this.rootSelection.selectAll(".selected").classed("selected", false);
            selection.classed("selected", true);
            this.drawNodeConnection();
        };

        EGM.prototype.selectedNode = function () {
            var selection = this.rootSelection.select(".selected");
            return selection.empty() ? null : selection.datum();
        };

        EGM.prototype.unselectElement = function () {
            this.rootSelection.selectAll(".selected").classed("selected", false);
            this.rootSelection.selectAll(".connected").classed("connected", false);
            this.rootSelection.selectAll(".link .removeLinkButton").style('visibility', 'hidden');
        };

        EGM.prototype.dragNode = function () {
            var egm = this;
            var isDroppable_;
            var dragToNode_;
            var dragToOther_;
            var f = function (selection) {
                var from;
                selection.call(d3.behavior.drag().on("dragstart", function () {
                    from = d3.select(".selected");
                    from.classed("dragSource", true);
                    var pos = [from.datum().center().x, from.datum().center().y];
                    egm.rootSelection.select(".contents").append("line").classed("dragLine", true).attr("x1", pos[0]).attr("y1", pos[1]).attr("x2", pos[0]).attr("y2", pos[1]);
                    d3.event.sourceEvent.stopPropagation();
                }).on("drag", function () {
                    var dragLineSelection = egm.rootSelection.select(".dragLine");
                    var x1 = Number(dragLineSelection.attr("x1"));
                    var y1 = Number(dragLineSelection.attr("y1"));
                    var p2 = egm.getPos(egm.rootSelection.select(".contents").node());
                    var x2 = p2.x;
                    var y2 = p2.y;
                    var theta = Math.atan2(y2 - y1, x2 - x1);
                    var r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) - 10;
                    dragLineSelection.attr("x2", x1 + r * Math.cos(theta)).attr("y2", y1 + r * Math.sin(theta));
                    var pos = egm.getPos(document.body);
                    var to = d3.select(document.elementFromPoint(pos.x, pos.y).parentNode);
                    var fromNode = from.datum();
                    var toNode = to.datum();
                    if (to.classed("element") && !to.classed("selected")) {
                        if (isDroppable_ && isDroppable_(fromNode, toNode)) {
                            to.classed("droppable", true);
                        } else {
                            to.classed("undroppable", true);
                        }
                    } else {
                        egm.rootSelection.selectAll(".droppable, .undroppable").classed("droppable", false).classed("undroppable", false);
                    }
                }).on("dragend", function () {
                    var pos = egm.getPos(document.body);
                    var to = d3.select(document.elementFromPoint(pos.x, pos.y).parentNode);
                    var fromNode = from.datum();
                    var toNode = to.datum();
                    if (toNode && fromNode != toNode) {
                        if (dragToNode_ && (!isDroppable_ || isDroppable_(fromNode, toNode))) {
                            dragToNode_(fromNode, toNode);
                        }
                    } else {
                        if (dragToOther_) {
                            dragToOther_(fromNode);
                        }
                    }
                    to.classed("droppable", false);
                    to.classed("undroppable", false);
                    from.classed("dragSource", false);
                    egm.rootSelection.selectAll(".dragLine").remove();
                }));
                return this;
            };
            f.isDroppable_ = function (from, to) {
                return true;
            };
            f.isDroppable = function (f) {
                isDroppable_ = f;
                return this;
            };
            f.dragToNode = function (f) {
                dragToNode_ = f;
                return this;
            };
            f.dragToOther = function (f) {
                dragToOther_ = f;
                return this;
            };
            return f;
        };

        EGM.prototype.raddering = function (selection, type) {
            var _this = this;
            var dragToNode = function (fromNode, toNode) {
                switch (type) {
                    case 0 /* RadderUp */:
                        if (_this.grid().hasLink(toNode.index, fromNode.index)) {
                            var link = _this.grid().link(toNode.index, fromNode.index);
                            _this.grid().incrementLinkWeight(link.index);
                            _this.draw();
                        } else {
                            _this.grid().radderUp(fromNode.index, toNode.index);
                            _this.draw();
                            _this.drawNodeConnection();
                            _this.focusNode(toNode);
                        }
                        break;
                    case 1 /* RadderDown */:
                        if (_this.grid().hasLink(fromNode.index, toNode.index)) {
                            var link = _this.grid().link(fromNode.index, toNode.index);
                            _this.grid().incrementLinkWeight(link.index);
                            _this.draw();
                        } else {
                            _this.grid().radderDown(fromNode.index, toNode.index);
                            _this.draw();
                            _this.drawNodeConnection();
                            _this.focusNode(toNode);
                        }
                        break;
                }
                _this.notify();
            };

            selection.call(this.dragNode().isDroppable(function (fromNode, toNode) {
                return !((type == 0 /* RadderUp */ && _this.grid().hasPath(fromNode.index, toNode.index)) || (type == 1 /* RadderDown */ && _this.grid().hasPath(toNode.index, fromNode.index)));
            }).dragToNode(dragToNode).dragToOther(function (fromNode) {
                var openPrompt;
                switch (type) {
                    case 0 /* RadderUp */:
                        openPrompt = _this.openLadderUpPrompt;
                        break;
                    case 1 /* RadderDown */:
                        openPrompt = _this.openLadderDownPrompt;
                        break;
                }

                openPrompt && openPrompt(function (text) {
                    if (text) {
                        var node;
                        if (node = _this.grid().findNode(text)) {
                            dragToNode(fromNode, node);
                        } else {
                            node = _this.createNode(text);
                            switch (type) {
                                case 0 /* RadderUp */:
                                    _this.grid().radderUpAppend(fromNode.index, node);
                                    break;
                                case 1 /* RadderDown */:
                                    _this.grid().radderDownAppend(fromNode.index, node);
                                    break;
                            }
                            _this.draw();
                            _this.drawNodeConnection();
                            _this.focusNode(node);
                            _this.notify();
                        }
                    }
                });
            }));
        };

        EGM.prototype.getPos = function (container) {
            var xy = d3.event.sourceEvent instanceof MouseEvent ? d3.mouse(container) : d3.touches(container, d3.event.sourceEvent.changedTouches)[0];
            return new Svg.Point(xy[0], xy[1]);
        };

        EGM.prototype.showRemoveLinkButton = function (arg) {
            if (arg === undefined) {
                return this.removeLinkButtonEnabled;
            }
            this.removeLinkButtonEnabled = arg;
            return this;
        };

        EGM.prototype.appendNode = function (text) {
            if (text) {
                var node;
                if (node = this.grid().findNode(text)) {
                } else {
                    node = this.createNode(text);
                    node.original = true;
                    this.grid().appendNode(node);
                    this.draw();
                }
                var addedElement = this.contentsSelection.selectAll(".element").filter(function (node) {
                    return node.text == text;
                });
                this.selectElement(addedElement);
                this.focusNode(addedElement.datum());
                this.notify();
            }
            return this;
        };

        EGM.prototype.removeSelectedNode = function () {
            return this.removeNode(this.selectedNode());
        };

        EGM.prototype.removeNode = function (node) {
            if (node) {
                this.unselectElement();
                this.grid().removeNode(node.index);
                this.draw();
                this.notify();
            }
            return this;
        };

        EGM.prototype.mergeNode = function (fromNode, toNode) {
            if (fromNode && toNode) {
                this.grid().mergeNode(fromNode.index, toNode.index);
                this.draw();
                this.unselectElement();
                this.focusNode(toNode);
                this.notify();
            }
            return this;
        };

        EGM.prototype.editSelectedNode = function (text) {
            return this.editNode(this.selectedNode(), text);
        };

        EGM.prototype.editNode = function (node, text) {
            if (node && text) {
                this.grid().updateNodeText(node.index, text);
                this.draw();
                this.notify();
            }
            return this;
        };
        EGM.rx = 20;
        return EGM;
    })(egrid.DAG);
    egrid.EGM = EGM;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var ParticipantGridController = (function () {
            function ParticipantGridController($q, $stateParams, $scope) {
                var _this = this;
                this.projectKey = $stateParams.projectId;
                this.participantKey = $stateParams.participantId;
                this.egm = new egrid.EGM;

                $q.when(egrid.model.ParticipantGrid.get(this.projectKey, this.participantKey)).then(function (grid) {
                    var nodes = grid.nodes.map(function (d) {
                        return new egrid.Node(d.text, d.weight, d.original);
                    });
                    var links = grid.links.map(function (d) {
                        return new egrid.Link(nodes[d.source], nodes[d.target], d.weight);
                    });
                    _this.egm.nodes(nodes).links(links);
                    _this.draw();
                });
            }
            ParticipantGridController.prototype.draw = function () {
                d3.select("#display").call(this.egm.display($("#display").width(), $("#display").height()));
                this.egm.draw().focusCenter();
            };
            return ParticipantGridController;
        })();
        app.ParticipantGridController = ParticipantGridController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    var EGMUi = (function () {
        function EGMUi() {
            var _this = this;
            this.egm_ = new egrid.EGM();
            this.egm_.registerUiCallback(function () {
                _this.updateNodeButtons();
                _this.updateUndoButton();
                _this.updateRedoButton();
            });
        }
        EGMUi.prototype.egm = function () {
            return this.egm_;
        };

        EGMUi.prototype.appendNodeButton = function () {
            var egmui = this;
            var onClickPrompt;
            var f = function (selection) {
                selection.on("click", function () {
                    onClickPrompt && onClickPrompt(function (text) {
                        egmui.egm().appendNode(text);
                    });
                });
                return this;
            };
            f.onClick = function (f) {
                onClickPrompt = f;
                return this;
            };
            return f;
        };

        EGMUi.prototype.removeNodeButton = function () {
            var egmui = this;
            var f = function (selection) {
                selection.on("click", function () {
                    egmui.egm().removeSelectedNode();
                });
                return this;
            };
            f.onEnable = function (f) {
                egmui.onEnableRemoveNodeButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egmui.onDisableRemoveNodeButton = f;
                return this;
            };
            return f;
        };

        EGMUi.prototype.mergeNodeButton = function () {
            var egmui = this;
            var f = function (selection) {
                selection.call(egmui.egm().dragNode().isDroppable(function (fromNode, toNode) {
                    return !egmui.egm().grid().hasPath(toNode.index, fromNode.index);
                }).dragToNode(function (fromNode, toNode) {
                    egmui.egm().mergeNode(fromNode, toNode);
                }));
                return this;
            };
            f.onEnable = function (f) {
                egmui.onEnableMergeNodeButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egmui.onDisableMergeNodeButton = f;
                return this;
            };
            return f;
        };

        EGMUi.prototype.editNodeButton = function () {
            var egmui = this;
            var onClickPrompt;
            var f = function (selection) {
                selection.on("click", function () {
                    onClickPrompt && onClickPrompt(function (text) {
                        egmui.egm().editSelectedNode(text);
                    });
                });
                return this;
            };
            f.onClick = function (f) {
                onClickPrompt = f;
                return this;
            };
            f.onEnable = function (f) {
                egmui.onEnableEditNodeButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egmui.onDisableEditNodeButton = f;
                return this;
            };
            return f;
        };

        EGMUi.prototype.radderUpButton = function () {
            var egmui = this;
            var f = function (selection) {
                egmui.egm().raddering(selection, 0 /* RadderUp */);
            };
            f.onClick = function (f) {
                egmui.egm().openLadderUpPrompt = f;
                return this;
            };
            f.onEnable = function (f) {
                egmui.onEnableRadderUpButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egmui.onDisableRadderUpButton = f;
                return this;
            };
            return f;
        };

        EGMUi.prototype.radderDownButton = function () {
            var egmui = this;
            var f = function (selection) {
                egmui.egm().raddering(selection, 1 /* RadderDown */);
                return this;
            };
            f.onClick = function (f) {
                egmui.egm().openLadderDownPrompt = f;
                return this;
            };
            f.onEnable = function (f) {
                egmui.onEnableRadderDownButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egmui.onDisableRadderDownButton = f;
                return this;
            };
            return f;
        };

        EGMUi.prototype.saveButton = function () {
            var egmui = this;
            var f = function (selection) {
                selection.on("click", function () {
                    if (egmui.onClickSaveButton) {
                        egmui.onClickSaveButton(egmui.egm().grid().toJSON());
                    }
                });
                return this;
            };
            f.save = function (f) {
                egmui.onClickSaveButton = f;
                return this;
            };
            return f;
        };

        EGMUi.prototype.undoButton = function () {
            var egmui = this;
            var egm = this.egm();
            var f = function (selection) {
                selection.on("click", function () {
                    egm.undo();
                });
                return this;
            };
            f.onEnable = function (f) {
                egmui.onEnableUndoButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egmui.onDisableUndoButton = f;
                return this;
            };
            return f;
        };

        EGMUi.prototype.redoButton = function () {
            var egmui = this;
            var egm = this.egm();
            var f = function (selection) {
                selection.on("click", function () {
                    egm.redo();
                });
                return this;
            };
            f.onEnable = function (f) {
                egmui.onEnableRedoButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egmui.onDisableRedoButton = f;
                return this;
            };
            return f;
        };

        EGMUi.prototype.updateNodeButtons = function () {
            var egm = this.egm();
            var selectedNode = egm.selectedNode();
            if (selectedNode) {
                this.enableNodeButtons();
            } else {
                this.disableNodeButtons();
            }
        };

        EGMUi.prototype.enableNodeButtons = function () {
            var selection = d3.select(".selected");
            this.enableRemoveNodeButton(selection);
            this.enableMergeNodeButton(selection);
            this.enableEditNodeButton(selection);
            this.enableRadderUpButton(selection);
            this.enableRadderDownButton(selection);
        };

        EGMUi.prototype.disableNodeButtons = function () {
            this.disableRemoveNodeButton();
            this.disableMergeNodeButton();
            this.disableEditNodeButton();
            this.disableRadderUpButton();
            this.disableRadderDownButton();
        };

        EGMUi.prototype.enableRadderUpButton = function (selection) {
            if (this.onEnableRadderUpButton) {
                this.onEnableRadderUpButton(selection);
            }
        };

        EGMUi.prototype.disableRadderUpButton = function () {
            if (this.onDisableRadderUpButton) {
                this.onDisableRadderUpButton();
            }
        };

        EGMUi.prototype.enableRadderDownButton = function (selection) {
            if (this.onEnableRadderDownButton) {
                this.onEnableRadderDownButton(selection);
            }
        };

        EGMUi.prototype.disableRadderDownButton = function () {
            if (this.onDisableRadderDownButton) {
                this.onDisableRadderDownButton();
            }
        };

        EGMUi.prototype.enableRemoveNodeButton = function (selection) {
            if (this.onEnableRemoveNodeButton) {
                this.onEnableRemoveNodeButton(selection);
            }
        };

        EGMUi.prototype.disableRemoveNodeButton = function () {
            if (this.onDisableRemoveNodeButton) {
                this.onDisableRemoveNodeButton();
            }
        };

        EGMUi.prototype.enableMergeNodeButton = function (selection) {
            if (this.onEnableMergeNodeButton) {
                this.onEnableMergeNodeButton(selection);
            }
        };

        EGMUi.prototype.disableMergeNodeButton = function () {
            if (this.onDisableMergeNodeButton) {
                this.onDisableMergeNodeButton();
            }
        };

        EGMUi.prototype.enableEditNodeButton = function (selection) {
            if (this.onEnableEditNodeButton) {
                this.onEnableEditNodeButton(selection);
            }
        };

        EGMUi.prototype.disableEditNodeButton = function () {
            if (this.onDisableEditNodeButton) {
                this.onDisableEditNodeButton();
            }
        };

        EGMUi.prototype.enableUndoButton = function () {
            if (this.onEnableUndoButton) {
                this.onEnableUndoButton();
            }
        };

        EGMUi.prototype.disableUndoButton = function () {
            if (this.onDisableUndoButton) {
                this.onDisableUndoButton();
            }
        };

        EGMUi.prototype.enableRedoButton = function () {
            if (this.onEnableRedoButton) {
                this.onEnableRedoButton();
            }
        };

        EGMUi.prototype.disableRedoButton = function () {
            if (this.onDisableRedoButton) {
                this.onDisableRedoButton();
            }
        };

        EGMUi.prototype.updateUndoButton = function () {
            if (this.egm().grid().canUndo()) {
                this.enableUndoButton();
            } else {
                this.disableUndoButton();
            }
        };

        EGMUi.prototype.updateRedoButton = function () {
            if (this.egm().grid().canRedo()) {
                this.enableRedoButton();
            } else {
                this.disableRedoButton();
            }
        };
        return EGMUi;
    })();
    egrid.EGMUi = EGMUi;

    function egmui() {
        return new EGMUi;
    }
    egrid.egmui = egmui;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ProjectGrid = (function () {
            function ProjectGrid(obj) {
                this.projectKey = obj.projectKey;
                this.nodes = obj.nodes;
                this.links = obj.links;
            }
            ProjectGrid.get = function (projectKey) {
                return $.ajax({
                    url: ProjectGrid.url(projectKey),
                    type: 'GET',
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);
                        return new ProjectGrid(obj);
                    }
                });
            };

            ProjectGrid.url = function (projectKey) {
                return '/api/projects/' + projectKey + '/grid';
            };
            return ProjectGrid;
        })();
        model.ProjectGrid = ProjectGrid;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var ParticipantGridEditController = (function () {
            function ParticipantGridEditController($q, $stateParams, $location, $modal, $scope) {
                var _this = this;
                this.$modal = $modal;
                this.$scope = $scope;
                this.disableCompletion = false;
                this.projectKey = $stateParams.projectId;
                this.participantKey = $stateParams.participantId;
                if ($stateParams.disableCompletion) {
                    this.disableCompletion = true;
                }

                var egmui = egrid.egmui();
                this.egm = egmui.egm();
                this.egm.showRemoveLinkButton(true);
                this.egm.options().scalingConnection = false;
                this.egm.options().showGuide = true;
                var calcHeight = function () {
                    return $(window).height() - 100;
                };
                d3.select("#display").attr({
                    width: $(window).width(),
                    height: calcHeight()
                }).call(this.egm.display($(window).width(), calcHeight()));
                d3.select(window).on('resize', function () {
                    var width = $(window).width();
                    var height = calcHeight();
                    d3.select("#display").attr({
                        width: width,
                        height: height
                    });
                    _this.egm.resize(width, height);
                });

                d3.select("#appendNodeButton").call(egmui.appendNodeButton().onClick(function (callback) {
                    return _this.openInputTextDialog(callback);
                }));
                d3.select("#undoButton").call(egmui.undoButton().onEnable(function () {
                    d3.select("#undoButton").classed("disabled", false);
                }).onDisable(function () {
                    d3.select("#undoButton").classed("disabled", true);
                }));
                d3.select("#redoButton").call(egmui.redoButton().onEnable(function () {
                    d3.select("#redoButton").classed("disabled", false);
                }).onDisable(function () {
                    d3.select("#redoButton").classed("disabled", true);
                }));
                d3.select("#saveButton").call(egmui.saveButton().save(function (data) {
                    _this.grid.nodes = data.nodes;
                    _this.grid.links = data.links;
                    $q.when(_this.grid.update()).then(function () {
                        $location.path(egrid.app.Url.participantUrl(_this.projectKey, _this.participantKey));
                    });
                }));

                d3.select("#ladderUpButton").call(egmui.radderUpButton().onClick(function (callback) {
                    return _this.openInputTextDialog(callback);
                }).onEnable(function (selection) {
                    return _this.showNodeController(selection);
                }).onDisable(function () {
                    return _this.hideNodeController();
                }));
                d3.select("#ladderDownButton").call(egmui.radderDownButton().onClick(function (callback) {
                    return _this.openInputTextDialog(callback);
                }).onEnable(function (selection) {
                    return _this.showNodeController(selection);
                }).onDisable(function () {
                    return _this.hideNodeController();
                }));
                d3.select("#removeNodeButton").call(egmui.removeNodeButton().onEnable(function (selection) {
                    return _this.showNodeController(selection);
                }).onDisable(function () {
                    return _this.hideNodeController();
                }));
                d3.select("#mergeNodeButton").call(egmui.mergeNodeButton().onEnable(function (selection) {
                    return _this.showNodeController(selection);
                }).onDisable(function () {
                    return _this.hideNodeController();
                }));
                d3.select("#editNodeButton").call(egmui.editNodeButton().onClick(function (callback) {
                    var node = _this.egm.selectedNode();
                    _this.openInputTextDialog(callback, node.text);
                }).onEnable(function (selection) {
                    return _this.showNodeController(selection);
                }).onDisable(function () {
                    return _this.hideNodeController();
                }));

                $q.when(egrid.model.ParticipantGrid.get(this.projectKey, this.participantKey)).then(function (grid) {
                    _this.grid = grid;
                    var nodes = grid.nodes.map(function (d) {
                        return new egrid.Node(d.text, d.weight, d.original);
                    });
                    var links = grid.links.map(function (d) {
                        return new egrid.Link(nodes[d.source], nodes[d.target], d.weight);
                    });
                    _this.egm.nodes(nodes).links(links).draw().focusCenter();
                });

                $q.when(egrid.model.ProjectGrid.get(this.projectKey)).then(function (grid) {
                    _this.overallNodes = grid.nodes;
                });
            }
            ParticipantGridEditController.prototype.openInputTextDialog = function (callback, initialText) {
                if (typeof initialText === "undefined") { initialText = ''; }
                var _this = this;
                var texts;
                if (this.disableCompletion) {
                    texts = [];
                } else {
                    var textsDict = {};
                    texts = this.overallNodes.map(function (d) {
                        var obj = {
                            text: d.text,
                            weight: d.weight
                        };
                        d.participants.forEach(function (p) {
                            if (p == _this.participantKey) {
                                obj.weight -= 1;
                            }
                        });
                        textsDict[d.text] = obj;
                        return obj;
                    });
                    this.egm.nodes().forEach(function (node) {
                        if (textsDict[node.text]) {
                            textsDict[node.text].weight += 1;
                        } else {
                            texts.push({
                                text: node.text,
                                weight: 1
                            });
                        }
                    });
                    texts.sort(function (t1, t2) {
                        return t2.weight - t1.weight;
                    });
                }
                var m = this.$modal.open({
                    backdrop: true,
                    keyboard: true,
                    backdropClick: true,
                    templateUrl: '/partials/input-text-dialog.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.result = initialText;
                        $scope.texts = texts;
                        $scope.close = function (result) {
                            $modalInstance.close(result);
                        };
                    }
                });
                m.result.then(function (result) {
                    callback(result);
                });
                this.$scope.$apply();
            };

            ParticipantGridEditController.prototype.showNodeController = function (selection) {
                if (!selection.empty()) {
                    var nodeRect = selection.node().getBoundingClientRect();
                    var controllerWidth = $("#nodeController").width();
                    d3.select("#nodeController").classed("invisible", false).style("top", nodeRect.top + nodeRect.height + 10 - 100 + "px").style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px");
                }
            };

            ParticipantGridEditController.prototype.hideNodeController = function () {
                d3.select("#nodeController").classed("invisible", true);
            };

            ParticipantGridEditController.prototype.moveNodeController = function (selection) {
                var nodeRect = selection.node().getBoundingClientRect();
                var controllerWidth = $("#nodeController").width();
                d3.select("#nodeController").style("top", nodeRect.top + nodeRect.height + 10 + "px").style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px");
            };
            return ParticipantGridEditController;
        })();
        app.ParticipantGridEditController = ParticipantGridEditController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ParticipantCollection = (function (_super) {
            __extends(ParticipantCollection, _super);
            function ParticipantCollection() {
                _super.call(this, new egrid.model.Dictionary());
            }
            ParticipantCollection.prototype.query = function (projectKey) {
                var _this = this;
                var $deferred = $.Deferred();
                var k = egrid.model.CollectionBase.pluralize(egrid.model.Participant.type);
                var mapper = function (o) {
                    var item = new egrid.model.Participant(o).load(o);

                    _this.pairs.value.setItem(item.key, item);

                    return item;
                };

                $.ajax({
                    url: egrid.model.Participant.listUrl(projectKey),
                    type: 'GET'
                }).then(function (result) {
                    var objects = JSON.parse(result) || [];

                    objects.map(mapper);

                    window.localStorage.setItem(k, JSON.stringify(_this.pairs));

                    return $deferred.resolve(_this.pairs.value.toArray());
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var objects = window.localStorage.getItem(k) || [];
                    var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

                    $.extend(egrid.model.NotationDeserializer.load(objects), egrid.model.NotationDeserializer.load(unsaved)).map(mapper);

                    return $deferred.resolve(_this.pairs.value.toArray());
                });

                return $deferred.promise();
            };

            ParticipantCollection.prototype.flush = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var k = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(egrid.model.Participant.type);
                var unsavedItems = JSON.parse(window.localStorage.getItem(k)) || {};

                $.when(Object.keys(unsavedItems).map(function (value, index, ar) {
                    var item = new egrid.model.Participant();

                    return item.load(unsavedItems[value]).save();
                })).then(function () {
                    var items = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        items[_i] = arguments[_i + 0];
                    }
                    return $deferred.resolve(_this.toArray());
                }, function () {
                    return $deferred.reject();
                });

                return $deferred.promise();
            };

            ParticipantCollection.prototype.isDirty = function () {
                var k = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(egrid.model.Participant.type);
                var unsavedItems = JSON.parse(window.localStorage.getItem(k)) || {};

                return !!Object.keys(unsavedItems).length;
            };
            return ParticipantCollection;
        })(egrid.model.CollectionBase);
        model.ParticipantCollection = ParticipantCollection;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var PaginationController = (function () {
            function PaginationController() {
                this.currentPage = 1;
                this.reverse = false;
            }
            PaginationController.prototype.changeOrder = function (predicate) {
                if (predicate == this.predicate) {
                    this.reverse = !this.reverse;
                } else {
                    this.currentPage = 1;
                    this.reverse = false;
                    this.predicate = predicate;
                }
            };
            return PaginationController;
        })();
        app.PaginationController = PaginationController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var ParticipantListController = (function (_super) {
            __extends(ParticipantListController, _super);
            function ParticipantListController($q, $stateParams) {
                var _this = this;
                _super.call(this);
                this.participants = new egrid.model.ParticipantCollection();

                this.projectId = $stateParams.projectId;
                this.itemsPerPage = 5;
                this.predicate = 'updatedAt';
                this.reverse = true;

                $q.when(this.participants.query(this.projectId)).then(function (participants) {
                    participants.forEach(function (v) {
                        _this.participants.addItem(v);
                    });

                    if (_this.participants.isDirty())
                        _this.participants.flush().then(function (ps) {
                            ps.forEach(function (p) {
                                _this.participants.addItem(p);
                            });
                        });
                });
            }
            return ParticipantListController;
        })(egrid.app.PaginationController);
        app.ParticipantListController = ParticipantListController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var ProjectController = (function () {
            function ProjectController($q, $stateParams, $state, $modal, $scope) {
                this.$q = $q;
                this.$state = $state;
                this.$modal = $modal;
                this.project = new egrid.model.Project();
                var key = $stateParams.projectId;

                this.$q.when(this.project.get(key)).then(function (p) {
                }, function (jqXHR, textStatus, errorThrown) {
                });
            }
            ProjectController.prototype.update = function () {
                var _this = this;
                this.$q.when(this.project.save()).then(function (project) {
                    _this.project.name = project.name;
                    _this.project.note = project.note;
                });
            };

            ProjectController.prototype.confirm = function () {
                var _this = this;
                var modalInstance = this.$modal.open({
                    templateUrl: '/partials/remove-item-dialog.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.ok = function () {
                            $modalInstance.close();
                        }, $scope.cancel = function () {
                            $modalInstance.dismiss();
                        };
                    }
                });

                modalInstance.result.then(function () {
                    _this.remove();
                });
            };

            ProjectController.prototype.remove = function () {
                var _this = this;
                this.$q.when(this.project.remove()).then(function () {
                    _this.$state.go('projects.all.list');
                });
            };
            return ProjectController;
        })();
        app.ProjectController = ProjectController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var ProjectCreateController = (function () {
            function ProjectCreateController($q, $state) {
                this.$q = $q;
                this.$state = $state;
            }
            ProjectCreateController.prototype.submit = function () {
                var _this = this;
                var project = new egrid.model.Project(this);
                this.$q.when(project.save()).then(function () {
                    _this.$state.go('projects.get.detail', { projectId: project.key });
                }, function () {
                    _this.$state.go('projects.all.list');
                });
            };
            return ProjectCreateController;
        })();
        app.ProjectCreateController = ProjectCreateController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var ProjectGridController = (function () {
            function ProjectGridController($q, $stateParams, $modal, $scope) {
                var _this = this;
                this.$scope = $scope;
                this.filter = {};
                this.participants = new egrid.model.ParticipantCollection();
                this.participantState = {};
                this.projectKey = $stateParams.projectId;

                var egmui = egrid.egmui();
                this.egm = egmui.egm();
                this.egm.showRemoveLinkButton(true);
                this.egm.options().scalingConnection = false;
                var calcHeight = function () {
                    return $(window).height() - 100;
                };
                d3.select("#display").attr({
                    width: $(window).width(),
                    height: calcHeight()
                }).call(this.egm.display($(window).width(), calcHeight()));
                d3.select(window).on('resize', function () {
                    d3.select("#display").attr({
                        width: $(window).width(),
                        height: calcHeight()
                    });
                });

                d3.select("#undoButton").call(egmui.undoButton().onEnable(function () {
                    d3.select("#undoButton").classed("disabled", false);
                }).onDisable(function () {
                    d3.select("#undoButton").classed("disabled", true);
                }));
                d3.select("#redoButton").call(egmui.redoButton().onEnable(function () {
                    d3.select("#redoButton").classed("disabled", false);
                }).onDisable(function () {
                    d3.select("#redoButton").classed("disabled", true);
                }));

                d3.select("#exportSVG").on("click", function () {
                    d3.select(this).attr("href", "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(d3.select("#display").attr("version", "1.1").attr("xmlns", "http://www.w3.org/2000/svg").attr("xmlns:xmlns:xlink", "http://www.w3.org/1999/xlink").node().outerHTML))));
                });

                d3.select("#removeNodeButton").call(egmui.removeNodeButton().onEnable(function (selection) {
                    return _this.showNodeController(selection);
                }).onDisable(function () {
                    return _this.hideNodeController();
                }));
                d3.select("#mergeNodeButton").call(egmui.mergeNodeButton().onEnable(function (selection) {
                    return _this.showNodeController(selection);
                }).onDisable(function () {
                    return _this.hideNodeController();
                }));

                d3.select("#filterButton").on("click", function () {
                    var node = _this.egm.selectedNode();
                    _this.participants.toArray().forEach(function (participant) {
                        if (node) {
                            _this.participantState[participant.key] = node.participants.indexOf(participant.key) >= 0;
                        } else {
                            _this.participantState[participant.key] = false;
                        }
                    });
                    var m = $modal.open({
                        backdrop: true,
                        keyboard: true,
                        backdropClick: true,
                        templateUrl: '/partials/filter-participants-dialog.html',
                        controller: function ($scope, $modalInstance) {
                            $scope.results = _this.filter;
                            $scope.participants = _this.participants;
                            $scope.active = _this.participantState;
                            $scope.close = function () {
                                $modalInstance.close($scope.results);
                            };
                        }
                    });
                    m.result.then(function (result) {
                        _this.egm.nodes().forEach(function (d) {
                            m.active = m.participants.some(function (key) {
                                return result[key];
                            });
                        });
                        _this.egm.draw().focusCenter();
                    });
                    $scope.$apply();
                });

                d3.select("#layoutButton").on("click", function () {
                    var m = $modal.open({
                        backdrop: true,
                        keyboard: true,
                        backdropClick: true,
                        templateUrl: '/partials/setting-dialog.html',
                        controller: function ($scope, $modalInstance) {
                            $scope.options = _this.egm.options();
                            $scope.ViewMode = egrid.ViewMode;
                            $scope.InactiveNode = egrid.InactiveNode;
                            $scope.close = function () {
                                $modalInstance.close();
                            };
                        }
                    });
                    m.result.then(function () {
                        _this.egm.draw();
                    });
                    $scope.$apply();
                });

                $q.when(egrid.model.ProjectGrid.get(this.projectKey)).then(function (grid) {
                    var nodes = grid.nodes.map(function (d) {
                        return new egrid.Node(d.text, d.weight, d.original, d.participants);
                    });
                    var links = grid.links.map(function (d) {
                        return new egrid.Link(nodes[d.source], nodes[d.target], d.weight);
                    });
                    _this.egm.nodes(nodes).links(links).draw().focusCenter();
                });

                $q.when(this.participants.query()).then(function (participants) {
                    participants.forEach(function (v) {
                        _this.participants.addItem(v);

                        _this.participantState[v.key] = false;
                        _this.filter[v.key] = true;
                    });
                });
            }
            ProjectGridController.prototype.showNodeController = function (selection) {
                if (!selection.empty()) {
                    var nodeRect = selection.node().getBoundingClientRect();
                    var controllerWidth = $("#nodeController").width();
                    d3.select("#nodeController").classed("invisible", false).style("top", nodeRect.top + nodeRect.height + 10 - 100 + "px").style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px");
                }
            };

            ProjectGridController.prototype.hideNodeController = function () {
                d3.select("#nodeController").classed("invisible", true);
            };

            ProjectGridController.prototype.moveNodeController = function (selection) {
                var nodeRect = selection.node().getBoundingClientRect();
                var controllerWidth = $("#nodeController").width();
                d3.select("#nodeController").style("top", nodeRect.top + nodeRect.height + 10 + "px").style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px");
            };

            ProjectGridController.prototype.exportJSON = function ($event) {
                $($event.currentTarget).attr("href", "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.egm.export())));
            };
            return ProjectGridController;
        })();
        app.ProjectGridController = ProjectGridController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var ProjectCollection = (function (_super) {
            __extends(ProjectCollection, _super);
            function ProjectCollection() {
                _super.call(this, new egrid.model.Dictionary());
            }
            ProjectCollection.prototype.query = function (key) {
                var _this = this;
                var $deferred = $.Deferred();
                var k = egrid.model.CollectionBase.pluralize(egrid.model.Project.type);
                var mapper = function (o) {
                    var item = new egrid.model.Project().load(o);

                    _this.pairs.value.setItem(item.key, item);

                    return item;
                };

                $.ajax({
                    url: egrid.model.Project.listUrl(),
                    type: 'GET'
                }).then(function (result) {
                    var objects = JSON.parse(result) || [];

                    objects.map(mapper);

                    window.localStorage.setItem(k, JSON.stringify(_this.pairs));

                    return $deferred.resolve(_this.pairs.value.toArray());
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var objects = window.localStorage.getItem(k) || [];
                    var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

                    $.extend(egrid.model.NotationDeserializer.load(objects), egrid.model.NotationDeserializer.load(unsaved)).map(mapper);

                    return $deferred.resolve(_this.pairs.value.toArray());
                });

                return $deferred.promise();
            };

            ProjectCollection.prototype.flush = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var k = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(egrid.model.Project.type);
                var unsavedItems = JSON.parse(window.localStorage.getItem(k)) || {};

                $.when(Object.keys(unsavedItems).map(function (value, index, ar) {
                    var item = new egrid.model.Project();

                    return item.load(unsavedItems[value]).save();
                })).then(function () {
                    var items = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        items[_i] = arguments[_i + 0];
                    }
                    return $deferred.resolve(_this.pairs.value.toArray());
                }, function () {
                    return $deferred.reject();
                });

                return $deferred.promise();
            };

            ProjectCollection.prototype.isDirty = function () {
                var k = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(egrid.model.Project.type);
                var unsavedItems = JSON.parse(window.localStorage.getItem(k)) || {};

                return !!Object.keys(unsavedItems).length;
            };
            return ProjectCollection;
        })(egrid.model.CollectionBase);
        model.ProjectCollection = ProjectCollection;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var ProjectListController = (function (_super) {
            __extends(ProjectListController, _super);
            function ProjectListController($q) {
                var _this = this;
                _super.call(this);
                this.projects = new egrid.model.ProjectCollection();

                this.itemsPerPage = 5;
                this.predicate = 'updatedAt';
                this.reverse = true;

                $q.when(this.projects.query()).then(function (projects) {
                    projects.forEach(function (v) {
                        _this.projects.addItem(v);
                    });

                    if (_this.projects.isDirty())
                        _this.projects.flush().then(function (ps) {
                            ps.forEach(function (p) {
                                _this.projects.addItem(p);
                            });
                        });
                });
            }
            return ProjectListController;
        })(egrid.app.PaginationController);
        app.ProjectListController = ProjectListController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var SemProjectController = (function () {
            function SemProjectController($q, $stateParams, storage) {
                this.semProject = new egrid.model.SemProject({ projectKey: $stateParams.projectId });

                $q.when(this.semProject.get($stateParams.semProjectId)).then(function (p) {
                }, function (jqXHR, textStatus, errorThrown) {
                });
            }
            return SemProjectController;
        })();
        app.SemProjectController = SemProjectController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    var SEM = (function (_super) {
        __extends(SEM, _super);
        function SEM() {
            _super.apply(this, arguments);
            this.removeLinkButtonEnabled = true;
        }
        SEM.prototype.draw = function () {
            var _this = this;
            var spline = d3.svg.line().x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            }).interpolate("basis");

            var nodes = this.activeNodes();
            var links = this.activeLinks();

            var nodesSelection = this.contentsSelection.select(".nodes").selectAll(".element").data(nodes, Object);
            nodesSelection.exit().remove();
            nodesSelection.enter().append("g").call(this.appendElement());

            var nodeSizeScale = this.nodeSizeScale();
            nodesSelection.each(function (node) {
                var rect = _this.calcRect(node.text);
                var n = _this.grid().numConnectedNodes(node.index, true);
                node.baseWidth = rect.width;
                node.baseHeight = rect.height;
                node.width = node.baseWidth * nodeSizeScale(n);
                node.height = node.baseHeight * nodeSizeScale(n);
            });
            nodesSelection.selectAll("text").text(function (d) {
                return d.text;
            }).attr("x", function (d) {
                return SEM.rx - d.baseWidth / 2;
            }).attr("y", function (d) {
                return SEM.rx;
            });
            nodesSelection.selectAll("rect").attr("x", function (d) {
                return -d.baseWidth / 2;
            }).attr("y", function (d) {
                return -d.baseHeight / 2;
            }).attr("rx", function (d) {
                return (d.original || d.isTop || d.isBottom) ? 0 : SEM.rx;
            }).attr("width", function (d) {
                return d.baseWidth;
            }).attr("height", function (d) {
                return d.baseHeight;
            });
            nodesSelection.selectAll(".removeNodeButton").attr("transform", function (d) {
                return "translate(" + (-d.baseWidth / 2) + "," + (-d.baseHeight / 2) + ")";
            });

            var linksSelection = this.contentsSelection.select(".links").selectAll(".link").data(links, Object);
            linksSelection.exit().remove();
            linksSelection.enter().append("g").classed("link", true).each(function (link) {
                link.points = [link.source.right(), link.target.left()];
            }).call(function (selection) {
                selection.append("path");
                if (_this.removeLinkButtonEnabled) {
                    selection.call(_this.appendRemoveLinkButton());
                }
                selection.append("text").style("font-size", "2em").attr("stroke", "gray").attr("fill", "gray").attr("x", 20).attr("y", 30);
            });

            this.grid().layout(true);

            this.rootSelection.selectAll(".contents .links .link path").filter(function (link) {
                return link.previousPoints.length != link.points.length;
            }).attr("d", function (link) {
                if (link.points.length > link.previousPoints.length) {
                    while (link.points.length != link.previousPoints.length) {
                        link.previousPoints.unshift(link.previousPoints[0]);
                    }
                } else {
                    link.previousPoints.splice(1, link.previousPoints.length - link.points.length);
                }
                return spline(link.previousPoints);
            });

            var linkWidthScale = this.linkWidthScale();
            var transition = this.rootSelection.transition();
            transition.selectAll(".element").attr("opacity", function (node) {
                return node.active ? 1 : 0.3;
            }).attr("transform", function (node) {
                return (new Svg.Transform.Translate(node.center().x, node.center().y)).toString() + (new Svg.Transform.Rotate(node.theta / Math.PI * 180)).toString() + (new Svg.Transform.Scale(nodeSizeScale(_this.grid().numConnectedNodes(node.index, true)))).toString();
            });
            transition.selectAll(".link path").attr("d", function (link) {
                return spline(link.points);
            }).attr("opacity", function (link) {
                return link.source.active && link.target.active ? 1 : 0.3;
            }).attr("stroke-width", function (d) {
                return linkWidthScale(Math.abs(d.coef));
            }).attr("stroke", function (d) {
                return d.coef >= 0 ? "blue" : "red";
            });
            var coefFormat = d3.format(".3f");
            transition.selectAll(".link text").attr("transform", function (link) {
                return "translate(" + link.points[1].x + "," + link.points[1].y + ")";
            }).text(function (d) {
                return coefFormat(d.coef);
            });
            transition.selectAll(".link .removeLinkButton").attr("transform", function (link) {
                return "translate(" + link.points[1].x + "," + link.points[1].y + ")";
            });
            transition.each("end", function () {
            });

            this.rescale();

            return this;
        };

        SEM.prototype.getTextBBox = function (text) {
            return this.rootSelection.select(".measure").text(text).node().getBBox();
        };

        SEM.prototype.calcRect = function (text) {
            var bbox = this.getTextBBox(text);
            return new Svg.Rect(bbox.x, bbox.y, bbox.width + SEM.rx * 2, bbox.height + SEM.rx * 2);
        };

        SEM.prototype.appendElement = function () {
            var _this = this;
            return function (selection) {
                selection.classed("element", true);
                selection.append("rect");
                selection.append("text");
                selection.append("g").classed("removeNodeButton", true).on("click", function (d) {
                    d.active = false;
                    _this.draw();
                    _this.notify();
                }).call(function (selection) {
                    selection.append("circle").attr("r", 16).attr("fill", "lightgray").attr("stroke", "none");
                    selection.append("image").attr("x", -8).attr("y", -8).attr("width", "16px").attr("height", "16px").attr("xlink:href", "images/glyphicons_207_remove_2.png");
                });
                selection.call(_this.dragNode().isDroppable(function (fromNode, toNode) {
                    return fromNode != toNode && !_this.grid().hasPath(fromNode.index, toNode.index);
                }).dragToNode(function (fromNode, toNode) {
                    var link = _this.grid().radderUp(fromNode.index, toNode.index);
                    link.coef = 0;
                    _this.draw();
                    _this.notify();
                }));
            };
        };

        SEM.prototype.appendRemoveLinkButton = function () {
            var _this = this;
            return function (selection) {
                selection.append("g").classed("removeLinkButton", true).attr("transform", function (link) {
                    return "translate(" + link.points[1].x + "," + link.points[1].y + ")";
                }).on("click", function (d) {
                    _this.grid().removeLink(d.index);
                    _this.draw();
                    _this.notify();
                }).call(function (selection) {
                    selection.append("circle").attr("r", 16).attr("fill", "lightgray").attr("stroke", "none");
                    selection.append("image").attr("x", -8).attr("y", -8).attr("width", "16px").attr("height", "16px").attr("xlink:href", "images/glyphicons_207_remove_2.png");
                });
            };
        };

        SEM.prototype.nodeSizeScale = function () {
            var _this = this;
            return d3.scale.linear().domain(d3.extent(this.nodes(), function (node) {
                return _this.grid().numConnectedNodes(node.index, true);
            })).range([1, 1]);
        };

        SEM.prototype.linkWidthScale = function () {
            return d3.scale.linear().domain([
                0, d3.max(this.activeLinks(), function (link) {
                    return Math.abs(link.coef);
                })]).range([5, 15]);
        };

        SEM.prototype.rescale = function () {
            var filterdNodes = this.nodes().filter(function (node) {
                return node.active;
            });
            var left = d3.min(filterdNodes, function (node) {
                return node.left().x;
            });
            var right = d3.max(filterdNodes, function (node) {
                return node.right().x;
            });
            var top = d3.min(filterdNodes, function (node) {
                return node.top().y;
            });
            var bottom = d3.max(filterdNodes, function (node) {
                return node.bottom().y;
            });

            var s = d3.min([
                1,
                0.9 * d3.min([
                    this.displayWidth / (right - left),
                    this.displayHeight / (bottom - top)]) || 1
            ]);
            this.contentsZoomBehavior.scaleExtent([s, 1]);
        };

        SEM.prototype.display = function (regionWidth, regionHeight) {
            if (typeof regionWidth === "undefined") { regionWidth = undefined; }
            if (typeof regionHeight === "undefined") { regionHeight = undefined; }
            var _this = this;
            return function (selection) {
                _this.rootSelection = selection;

                _this.displayWidth = regionWidth || $(window).width();
                _this.displayHeight = regionHeight || $(window).height();
                selection.attr("viewBox", (new Svg.ViewBox(0, 0, _this.displayWidth, _this.displayHeight)).toString());
                selection.append("text").classed("measure", true);

                selection.append("rect").attr("fill", "#fff").attr("width", _this.displayWidth).attr("height", _this.displayHeight);

                _this.contentsSelection = selection.append("g").classed("contents", true);
                _this.contentsSelection.append("g").classed("links", true);
                _this.contentsSelection.append("g").classed("nodes", true);

                _this.contentsZoomBehavior = d3.behavior.zoom().on("zoom", function () {
                    var translate = new Svg.Transform.Translate(d3.event.translate[0], d3.event.translate[1]);
                    var scale = new Svg.Transform.Scale(d3.event.scale);
                    _this.contentsSelection.attr("transform", translate.toString() + scale.toString());
                });
                selection.call(_this.contentsZoomBehavior);
            };
        };

        SEM.prototype.focusCenter = function () {
            var left = d3.min(this.nodes(), function (node) {
                return node.left().x;
            });
            var right = d3.max(this.nodes(), function (node) {
                return node.right().x;
            });
            var top = d3.min(this.nodes(), function (node) {
                return node.top().y;
            });
            var bottom = d3.max(this.nodes(), function (node) {
                return node.bottom().y;
            });

            var s = d3.min([
                1, 0.9 * d3.min([
                    this.displayWidth / (right - left),
                    this.displayHeight / (bottom - top)]) || 1]);
            var translate = new Svg.Transform.Translate((this.displayWidth - (right - left) * s) / 2, (this.displayHeight - (bottom - top) * s) / 2);
            var scale = new Svg.Transform.Scale(s);
            this.contentsZoomBehavior.translate([translate.x, translate.y]);
            this.contentsZoomBehavior.scale(scale.sx);
            this.contentsSelection.transition().attr("transform", translate.toString() + scale.toString());
            return this;
        };

        SEM.prototype.activeNodes = function () {
            return this.nodes().filter(function (d) {
                return d.active;
            });
        };

        SEM.prototype.activeLinks = function () {
            return this.links().filter(function (d) {
                return d.source.active && d.target.active;
            });
        };

        SEM.prototype.dragNode = function () {
            var egm = this;
            var isDroppable_;
            var dragToNode_;
            var dragToOther_;
            var f = function (selection) {
                var from;
                selection.call(d3.behavior.drag().on("dragstart", function () {
                    from = d3.select(document.elementFromPoint(d3.event.sourceEvent.x, d3.event.sourceEvent.y));
                    from.classed("dragSource", true);
                    var pos = [from.datum().center().x, from.datum().center().y];
                    egm.rootSelection.select(".contents").append("line").classed("dragLine", true).attr("x1", pos[0]).attr("y1", pos[1]).attr("x2", pos[0]).attr("y2", pos[1]);
                    d3.event.sourceEvent.stopPropagation();
                }).on("drag", function () {
                    var dragLineSelection = egm.rootSelection.select(".dragLine");
                    var x1 = Number(dragLineSelection.attr("x1"));
                    var y1 = Number(dragLineSelection.attr("y1"));
                    var p2 = egm.getPos(egm.rootSelection.select(".contents").node());
                    var x2 = p2.x;
                    var y2 = p2.y;
                    var theta = Math.atan2(y2 - y1, x2 - x1);
                    var r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) - 10;
                    dragLineSelection.attr("x2", x1 + r * Math.cos(theta)).attr("y2", y1 + r * Math.sin(theta));
                    var to = d3.select(document.elementFromPoint(d3.event.sourceEvent.x, d3.event.sourceEvent.y).parentNode);
                    var fromNode = from.datum();
                    var toNode = to.datum();
                    if (to.classed("element") && !to.classed("selected")) {
                        if (isDroppable_ && isDroppable_(fromNode, toNode)) {
                            to.classed("droppable", true);
                        } else {
                            to.classed("undroppable", true);
                        }
                    } else {
                        egm.rootSelection.selectAll(".droppable, .undroppable").classed("droppable", false).classed("undroppable", false);
                    }
                }).on("dragend", function () {
                    var to = d3.select(document.elementFromPoint(d3.event.sourceEvent.x, d3.event.sourceEvent.y).parentNode);
                    var fromNode = from.datum();
                    var toNode = to.datum();
                    if (toNode && fromNode != toNode) {
                        if (dragToNode_ && (!isDroppable_ || isDroppable_(fromNode, toNode))) {
                            dragToNode_(fromNode, toNode);
                        }
                    } else {
                        if (dragToOther_) {
                            dragToOther_(fromNode);
                        }
                    }
                    to.classed("droppable", false);
                    to.classed("undroppable", false);
                    from.classed("dragSource", false);
                    egm.rootSelection.selectAll(".dragLine").remove();
                }));
                return this;
            };
            f.isDroppable_ = function (from, to) {
                return true;
            };
            f.isDroppable = function (f) {
                isDroppable_ = f;
                return this;
            };
            f.dragToNode = function (f) {
                dragToNode_ = f;
                return this;
            };
            f.dragToOther = function (f) {
                dragToOther_ = f;
                return this;
            };
            return f;
        };

        SEM.prototype.getPos = function (container) {
            var xy = d3.event.sourceEvent instanceof MouseEvent ? d3.mouse(container) : d3.touches(container, d3.event.sourceEvent.changedTouches)[0];
            return new Svg.Point(xy[0], xy[1]);
        };

        SEM.prototype.appendNode = function (text) {
            if (text) {
                var node;
                if (node = this.grid().findNode(text)) {
                } else {
                    node = this.createNode(text);
                    node.original = true;
                    this.grid().appendNode(node);
                    this.draw();
                }
                var addedElement = this.contentsSelection.selectAll(".element").filter(function (node) {
                    return node.text == text;
                });

                this.notify();
            }
            return this;
        };

        SEM.prototype.createNode = function (text) {
            var node = new egrid.Node(text);
            node.factor = true;
            return node;
        };
        SEM.rx = 20;
        return SEM;
    })(egrid.DAG);
    egrid.SEM = SEM;

    function sem() {
        return new SEM;
    }
    egrid.sem = sem;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var SemProjectAnalysisController = (function () {
            function SemProjectAnalysisController() {
            }
            return SemProjectAnalysisController;
        })();
        app.SemProjectAnalysisController = SemProjectAnalysisController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var SemProjectCreateController = (function () {
            function SemProjectCreateController($q, $stateParams, $state, $timeout) {
                this.$q = $q;
                this.$state = $state;
                this.$timeout = $timeout;
                this.projectKey = $stateParams.projectId;
            }
            SemProjectCreateController.prototype.submit = function () {
                var _this = this;
                var semProject = new egrid.model.SemProject(this);
                this.$q.when(semProject.save()).then(function () {
                    _this.$timeout(function () {
                        _this.$state.go('projects.get.analyses.all.list');
                    }, 200);
                });
            };
            return SemProjectCreateController;
        })();
        app.SemProjectCreateController = SemProjectCreateController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var SemProjectQuestionnaire = (function () {
            function SemProjectQuestionnaire(obj) {
                this.description = obj.description;
                this.items = obj.items;
                this.projectKey = obj.projectKey;
                this.semProjectKey = obj.semProjectKey;
                this.title = obj.title;
            }
            SemProjectQuestionnaire.prototype.save = function () {
                var _this = this;
                return $.ajax({
                    url: this.url(),
                    type: 'PUT',
                    dataFilter: function (data) {
                        return _this;
                    }
                });
            };

            SemProjectQuestionnaire.prototype.url = function () {
                return SemProjectQuestionnaire.url(this.projectKey, this.semProjectKey);
            };

            SemProjectQuestionnaire.get = function (projectKey, semProjectKey) {
                return $.ajax({
                    url: SemProjectQuestionnaire.url(projectKey, semProjectKey),
                    type: 'GET',
                    dataFilter: function (data) {
                        var obj = JSON.parse(data);
                        return new SemProjectQuestionnaire(obj);
                    }
                });
            };

            SemProjectQuestionnaire.url = function (projectKey, semProjectKey) {
                return '/api/projects/' + projectKey + '/sem-project/' + semProjectKey + '/questionnaire';
            };
            return SemProjectQuestionnaire;
        })();
        model.SemProjectQuestionnaire = SemProjectQuestionnaire;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var SemProjectQuestionnaireEditController = (function () {
            function SemProjectQuestionnaireEditController($q, $stateParams, $location) {
                var _this = this;
                this.$q = $q;
                this.$location = $location;
                this.projectKey = $stateParams.projectId;
                this.semProjectKey = $stateParams.semProjectId;
                this.data = new egrid.model.SemProjectQuestionnaire({
                    projectKey: this.projectKey,
                    semProjectKey: this.semProjectKey
                });

                this.egm = new egrid.EGM;
                this.overallEgm = new egrid.EGM;

                $q.when(egrid.model.ProjectGrid.get(this.projectKey)).then(function (grid) {
                    var width = $("#sem-questionnaire-deisgn-display").width();
                    var height = $("#sem-questionnaire-deisgn-display").height();
                    d3.select("#sem-questionnaire-design-display svg").call(_this.egm.display(width, height));
                    var nodes = grid.nodes.map(function (d) {
                        return new egrid.Node(d.text, d.weight, d.original, d.participants);
                    });
                    var links = grid.links.map(function (d) {
                        return new egrid.Link(nodes[d.source], nodes[d.target], d.weight);
                    });
                    _this.overallEgm.nodes(nodes).links(links);
                    _this.items = nodes.map(function (node) {
                        return {
                            text: node.text,
                            weight: node.weight,
                            checked: false,
                            title: node.text,
                            description: node.text + 'を5段階で評価してください。\n1:悪い 5:良い'
                        };
                    });
                    _this.items.sort(function (item1, item2) {
                        return item2.weight - item1.weight;
                    });
                });
            }
            SemProjectQuestionnaireEditController.prototype.updateItems = function () {
                var _this = this;
                var itemDict = {};
                this.items.forEach(function (item) {
                    itemDict[item.text] = item.checked;
                });
                this.data.items = this.items.filter(function (item) {
                    return item.checked;
                });
                var nodes = [];
                var links = [];
                this.overallEgm.nodes().forEach(function (node) {
                    if (itemDict[node.text]) {
                        var newNode = new egrid.Node(node.text);
                        newNode.index = node.index;
                        nodes.push(newNode);
                    }
                });
                nodes.forEach(function (node1) {
                    nodes.forEach(function (node2) {
                        if (node1.index != node2.index && _this.overallEgm.grid().hasPath(node1.index, node2.index)) {
                            links.push(new egrid.Link(node1, node2));
                        }
                    });
                });
                this.egm.nodes(nodes).links(links).draw().focusCenter();
            };

            SemProjectQuestionnaireEditController.prototype.submit = function () {
                this.$q.when(this.data.save()).then(function () {
                });
            };
            return SemProjectQuestionnaireEditController;
        })();
        app.SemProjectQuestionnaireEditController = SemProjectQuestionnaireEditController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (model) {
        var SemProjectCollection = (function (_super) {
            __extends(SemProjectCollection, _super);
            function SemProjectCollection() {
                _super.call(this, new egrid.model.Dictionary());
            }
            SemProjectCollection.prototype.query = function (projectKey) {
                var _this = this;
                var $deferred = $.Deferred();
                var k = egrid.model.CollectionBase.pluralize(egrid.model.SemProject.type);
                var mapper = function (o) {
                    var item = new egrid.model.SemProject(o).load(o);

                    _this.pairs.value.setItem(item.key, item);

                    return item;
                };

                $.ajax({
                    url: egrid.model.SemProject.listUrl(projectKey),
                    type: 'GET'
                }).then(function (result) {
                    var objects = JSON.parse(result) || [];

                    objects.map(mapper);

                    window.localStorage.setItem(k, JSON.stringify(_this.pairs));

                    return $deferred.resolve(_this.pairs.value.toArray());
                }, function () {
                    var reasons = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        reasons[_i] = arguments[_i + 0];
                    }
                    var objects = window.localStorage.getItem(k) || [];
                    var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

                    $.extend(egrid.model.NotationDeserializer.load(objects), egrid.model.NotationDeserializer.load(unsaved)).map(mapper);

                    return $deferred.resolve(_this.pairs.value.toArray());
                });

                return $deferred.promise();
            };

            SemProjectCollection.prototype.flush = function () {
                var _this = this;
                var $deferred = $.Deferred();
                var k = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(egrid.model.SemProject.type);
                var unsavedItems = JSON.parse(window.localStorage.getItem(k)) || {};

                $.when(Object.keys(unsavedItems).map(function (value, index, ar) {
                    var item = new egrid.model.SemProject();

                    return item.load(unsavedItems[value]).save();
                })).then(function () {
                    var items = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        items[_i] = arguments[_i + 0];
                    }
                    return $deferred.resolve(_this.toArray());
                }, function () {
                    return $deferred.reject();
                });

                return $deferred.promise();
            };

            SemProjectCollection.prototype.isDirty = function () {
                var k = 'unsavedItems.' + egrid.model.CollectionBase.pluralize(egrid.model.SemProject.type);
                var unsavedItems = JSON.parse(window.localStorage.getItem(k)) || {};

                return !!Object.keys(unsavedItems).length;
            };
            return SemProjectCollection;
        })(egrid.model.CollectionBase);
        model.SemProjectCollection = SemProjectCollection;
    })(egrid.model || (egrid.model = {}));
    var model = egrid.model;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        var SemProjectListController = (function () {
            function SemProjectListController($q, $stateParams, $state, $log) {
                var _this = this;
                this.$q = $q;
                this.$state = $state;
                this.$log = $log;
                this.semProjects = new egrid.model.SemProjectCollection();
                this.projectId = $stateParams.projectId;

                this.$q.when(this.semProjects.query(this.projectId)).then(function (semProjects) {
                    semProjects.forEach(function (v) {
                        _this.semProjects.addItem(v);
                    });

                    if (_this.semProjects.isDirty())
                        _this.semProjects.flush().then(function (ps) {
                            ps.forEach(function (p) {
                                _this.semProjects.addItem(p);
                            });
                        });
                });
            }
            return SemProjectListController;
        })();
        app.SemProjectListController = SemProjectListController;
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
var egrid;
(function (egrid) {
    (function (app) {
        angular.module('collaboegm', ['paginator', 'ui.router', "ui.bootstrap", "pascalprecht.translate"]).directive('focusMe', [
            '$timeout', function ($timeout) {
                return {
                    link: function (scope, element, attrs, model) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                };
            }]).config([
            '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
                $stateProvider.state('projects', {
                    abstract: true
                }).state('projects.all', {
                    abstract: true,
                    url: egrid.app.Url.projectListUrlBase + '/all',
                    views: {
                        '@': {
                            templateUrl: '/partials/projects/projects.html'
                        }
                    }
                }).state('projects.all.create', {
                    url: '/create',
                    views: {
                        'content@projects.all': {
                            controller: 'ProjectCreateController as newProject',
                            templateUrl: '/partials/projects/create.html'
                        }
                    }
                }).state('projects.all.list', {
                    url: '/list',
                    views: {
                        'content@projects.all': {
                            controller: 'ProjectListController as ctrl',
                            templateUrl: '/partials/projects/list.html'
                        }
                    }
                }).state('projects.get', {
                    abstract: true,
                    url: egrid.app.Url.projectUrlBase,
                    views: {
                        '@': {
                            controller: 'ProjectController as ctrl',
                            templateUrl: '/partials/project/project.html'
                        }
                    }
                }).state('projects.get.analyses', {
                    abstract: true,
                    url: '/sem-projects'
                }).state('projects.get.analyses.all', {
                    abstract: true,
                    url: '/all',
                    views: {
                        'content@projects.get': {
                            templateUrl: '/partials/project/analyses/analyses.html'
                        }
                    }
                }).state('projects.get.analyses.all.create', {
                    url: '/create',
                    views: {
                        'content@projects.get.analyses.all': {
                            templateUrl: '/partials/project/analyses/create.html'
                        }
                    }
                }).state('projects.get.analyses.all.list', {
                    url: '/list',
                    views: {
                        'content@projects.get.analyses.all': {
                            controller: 'SemProjectListController as ctrl',
                            templateUrl: '/partials/project/analyses/list.html'
                        }
                    }
                }).state('projects.get.analyses.get', {
                    abstract: true,
                    url: '/:semProjectId',
                    views: {
                        '@': {
                            controller: 'SemProjectController as semProject',
                            templateUrl: '/partials/project/analyses/analysis/analysis.html'
                        },
                        'content@projects.get.analyses.get': {
                            controller: 'SemProjectQuestionnaireEditController as questionnaire'
                        }
                    }
                }).state('projects.get.analyses.get.analysis', {
                    url: '/analysis',
                    views: {
                        'content@projects.get.analyses.get': {
                            templateUrl: '/partials/project/analyses/analysis/analyses.html'
                        }
                    }
                }).state('projects.get.analyses.get.design', {
                    url: '/design',
                    views: {
                        'content@projects.get.analyses.get': {
                            templateUrl: '/partials/project/analyses/analysis/design.html'
                        }
                    }
                }).state('projects.get.analyses.get.questionnaire', {
                    url: '/questionnaire',
                    views: {
                        'content@projects.get.analyses.get': {
                            templateUrl: '/partials/project/analyses/analysis/questionnaire.html'
                        }
                    }
                }).state('projects.get.collaborators', {
                    abstract: true,
                    url: '/collaborators'
                }).state('projects.get.collaborators.all', {
                    abstract: true,
                    url: '/all',
                    views: {
                        'content@projects.get': {
                            templateUrl: '/partials/project/collaborators/collaborators.html'
                        }
                    }
                }).state('projects.get.collaborators.all.create', {
                    url: '/create',
                    views: {
                        'c@projects.get.collaborators.all': {
                            controller: 'CollaboratorCreateController as newCollaborator',
                            templateUrl: '/partials/project/collaborators/create.html'
                        }
                    }
                }).state('projects.get.collaborators.all.list', {
                    url: '/list',
                    views: {
                        'c@projects.get.collaborators.all': {
                            controller: 'CollaboratorListController as collaborators',
                            templateUrl: '/partials/project/collaborators/list.html'
                        }
                    }
                }).state('projects.get.detail', {
                    url: '/detail',
                    views: {
                        'content@projects.get': {
                            templateUrl: '/partials/project/detail.html'
                        }
                    }
                }).state('projects.get.evaluation', {
                    url: '/evaluation',
                    views: {
                        'content@projects.get': {
                            templateUrl: '/partials/project/evaluation.html'
                        }
                    }
                }).state('projects.get.grid', {
                    url: '/grid',
                    views: {
                        '@': {
                            controller: 'ProjectGridController as projectGrid',
                            templateUrl: '/partials/egm-show-all.html'
                        }
                    }
                }).state('projects.get.participants', {
                    abstract: true,
                    url: '/participants'
                }).state('projects.get.participants.all', {
                    abstract: true,
                    url: '/all',
                    views: {
                        'content@projects.get': {
                            templateUrl: '/partials/project/participants/participants.html'
                        }
                    }
                }).state('projects.get.participants.all.create', {
                    url: '/create',
                    views: {
                        'content@projects.get.participants.all': {
                            controller: 'ParticipantCreateController as newParticipant',
                            templateUrl: '/partials/project/participants/create.html'
                        }
                    }
                }).state('projects.get.participants.all.list', {
                    url: '/list',
                    views: {
                        'content@projects.get.participants.all': {
                            controller: 'ParticipantListController as ctrl',
                            templateUrl: '/partials/project/participants/list.html'
                        }
                    }
                }).state('projects.get.participants.get', {
                    abstract: true,
                    url: '/:participantId',
                    views: {
                        '@': {
                            controller: 'ParticipantController as ctrl',
                            templateUrl: '/partials/project/participants/participant/participant.html'
                        }
                    }
                }).state('projects.get.participants.get.detail', {
                    url: '/detail',
                    views: {
                        'content@projects.get.participants.get': {
                            templateUrl: '/partials/project/participants/participant/detail.html'
                        }
                    }
                }).state('projects.get.participants.get.evaluation', {
                    url: '/evaluation',
                    views: {
                        'content@projects.get.participants.get': {
                            templateUrl: '/partials/project/participants/participant/evaluation.html'
                        }
                    }
                }).state('projects.get.participants.get.grid', {
                    url: '/grid?disableCompletion',
                    views: {
                        '@': {
                            controller: 'ParticipantGridEditController as participantGrid',
                            templateUrl: '/partials/egm-edit.html'
                        }
                    }
                }).state("/help", {
                    templateUrl: '/partials/help.html'
                }).state("/about", {
                    templateUrl: '/partials/about.html'
                });

                $urlRouterProvider.otherwise(egrid.app.Url.projectListUrlBase + '/all/list');
            }]).filter('count', function () {
            return function (input) {
                return input.length;
            };
        }).config([
            "$translateProvider", function ($translateProvider) {
                $translateProvider.useStaticFilesLoader({
                    prefix: 'locations/',
                    suffix: '.json'
                }).fallbackLanguage("en").preferredLanguage("ja");
            }]).controller('CollaboratorCreateController', ['$q', '$stateParams', '$state', '$timeout', egrid.app.CollaboratorCreateController]).controller('CollaboratorListController', ['$q', '$stateParams', '$state', '$log', '$scope', '$modal', egrid.app.CollaboratorListController]).controller('ParticipantController', ['$q', '$stateParams', '$scope', '$state', '$modal', egrid.app.ParticipantController]).controller('ParticipantCreateController', ['$q', '$stateParams', '$state', egrid.app.ParticipantCreateController]).controller('ParticipantGridController', ['$q', '$stateParams', '$scope', egrid.app.ParticipantGridController]).controller('ParticipantGridEditController', ['$q', '$stateParams', '$location', '$modal', '$scope', egrid.app.ParticipantGridEditController]).controller('ParticipantListController', ['$q', '$stateParams', egrid.app.ParticipantListController]).controller('ProjectController', ['$q', '$stateParams', '$state', '$modal', '$scope', egrid.app.ProjectController]).controller('ProjectCreateController', ['$q', '$state', egrid.app.ProjectCreateController]).controller('ProjectGridController', ['$q', '$stateParams', '$modal', '$scope', egrid.app.ProjectGridController]).controller('ProjectListController', ['$q', egrid.app.ProjectListController]).controller('SemProjectController', ['$q', '$stateParams', egrid.app.SemProjectController]).controller('SemProjectAnalysisController', ['$q', '$stateParams', egrid.app.SemProjectAnalysisController]).controller('SemProjectCreateController', ['$q', '$stateParams', '$state', '$timeout', egrid.app.SemProjectCreateController]).controller('SemProjectListController', ['$q', '$stateParams', '$state', '$log', egrid.app.SemProjectListController]).controller('SemProjectQuestionnaireEditController', ['$q', '$stateParams', egrid.app.SemProjectQuestionnaireEditController]).run([
            '$rootScope', '$translate', '$http', function ($rootScope, $translate, $http) {
                $rootScope.Url = egrid.app.Url;

                $rootScope.changeLanguage = function (langKey) {
                    $translate.uses(langKey);
                    $http({
                        method: "POST",
                        url: '/api/users',
                        data: {
                            location: langKey
                        }
                    });
                };

                $http.get("/api/users").success(function (user) {
                    $rootScope.user = user;
                    $translate.uses(user.location);
                });

                var dest_url = "/";
                $http.get("/api/users/logout?dest_url=" + encodeURIComponent(dest_url)).success(function (data) {
                    $rootScope.logoutUrl = data.logout_url;
                });
            }]);
    })(egrid.app || (egrid.app = {}));
    var app = egrid.app;
})(egrid || (egrid = {}));
