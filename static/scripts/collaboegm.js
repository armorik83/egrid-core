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
/// <reference path="dagre.d.ts"/>
/// <reference path="svg.ts"/>
var Egm;
(function (Egm) {
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
    Egm.Node = Node;

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
    Egm.Link = Link;

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
            this.appendLink(toIndex, fromIndex);
        };

        Grid.prototype.radderDownAppend = function (fromIndex, newNode) {
            var _this = this;
            this.transactionWith(function () {
                _this.appendNode(newNode);
                _this.radderDown(fromIndex, newNode.index);
            });
        };

        Grid.prototype.radderDown = function (fromIndex, toIndex) {
            this.appendLink(fromIndex, toIndex);
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

        Grid.prototype.layout = function (checkActive) {
            if (typeof checkActive === "undefined") { checkActive = false; }
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

            nodes.forEach(function (node) {
                var tmp = node.height;
                node.height = node.width;
                node.width = tmp;
            });

            dagre.layout().nodes(nodes).edges(links).rankSep(200).edgeSep(20).run();

            nodes.forEach(function (node) {
                node.x = node.dagre.y;
                node.y = node.dagre.x;
                node.width = node.dagre.height;
                node.height = node.dagre.width;
            });

            links.forEach(function (link) {
                link.dagre.points.forEach(function (point) {
                    var tmp = point.x;
                    point.x = point.y;
                    point.y = tmp;
                });
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
    Egm.Grid = Grid;
})(Egm || (Egm = {}));
/// <reference path="ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="svg.ts"/>
/// <reference path="grid.ts"/>
var Egm;
(function (Egm) {
    (function (ViewMode) {
        ViewMode[ViewMode["Normal"] = 0] = "Normal";
        ViewMode[ViewMode["Edge"] = 1] = "Edge";
    })(Egm.ViewMode || (Egm.ViewMode = {}));
    var ViewMode = Egm.ViewMode;

    (function (InactiveNode) {
        InactiveNode[InactiveNode["Hidden"] = 0] = "Hidden";
        InactiveNode[InactiveNode["Transparent"] = 1] = "Transparent";
    })(Egm.InactiveNode || (Egm.InactiveNode = {}));
    var InactiveNode = Egm.InactiveNode;

    var EgmOption = (function () {
        function EgmOption() {
        }
        EgmOption.default = function () {
            var option = new EgmOption();
            option.viewMode = ViewMode.Normal;
            option.inactiveNode = InactiveNode.Transparent;
            option.scalingConnection = true;
            return option;
        };
        return EgmOption;
    })();
    Egm.EgmOption = EgmOption;

    (function (Raddering) {
        Raddering[Raddering["RadderUp"] = 0] = "RadderUp";
        Raddering[Raddering["RadderDown"] = 1] = "RadderDown";
    })(Egm.Raddering || (Egm.Raddering = {}));
    var Raddering = Egm.Raddering;

    var EgmUi = (function () {
        function EgmUi() {
            this.grid_ = new Egm.Grid();
            this.options_ = EgmOption.default();
        }
        EgmUi.prototype.nodes = function (arg) {
            if (arg === undefined) {
                return this.grid_.nodes();
            }
            this.grid_.nodes(arg);
            return this;
        };

        EgmUi.prototype.links = function (arg) {
            if (arg === undefined) {
                return this.grid_.links();
            }
            this.grid_.links(arg);
            return this;
        };

        EgmUi.prototype.options = function (arg) {
            if (arg === undefined) {
                return this.options_;
            }
            this.options_ = arg;
            return this;
        };

        EgmUi.prototype.draw = function (f) {
            if (typeof f === "undefined") { f = undefined; }
            var _this = this;
            var spline = d3.svg.line().x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            }).interpolate("basis");

            var nodes = this.grid_.nodes();
            var links = this.grid_.links();
            if (this.options_.inactiveNode == InactiveNode.Hidden) {
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

            var nodeSizeScale = d3.scale.linear().domain(d3.extent(this.grid_.nodes(), function (node) {
                return _this.grid_.numConnectedNodes(node.index, true);
            })).range([1, this.options_.scalingConnection ? 3 : 1]);
            nodesSelection.each(function (node) {
                var rect = _this.calcRect(node.text);
                var n = _this.grid_.numConnectedNodes(node.index, true);
                node.baseWidth = rect.width;
                node.baseHeight = rect.height;
                node.width = node.baseWidth * nodeSizeScale(n);
                node.height = node.baseHeight * nodeSizeScale(n);
            });
            nodesSelection.selectAll("text").text(function (d) {
                return d.text;
            }).attr("x", function (d) {
                return EgmUi.rx - d.baseWidth / 2;
            }).attr("y", function (d) {
                return EgmUi.rx;
            });
            nodesSelection.selectAll("rect").attr("x", function (d) {
                return -d.baseWidth / 2;
            }).attr("y", function (d) {
                return -d.baseHeight / 2;
            }).attr("rx", function (d) {
                return (d.original || d.isTop || d.isBottom) ? 0 : EgmUi.rx;
            }).attr("width", function (d) {
                return d.baseWidth;
            }).attr("height", function (d) {
                return d.baseHeight;
            });

            var linksSelection = this.contentsSelection.select(".links").selectAll(".link").data(links, Object);
            linksSelection.exit().remove();
            linksSelection.enter().append("path").classed("link", true).each(function (link) {
                link.points = [link.source.right(), link.target.left()];
            });
            ;

            this.grid_.layout(this.options_.inactiveNode == InactiveNode.Hidden);

            this.rootSelection.selectAll(".contents .links .link").filter(function (link) {
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

            var linkWidthScale = d3.scale.linear().domain(d3.extent(this.grid_.links(), function (link) {
                return link.weight;
            })).range([5, 15]);
            var transition = this.rootSelection.transition();
            transition.selectAll(".element").attr("opacity", function (node) {
                return node.active ? 1 : 0.3;
            }).attr("transform", function (node) {
                return (new Svg.Transform.Translate(node.center().x, node.center().y)).toString() + (new Svg.Transform.Rotate(node.theta / Math.PI * 180)).toString() + (new Svg.Transform.Scale(nodeSizeScale(_this.grid_.numConnectedNodes(node.index, true)))).toString();
            });
            transition.selectAll(".link").attr("d", function (link) {
                return spline(link.points);
            }).attr("opacity", function (link) {
                return link.source.active && link.target.active ? 1 : 0.3;
            }).attr("stroke-width", function (d) {
                return linkWidthScale(d.weight);
            });
            transition.each("end", f);

            var filterdNodes = this.options_.inactiveNode == InactiveNode.Hidden ? this.grid_.nodes().filter(function (node) {
                return node.active;
            }) : this.grid_.nodes();
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
                    this.displayHeight / (bottom - top)
                ]) || 1
            ]);
            this.contentsZoomBehavior.scaleExtent([s, 1]);

            this.resetUndoButton();
            this.resetRedoButton();
            return this;
        };

        EgmUi.prototype.resetUndoButton = function () {
            if (this.grid_.canUndo()) {
                this.enableUndoButton();
            } else {
                this.disableUndoButton();
            }
        };

        EgmUi.prototype.resetRedoButton = function () {
            if (this.grid_.canRedo()) {
                this.enableRedoButton();
            } else {
                this.disableRedoButton();
            }
        };

        EgmUi.prototype.display = function (regionWidth, regionHeight) {
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

                    _this.enableRemoveNodeButton(d3.select(".selected"));
                });
                selection.call(_this.contentsZoomBehavior);
            };
        };

        EgmUi.prototype.createNode = function (text) {
            var node = new Egm.Node(text);
            return node;
        };

        EgmUi.prototype.focusNode = function (node) {
            var s = this.contentsZoomBehavior.scale() || 1;
            var translate = new Svg.Transform.Translate(this.displayWidth / 2 - node.center().x * s, this.displayHeight / 2 - node.center().y * s);
            var scale = new Svg.Transform.Scale(s);
            this.contentsZoomBehavior.translate([translate.x, translate.y]);
            this.contentsSelection.transition().attr("transform", translate.toString() + scale.toString());
        };

        EgmUi.prototype.focusCenter = function () {
            var left = d3.min(this.grid_.nodes(), function (node) {
                return node.left().x;
            });
            var right = d3.max(this.grid_.nodes(), function (node) {
                return node.right().x;
            });
            var top = d3.min(this.grid_.nodes(), function (node) {
                return node.top().y;
            });
            var bottom = d3.max(this.grid_.nodes(), function (node) {
                return node.bottom().y;
            });

            var s = d3.min([
                1,
                0.9 * d3.min([
                    this.displayWidth / (right - left),
                    this.displayHeight / (bottom - top)
                ]) || 1
            ]);
            var translate = new Svg.Transform.Translate((this.displayWidth - (right - left) * s) / 2, (this.displayHeight - (bottom - top) * s) / 2);
            var scale = new Svg.Transform.Scale(s);
            this.contentsZoomBehavior.translate([translate.x, translate.y]);
            this.contentsZoomBehavior.scale(scale.sx);
            this.contentsSelection.transition().attr("transform", translate.toString() + scale.toString());
        };

        EgmUi.prototype.appendNodeButton = function () {
            var egm = this;
            var onClickPrompt;
            var f = function (selection) {
                selection.on("click", function () {
                    onClickPrompt && onClickPrompt(function (text) {
                        if (text) {
                            var node;
                            if (node = egm.grid_.findNode(text)) {
                                // node already exists
                            } else {
                                // create new node
                                node = egm.createNode(text);
                                node.original = true;
                                egm.grid_.appendNode(node);
                                egm.disableNodeButtons();
                                egm.draw(function () {
                                    egm.enableNodeButtons();
                                });
                            }
                            var addedElement = egm.contentsSelection.selectAll(".element").filter(function (node) {
                                return node.text == text;
                            });
                            egm.selectElement(addedElement);
                            egm.focusNode(addedElement.datum());
                        }
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

        EgmUi.prototype.removeNodeButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.on("click", function () {
                    var node = egm.rootSelection.select(".selected").datum();
                    egm.unselectElement();
                    egm.grid_.removeNode(node.index);
                    egm.draw();
                });
                return this;
            };
            f.onEnable = function (f) {
                egm.onEnableRemoveNodeButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egm.onDisableRemoveNodeButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.mergeNodeButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.call(egm.dragNode().isDroppable(function (fromNode, toNode) {
                    return !egm.grid_.hasPath(toNode.index, fromNode.index);
                }).dragToNode(function (fromNode, toNode) {
                    egm.grid_.mergeNode(fromNode.index, toNode.index);
                    egm.draw();
                    egm.unselectElement();
                    egm.focusNode(toNode);
                }));
                return this;
            };
            f.onEnable = function (f) {
                egm.onEnableMergeNodeButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egm.onDisableMergeNodeButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.radderUpButton = function () {
            var _this = this;
            var grid = this;
            var f = function (selection) {
                _this.raddering(selection, Raddering.RadderUp);
            };
            f.onClick = function (f) {
                grid.openLadderUpPrompt = f;
                return this;
            };
            f.onEnable = function (f) {
                grid.onEnableRadderUpButton = f;
                return this;
            };
            f.onDisable = function (f) {
                grid.onDisableRadderUpButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.radderDownButton = function () {
            var grid = this;
            var f = function (selection) {
                grid.raddering(selection, Raddering.RadderDown);
                return this;
            };
            f.onClick = function (f) {
                grid.openLadderDownPrompt = f;
                return this;
            };
            f.onEnable = function (f) {
                grid.onEnableRadderDownButton = f;
                return this;
            };
            f.onDisable = function (f) {
                grid.onDisableRadderDownButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.save = function () {
            if (this.onClickSaveButton) {
                this.onClickSaveButton(this.grid_.toJSON());
            }
        };

        EgmUi.prototype.saveButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.on("click", function () {
                    egm.save();
                });
                return this;
            };
            f.save = function (f) {
                egm.onClickSaveButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.undo = function () {
            this.grid_.undo();
            this.draw();
            this.disableNodeButtons();
        };

        EgmUi.prototype.undoButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.on("click", function () {
                    egm.undo();
                });
                egm.resetUndoButton();
                return this;
            };
            f.onEnable = function (f) {
                egm.onEnableUndoButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egm.onDisableUndoButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.redo = function () {
            this.grid_.redo();
            this.draw();
            this.disableNodeButtons();
        };

        EgmUi.prototype.redoButton = function () {
            var egm = this;
            var f = function (selection) {
                selection.on("click", function () {
                    egm.redo();
                });
                egm.resetRedoButton();
                return this;
            };
            f.onEnable = function (f) {
                egm.onEnableRedoButton = f;
                return this;
            };
            f.onDisable = function (f) {
                egm.onDisableRedoButton = f;
                return this;
            };
            return f;
        };

        EgmUi.prototype.getTextBBox = function (text) {
            return this.rootSelection.select(".measure").text(text).node().getBBox();
        };

        EgmUi.prototype.calcRect = function (text) {
            var bbox = this.getTextBBox(text);
            return new Svg.Rect(bbox.x, bbox.y, bbox.width + EgmUi.rx * 2, bbox.height + EgmUi.rx * 2);
        };

        EgmUi.prototype.appendElement = function () {
            var _this = this;
            return function (selection) {
                var self = _this;
                var onElementClick = function () {
                    var selection = d3.select(this);
                    if (selection.classed("selected")) {
                        self.unselectElement();
                        d3.event.stopPropagation();
                    } else {
                        self.selectElement(selection);
                        d3.event.stopPropagation();
                    }
                };
                selection.classed("element", true).on("click", onElementClick).on("touchstart", onElementClick);

                selection.append("rect");
                selection.append("text");
            };
        };

        EgmUi.prototype.selectElement = function (selection) {
            this.rootSelection.selectAll(".selected").classed("selected", false);
            selection.classed("selected", true);
            this.enableNodeButtons();
            this.drawNodeConnection();
        };

        EgmUi.prototype.selectedNode = function () {
            var selection = this.rootSelection.select(".selected");
            return selection.empty() ? null : selection.datum();
        };

        EgmUi.prototype.drawNodeConnection = function () {
            var _this = this;
            var d = this.selectedNode();
            this.rootSelection.selectAll(".connected").classed("connected", false);
            if (d) {
                d3.selectAll(".element").filter(function (d2) {
                    return _this.grid_.hasPath(d.index, d2.index) || _this.grid_.hasPath(d2.index, d.index);
                }).classed("connected", true);
                d3.selectAll(".link").filter(function (link) {
                    return (_this.grid_.hasPath(d.index, link.source.index) && _this.grid_.hasPath(d.index, link.target.index)) || (_this.grid_.hasPath(link.source.index, d.index) && _this.grid_.hasPath(link.target.index, d.index));
                }).classed("connected", true);
            }
        };

        EgmUi.prototype.enableNodeButtons = function () {
            var selection = d3.select(".selected");
            this.enableRemoveNodeButton(selection);
            this.enableMergeNodeButton(selection);
            this.enableRadderUpButton(selection);
            this.enableRadderDownButton(selection);
        };

        EgmUi.prototype.disableNodeButtons = function () {
            this.disableRemoveNodeButton();
            this.disableMergeNodeButton();
            this.disableRadderUpButton();
            this.disableRadderDownButton();
        };

        EgmUi.prototype.unselectElement = function () {
            this.rootSelection.selectAll(".selected").classed("selected", false);
            this.rootSelection.selectAll(".connected").classed("connected", false);
            this.disableNodeButtons();
        };

        EgmUi.prototype.enableRadderUpButton = function (selection) {
            if (this.onEnableRadderUpButton) {
                this.onEnableRadderUpButton(selection);
            }
        };

        EgmUi.prototype.disableRadderUpButton = function () {
            if (this.onDisableRadderUpButton) {
                this.onDisableRadderUpButton();
            }
        };

        EgmUi.prototype.enableRadderDownButton = function (selection) {
            if (this.onEnableRadderDownButton) {
                this.onEnableRadderDownButton(selection);
            }
        };

        EgmUi.prototype.disableRadderDownButton = function () {
            if (this.onDisableRadderDownButton) {
                this.onDisableRadderDownButton();
            }
        };

        EgmUi.prototype.enableRemoveNodeButton = function (selection) {
            if (this.onEnableRemoveNodeButton) {
                this.onEnableRemoveNodeButton(selection);
            }
        };

        EgmUi.prototype.disableRemoveNodeButton = function () {
            if (this.onDisableRemoveNodeButton) {
                this.onDisableRemoveNodeButton();
            }
        };

        EgmUi.prototype.enableMergeNodeButton = function (selection) {
            if (this.onEnableMergeNodeButton) {
                this.onEnableMergeNodeButton(selection);
            }
        };

        EgmUi.prototype.disableMergeNodeButton = function () {
            if (this.onDisableMergeNodeButton) {
                this.onDisableMergeNodeButton();
            }
        };

        EgmUi.prototype.enableUndoButton = function () {
            if (this.onEnableUndoButton) {
                this.onEnableUndoButton();
            }
        };

        EgmUi.prototype.disableUndoButton = function () {
            if (this.onDisableUndoButton) {
                this.onDisableUndoButton();
            }
        };

        EgmUi.prototype.enableRedoButton = function () {
            if (this.onEnableRedoButton) {
                this.onEnableRedoButton();
            }
        };

        EgmUi.prototype.disableRedoButton = function () {
            if (this.onDisableRedoButton) {
                this.onDisableRedoButton();
            }
        };

        EgmUi.prototype.dragNode = function () {
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

        EgmUi.prototype.raddering = function (selection, type) {
            var _this = this;
            var dragToNode = function (fromNode, toNode) {
                switch (type) {
                    case Raddering.RadderUp:
                        if (_this.grid_.hasLink(toNode.index, fromNode.index)) {
                            var link = _this.grid_.link(toNode.index, fromNode.index);
                            _this.grid_.incrementLinkWeight(link.index);
                            _this.draw();
                        } else {
                            _this.grid_.radderUp(fromNode.index, toNode.index);
                            _this.draw(function () {
                                _this.enableNodeButtons();
                            });
                            _this.drawNodeConnection();
                            _this.focusNode(toNode);
                            _this.disableNodeButtons();
                        }
                        break;
                    case Raddering.RadderDown:
                        if (_this.grid_.hasLink(fromNode.index, toNode.index)) {
                            var link = _this.grid_.link(fromNode.index, toNode.index);
                            _this.grid_.incrementLinkWeight(link.index);
                            _this.draw();
                        } else {
                            _this.grid_.radderDown(fromNode.index, toNode.index);
                            _this.draw(function () {
                                _this.enableNodeButtons();
                            });
                            _this.drawNodeConnection();
                            _this.focusNode(toNode);
                            _this.disableNodeButtons();
                        }
                        break;
                }
            };

            selection.call(this.dragNode().isDroppable(function (fromNode, toNode) {
                return !((type == Raddering.RadderUp && _this.grid_.hasPath(fromNode.index, toNode.index)) || (type == Raddering.RadderDown && _this.grid_.hasPath(toNode.index, fromNode.index)));
            }).dragToNode(dragToNode).dragToOther(function (fromNode) {
                var openPrompt;
                switch (type) {
                    case Raddering.RadderUp:
                        openPrompt = _this.openLadderUpPrompt;
                        break;
                    case Raddering.RadderDown:
                        openPrompt = _this.openLadderDownPrompt;
                        break;
                }

                openPrompt && openPrompt(function (text) {
                    if (text) {
                        var node;
                        if (node = _this.grid_.findNode(text)) {
                            dragToNode(fromNode, node);
                        } else {
                            node = _this.createNode(text);
                            switch (type) {
                                case Raddering.RadderUp:
                                    _this.grid_.radderUpAppend(fromNode.index, node);
                                    break;
                                case Raddering.RadderDown:
                                    _this.grid_.radderDownAppend(fromNode.index, node);
                                    break;
                            }
                            _this.draw(function () {
                                _this.enableNodeButtons();
                            });
                            _this.drawNodeConnection();
                            _this.focusNode(node);
                        }
                    }
                });
            }));
        };

        EgmUi.prototype.getPos = function (container) {
            var xy = d3.event.sourceEvent instanceof MouseEvent ? d3.mouse(container) : d3.touches(container, d3.event.sourceEvent.changedTouches)[0];
            return new Svg.Point(xy[0], xy[1]);
        };
        EgmUi.rx = 20;
        return EgmUi;
    })();
    Egm.EgmUi = EgmUi;
})(Egm || (Egm = {}));
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../egm.ts"/>
var Controllers;
(function (Controllers) {
    function EgmEditController($scope, $routeParams, $http, $location, $dialog) {
        var projectId = $scope.projectId = $routeParams.projectId;
        var participantId = $scope.participantId = $routeParams.participantId;
        var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";
        var overallJsonUrl = "/api/projects/" + projectId + "/grid";
        var overallTexts = [];

        var egm = new Egm.EgmUi();
        egm.options().scalingConnection = false;
        d3.select("#display").call(egm.display());

        $scope.call = function (callback) {
            callback();
        };

        function callWithProxy(f) {
            $scope.callback = f;
            $("#ngClickProxy").trigger("click");
        }

        function openInputTextDialog(callback) {
            callWithProxy(function () {
                var texts = overallTexts.concat(egm.nodes().map(function (node) {
                    return node.text;
                }));
                var d = $dialog.dialog({
                    backdrop: true,
                    keyboard: true,
                    backdropClick: true,
                    templateUrl: '/partials/input-text-dialog.html',
                    controller: InputTextDialogController,
                    resolve: { texts: function () {
                            return texts;
                        } }
                });
                d.open().then(function (result) {
                    callback(result);
                });
            });
        }

        d3.select("#appendNodeButton").call(egm.appendNodeButton().onClick(openInputTextDialog));
        d3.select("#undoButton").call(egm.undoButton().onEnable(function () {
            d3.select("#undoButtonContainer").classed("disabled", false);
        }).onDisable(function () {
            d3.select("#undoButtonContainer").classed("disabled", true);
        }));
        d3.select("#redoButton").call(egm.redoButton().onEnable(function () {
            d3.select("#redoButtonContainer").classed("disabled", false);
        }).onDisable(function () {
            d3.select("#redoButtonContainer").classed("disabled", true);
        }));
        d3.select("#saveButton").call(egm.saveButton().save(function (json) {
            $http({
                method: 'PUT',
                url: jsonUrl,
                data: json
            }).success(function (data) {
                var path = "/participants/" + projectId + "/" + participantId;
                $location.path(path);
            });
        }));

        function showNodeController(selection) {
            if (!selection.empty()) {
                var nodeRect = selection.node().getBoundingClientRect();
                var controllerWidth = $("#nodeController").width();
                d3.select("#nodeController").classed("invisible", false).style("top", nodeRect.top + nodeRect.height + 10 + "px").style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px");
            }
        }

        function hideNodeController() {
            d3.select("#nodeController").classed("invisible", true);
        }

        function moveNodeController(selection) {
            var nodeRect = selection.node().getBoundingClientRect();
            var controllerWidth = $("#nodeController").width();
            d3.select("#nodeController").style("top", nodeRect.top + nodeRect.height + 10 + "px").style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px");
        }

        d3.select("#ladderUpButton").call(egm.radderUpButton().onClick(openInputTextDialog).onEnable(showNodeController).onDisable(hideNodeController));
        d3.select("#ladderDownButton").call(egm.radderDownButton().onClick(openInputTextDialog).onEnable(showNodeController).onDisable(hideNodeController));
        d3.select("#removeNodeButton").call(egm.removeNodeButton().onEnable(showNodeController).onDisable(hideNodeController));
        d3.select("#mergeNodeButton").call(egm.mergeNodeButton().onEnable(showNodeController).onDisable(hideNodeController));

        $http.get(jsonUrl).success(function (data) {
            var nodes = data.nodes.map(function (d) {
                return new Egm.Node(d.text, d.weight, d.original);
            });
            var links = data.links.map(function (d) {
                return new Egm.Link(nodes[d.source], nodes[d.target], d.weight);
            });
            egm.nodes(nodes).links(links).draw().focusCenter();
        });

        $http.get(overallJsonUrl).success(function (data) {
            data.nodes.forEach(function (d) {
                overallTexts.push(d.text);
            });
        });
    }
    Controllers.EgmEditController = EgmEditController;

    function InputTextDialogController($scope, dialog, texts) {
        texts.sort();
        texts = unique(texts);
        $scope.texts = texts;
        $scope.close = function (result) {
            dialog.close(result);
        };
    }

    function unique(array) {
        var result = [];
        if (array.length > 0) {
            result.push(array[0]);
            array.forEach(function (item) {
                if (item != result[result.length - 1]) {
                    result.push(item);
                }
            });
        }
        return result;
    }
})(Controllers || (Controllers = {}));
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../egm.ts"/>
var Controllers;
(function (Controllers) {
    function EgmShowController($scope, $routeParams, $http, $location) {
        var projectId = $scope.projectId = $routeParams.projectId;
        var participantId = $scope.participantId = $routeParams.participantId;
        var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";

        var egm = new Egm.EgmUi();
        d3.select("#display").call(egm.display());

        $http.get(jsonUrl).success(function (data) {
            var nodes = data.nodes.map(function (d) {
                return new Egm.Node(d.text, d.weight, d.original);
            });
            var links = data.links.map(function (d) {
                return new Egm.Link(nodes[d.source], nodes[d.target], d.weight);
            });
            egm.nodes(nodes).links(links).draw().focusCenter();
        });
    }
    Controllers.EgmShowController = EgmShowController;
})(Controllers || (Controllers = {}));
/// <reference path="../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../egm.ts"/>
var Controllers;
(function (Controllers) {
    function EgmShowAllController($scope, $routeParams, $http, $location, $dialog) {
        var data;
        var participants;
        var projectId = $scope.projectId = $routeParams.projectId;
        var participantsUrl = "/api/participants/" + projectId;
        var jsonUrl = "/api/projects/" + projectId + "/grid";
        var filter = {};

        $scope.call = function (callback) {
            callback();
        };

        function callWithProxy(f) {
            $scope.callback = f;
            $("#ngClickProxy").trigger("click");
        }

        var egm = new Egm.EgmUi();
        d3.select("#display").call(egm.display());

        function showNodeController(selection) {
            if (!selection.empty()) {
                var nodeRect = selection.node().getBoundingClientRect();
                var controllerWidth = $("#nodeController").width();
                d3.select("#nodeController").classed("invisible", false).style("top", nodeRect.top + nodeRect.height + 10 + "px").style("left", nodeRect.left + (nodeRect.width - controllerWidth) / 2 + "px");
            }
        }

        function hideNodeController() {
            d3.select("#nodeController").classed("invisible", true);
        }

        d3.select("#removeNodeButton").call(egm.removeNodeButton().onEnable(showNodeController).onDisable(hideNodeController));
        d3.select("#mergeNodeButton").call(egm.mergeNodeButton().onEnable(showNodeController).onDisable(hideNodeController));

        d3.select("#filterButton").on("click", function () {
            callWithProxy(function () {
                var node = egm.selectedNode();
                participants.forEach(function (participant) {
                    if (node) {
                        participant.active = node.participants.indexOf(participant.key) >= 0;
                    } else {
                        participant.active = false;
                    }
                });
                var d = $dialog.dialog({
                    backdrop: true,
                    keyboard: true,
                    backdropClick: true,
                    templateUrl: '/partials/filter-participants-dialog.html',
                    controller: FilterParticipantsDialogController,
                    resolve: {
                        participants: function () {
                            return participants;
                        },
                        filter: function () {
                            return filter;
                        }
                    }
                });
                d.open().then(function (result) {
                    egm.nodes().forEach(function (d) {
                        d.active = d.participants.some(function (key) {
                            return result[key];
                        });
                    });
                    egm.draw().focusCenter();
                });
            });
        });

        d3.select("#layoutButton").on("click", function () {
            callWithProxy(function () {
                var d = $dialog.dialog({
                    backdrop: true,
                    keyboard: true,
                    backdropClick: true,
                    templateUrl: '/partials/setting-dialog.html',
                    controller: SettingDialogController,
                    resolve: { options: function () {
                            return egm.options();
                        } }
                });
                d.open().then(function () {
                    egm.draw();
                });
            });
        });

        $http.get(jsonUrl).success(function (data_) {
            data = data_;
            var nodes = data.nodes.map(function (d) {
                return new Egm.Node(d.text, d.weight, d.original, d.participants);
            });
            var links = data.links.map(function (d) {
                return new Egm.Link(nodes[d.source], nodes[d.target], d.weight);
            });
            egm.nodes(nodes).links(links).draw().focusCenter();
        });

        $http.get(participantsUrl).success(function (participants_) {
            participants = participants_;
            participants.forEach(function (participant) {
                participant.active = false;
                filter[participant.key] = true;
            });
        });
    }
    Controllers.EgmShowAllController = EgmShowAllController;

    function FilterParticipantsDialogController($scope, dialog, participants, filter) {
        $scope.results = filter;
        $scope.participants = participants;
        $scope.close = function () {
            dialog.close($scope.results);
        };
    }

    function SettingDialogController($scope, dialog, options) {
        $scope.options = options;
        $scope.ViewMode = Egm.ViewMode;
        $scope.InactiveNode = Egm.InactiveNode;
        $scope.close = function () {
            dialog.close();
        };
    }
})(Controllers || (Controllers = {}));
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../egm.ts"/>
var Controllers;
(function (Controllers) {
    function ParticipantDetailController($scope, $routeParams, $http) {
        var projectId = $scope.projectId = $routeParams.projectId;
        var participantId = $scope.participantId = $routeParams.participantId;
        var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";

        $http.get("/api/participants/" + projectId + "/" + participantId).success(function (data) {
            $scope.participant = data;
        });

        var gridTabInitialized = false;
        $scope.gridTabSelected = function () {
            if (!gridTabInitialized) {
                var width = 960 / 12 * 10;
                var height = 500;
                var egm = new Egm.EgmUi();

                d3.select("#display").attr("width", width).attr("height", height).style("display", "block").style("border", "solid").call(egm.display(width, height));

                $http.get(jsonUrl).success(function (data) {
                    var nodes = data.nodes.map(function (d) {
                        return new Egm.Node(d.text, d.weight, d.original);
                    });
                    var links = data.links.map(function (d) {
                        return new Egm.Link(nodes[d.source], nodes[d.target], d.weight);
                    });
                    egm.nodes(nodes).links(links).draw().focusCenter();
                });
                gridTabInitialized = true;
            }
        };
    }
    Controllers.ParticipantDetailController = ParticipantDetailController;
})(Controllers || (Controllers = {}));
var Controllers;
(function (Controllers) {
    function ProjectDetailController($scope, $routeParams, $http, $location) {
        var projectId = $routeParams.projectId;
        $scope.projectId = projectId;
        $http.get("/api/projects/" + projectId).success(function (data) {
            $scope.project = data;
        });
        $http.get("/api/participants/" + projectId).success(function (data) {
            $scope.participants = data;
        });
        $scope.newParticipant = {};
        $scope.createParticipant = function () {
            $http({
                method: 'PUT',
                url: '/api/participants/' + projectId,
                data: $scope.newParticipant
            }).success(function (data) {
                var path = "/participants/" + projectId + "/" + data.key;
                $location.path(path);
            });
        };
    }
    Controllers.ProjectDetailController = ProjectDetailController;
})(Controllers || (Controllers = {}));
var Controllers;
(function (Controllers) {
    function ProjectListController($scope, $http, $templateCache, $location) {
        $http.get("/api/projects").success(function (data) {
            $scope.projects = data;
        });
        $scope.newProject = {};
        $scope.createProject = function () {
            $http({
                method: 'PUT',
                url: '/api/projects',
                data: $scope.newProject
            }).success(function (data, status, headers, config) {
                var path = "/projects/" + data.key;
                $location.path(path);
            });
        };
    }
    Controllers.ProjectListController = ProjectListController;
})(Controllers || (Controllers = {}));
/// <reference path="ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="egm.ts"/>
/// <reference path="controllers/egm_edit.ts"/>
/// <reference path="controllers/egm_show.ts"/>
/// <reference path="controllers/egm_show_all.ts"/>
/// <reference path="controllers/participant_detail.ts"/>
/// <reference path="controllers/project_detail.ts"/>
/// <reference path="controllers/project_list.ts"/>
angular.module('collaboegm', ["ui.bootstrap"]).directive("egmApplicationView", function () {
    return {
        restrict: "EA",
        transclude: true,
        templateUrl: "/partials/base.html"
    };
}).directive('focusMe', function ($timeout) {
    return {
        link: function (scope, element, attrs, model) {
            $timeout(function () {
                element[0].focus();
            });
        }
    };
}).config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when("/projects", {
            templateUrl: "/partials/project-list.html",
            controller: Controllers.ProjectListController
        }).when("/projects/:projectId/grid", {
            templateUrl: "/partials/egm-show-all.html",
            controller: Controllers.EgmShowAllController
        }).when("/projects/:projectId", {
            templateUrl: "/partials/project-detail.html",
            controller: Controllers.ProjectDetailController
        }).when("/participants/:projectId/:participantId/grid", {
            templateUrl: "/partials/egm-show.html",
            controller: Controllers.EgmShowController
        }).when("/participants/:projectId/:participantId/edit", {
            templateUrl: "/partials/egm-edit.html",
            controller: Controllers.EgmEditController
        }).when("/participants/:projectId/:participantId", {
            templateUrl: "/partials/participant-detail.html",
            controller: Controllers.ParticipantDetailController
        }).otherwise({
            redirectTo: "/projects"
        });
    }
]);
