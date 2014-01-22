/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="svg.ts"/>
/// <reference path="dag.ts"/>

module egrid {
  export enum ViewMode {
    Normal,
    Edge
  }


  export enum InactiveNode {
    Hidden,
    Transparent
  }


  export class EgmOption {
    public viewMode : ViewMode;
    public inactiveNode : InactiveNode;
    public scalingConnection : boolean;
    public lineUpTop : boolean;
    public lineUpBottom : boolean;
    public showGuide : boolean;

    static default() : EgmOption {
      var option = new EgmOption;
      option.viewMode = ViewMode.Normal;
      option.inactiveNode = InactiveNode.Transparent;
      option.scalingConnection = true;
      option.lineUpTop = true;
      option.lineUpBottom = true;
      option.showGuide = false;
      return option;
    }
  }


  export interface DragNode {
    (selection : D3.Selection) : DragNode;
    isDroppable(f : (from : Node, to : Node) => boolean) : DragNode;
    dragToNode(f : (from : Node, to : Node) => void) : DragNode;
    dragToOther(f : (from : Node) => void) : DragNode;
  }


  export enum Raddering {
    RadderUp,
    RadderDown
  }


  /**
   * @class egrid.EGM
   */
  export class EGM extends DAG {
    private static rx : number = 20;
    private options_ : EgmOption;
    private displayWidth : number;
    private displayHeight : number;
    private rootSelection : D3.Selection;
    private contentsSelection : D3.Selection;
    private contentsZoomBehavior : D3.Behavior.Zoom;
    public openLadderUpPrompt : (callback : (result : string) => void) => void;
    public openLadderDownPrompt : (callback : (result : string) => void) => void;
    private removeLinkButtonEnabled : boolean = false;


    /**
     * @class egrid.EGM
     * @constructor
     */
    constructor () {
      super();
      this.options_ = EgmOption.default();
    }


    /**
     * @method options
     */
    options() : EgmOption;
    options(options : EgmOption) : EGM;
    options(arg? : EgmOption) : any {
      if (arg === undefined) {
        return this.options_;
      }
      this.options_ = arg;
      return this;
    }


    /**
     * @method draw
     */
    draw() : EGM {
      var spline = d3.svg.line()
        .x(d => d.x)
        .y(d => d.y)
        .interpolate("basis")
        ;

      var nodes = this.nodes();
      var links = this.links();
      if (this.options_.inactiveNode == InactiveNode.Hidden) {
        nodes = nodes.filter(d => d.active);
        links = links.filter(d => d.source.active && d.target.active);
      }

      var nodesSelection = this.contentsSelection
        .select(".nodes")
        .selectAll(".element")
        .data(nodes, Object)
        ;
      nodesSelection
        .exit()
        .remove()
        ;
      nodesSelection
        .enter()
        .append("g")
        .call(this.appendElement())
        ;

      var nodeSizeScale = this.nodeSizeScale();
      nodesSelection.each(node => {
        var rect = this.calcRect(node.text);
        var n = this.grid().numConnectedNodes(node.index, true);
        node.baseWidth = rect.width;
        node.baseHeight = rect.height;
        node.width = node.baseWidth * nodeSizeScale(n);
        node.height = node.baseHeight * nodeSizeScale(n);
      });
      nodesSelection.selectAll("text")
        .text(d => d.text)
        .attr("x", d => EGM.rx - d.baseWidth / 2)
        .attr("y", d => EGM.rx)
        ;
      nodesSelection.selectAll("rect")
        .attr("x", d => - d.baseWidth / 2)
        .attr("y", d => - d.baseHeight / 2)
        .attr("rx", d => (d.original || d.isTop || d.isBottom) ? 0 : EGM.rx)
        .attr("width", d => d.baseWidth)
        .attr("height", d => d.baseHeight)
        ;

      var linksSelection = this.contentsSelection
        .select(".links")
        .selectAll(".link")
        .data(links, Object)
        ;
      linksSelection
        .exit()
        .remove()
        ;
      linksSelection
        .enter()
        .append("g")
        .classed("link", true)
        .each(link => {
          link.points = [link.source.right(), link.target.left()];
        })
        .call(selection => {
          selection.append("path");
          if (this.removeLinkButtonEnabled) {
            selection.call(this.appendRemoveLinkButton());
          }
        })
        ;

      this.grid()
        .layout(
            this.options_.inactiveNode == InactiveNode.Hidden,
            this.options_.lineUpTop,
            this.options_.lineUpBottom);

      this.rootSelection.selectAll(".contents .links .link path")
        .filter(link => link.previousPoints.length != link.points.length)
        .attr("d", (link : Link) : string => {
          if (link.points.length > link.previousPoints.length) {
            while (link.points.length != link.previousPoints.length) {
              link.previousPoints.unshift(link.previousPoints[0]);
            }
          } else {
            link.previousPoints.splice(1, link.previousPoints.length - link.points.length);
          }
          return spline(link.previousPoints);
        })
        ;

      var linkWidthScale = this.linkWidthScale();
      var selectedNode = this.selectedNode();
      var transition = this.rootSelection.transition();
      transition.selectAll(".element")
        .attr("opacity", node => {
          return node.active ? 1 : 0.3;
        })
        .attr("transform", (node : egrid.Node) : string => {
          return (new Svg.Transform.Translate(node.center().x, node.center().y)).toString()
            + (new Svg.Transform.Rotate(node.theta / Math.PI * 180)).toString()
            + (new Svg.Transform.Scale(nodeSizeScale(this.grid().numConnectedNodes(node.index, true)))).toString();
        })
        ;
      transition.selectAll(".link path")
        .attr("d", (link : egrid.Link) : string => {
          return spline(link.points);
        })
        .attr("opacity", link => {
          return link.source.active && link.target.active ? 1 : 0.3;
        })
        .attr("stroke-width", d => linkWidthScale(d.weight))
        ;
      transition.selectAll(".link .removeLinkButton")
        .attr("transform", link => {
          return "translate(" + link.points[1].x + "," + link.points[1].y + ")";
        })
        .attr("opacity", link => {
          return link.source == selectedNode || link.target == selectedNode ? 1 : 0;
        })
        ;
      transition.each("end", () => {
        this.notify();
      });

      this.rescale();

      this.rootSelection.select('.guide')
        .style('visibility', this.options_.showGuide ? 'visible' : 'hidden')
        ;

      return this;
    }


    private drawNodeConnection() : void {
      var d = this.selectedNode();
      this.rootSelection.selectAll(".connected").classed("connected", false);
      if (d) {
        d3.selectAll(".element")
          .filter((d2 : Node) : boolean => {
            return this.grid().hasPath(d.index, d2.index) || this.grid().hasPath(d2.index, d.index);
          })
          .classed("connected", true)
          ;
        d3.selectAll(".link")
          .filter((link : Link) : boolean => {
            return (this.grid().hasPath(d.index, link.source.index)
                && this.grid().hasPath(d.index, link.target.index))
              || (this.grid().hasPath(link.source.index, d.index)
                && this.grid().hasPath(link.target.index, d.index));
          })
          .classed("connected", true)
          ;
       d3.selectAll(".link .removeLinkButton")
          .attr("opacity", link => {
            return link.source == d || link.target == d ? 1 : 0;
          })
          ;
      }
    }


    private getTextBBox(text : string) : SVGRect {
      return this.rootSelection.select(".measure").text(text).node().getBBox();
    }


    private calcRect(text : string) : Svg.Rect {
      var bbox = this.getTextBBox(text);
      return new Svg.Rect(
          bbox.x,
          bbox.y,
          bbox.width + EGM.rx * 2,
          bbox.height + EGM.rx * 2);
    }


    private appendElement() : (selection : D3.Selection) => void {
      return (selection) => {
        var egm = this;
        var onElementClick = function() {
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
        selection
          .classed("element", true)
          .on("click", onElementClick)
          .on("touchstart", onElementClick)
          ;

        selection.append("rect");
        selection.append("text");
      };
    }


    private appendRemoveLinkButton() : (selection : D3.Selection) => void {
      return (selection) => {
        selection.append("g")
          .classed("removeLinkButton", true)
          .attr("transform", link => {
            return "translate(" + link.points[1].x + "," + link.points[1].y + ")";
          })
          .attr("opacity", 0)
          .on("click", (d) => {
            this.grid().removeLink(d.index);
            this.draw();
          })
          .call(selection => {
            selection.append("circle")
              .attr("r", 16)
              .attr("fill", "lightgray")
              .attr("stroke", "none")
              ;
            selection.append("image")
              .attr("x", -8)
              .attr("y", -8)
              .attr("width", "16px")
              .attr("height", "16px")
              .attr("xlink:href", "images/glyphicons_207_remove_2.png")
              ;
          })
          ;
      };
    }


    private nodeSizeScale() : D3.Scale.Scale {
      return d3.scale
        .linear()
        .domain(d3.extent(this.nodes(), node => {
          return this.grid().numConnectedNodes(node.index, true);
        }))
        .range([1, this.options_.scalingConnection ? 3 : 1])
        ;
    }


    private linkWidthScale() : D3.Scale.Scale {
      return d3.scale
        .linear()
        .domain(d3.extent(this.links(), (link) => {
          return link.weight;
        }))
        .range([5, 15])
        ;
    }


    private rescale() : void {
      var filterdNodes = this.options_.inactiveNode == InactiveNode.Hidden
        ? this.nodes().filter(node => node.active)
        : this.nodes()
      var left = d3.min(filterdNodes, node => {
        return node.left().x;
      });
      var right = d3.max(filterdNodes, node => {
        return node.right().x;
      });
      var top = d3.min(filterdNodes, node => {
        return node.top().y;
      });
      var bottom = d3.max(filterdNodes, node => {
        return node.bottom().y;
      });

      var s = d3.min([
          1,
          0.9 * d3.min([
            this.displayWidth / (right - left),
            this.displayHeight / (bottom - top)]) || 1
      ]);
      this.contentsZoomBehavior
        .scaleExtent([s, 1])
        ;
    }


    /**
     * Generates a function to init display region.
     * @method display
     * @param regionWidth {number} Width of display region.
     * @param regionHeight {number} Height of display region.
     * @return {function}
     */
    display(regionWidth : number = undefined, regionHeight : number = undefined)
        : (selection : D3.Selection) => void {
      return (selection) => {
        this.rootSelection = selection;

        this.displayWidth = regionWidth || $(window).width();
        this.displayHeight = regionHeight || $(window).height();
        selection.attr("viewBox", (new Svg.ViewBox(0, 0, this.displayWidth, this.displayHeight)).toString());
        selection.append("text")
          .classed("measure", true)
          ;

        selection.append("rect")
          .attr("fill", "#fff")
          .attr("width", this.displayWidth)
          .attr("height", this.displayHeight)
          ;

        this.contentsSelection = selection.append("g").classed("contents", true);
        this.contentsSelection.append("g").classed("links", true);
        this.contentsSelection.append("g").classed("nodes", true);
        this.createGuide(selection);

        this.contentsZoomBehavior = d3.behavior.zoom()
          .on("zoom", () => {
              var translate = new Svg.Transform.Translate(
                d3.event.translate[0], d3.event.translate[1]);
              var scale = new Svg.Transform.Scale(d3.event.scale);
              this.contentsSelection.attr("transform", translate.toString() + scale.toString());

              this.notify();
          })
          ;
        selection.call(this.contentsZoomBehavior);
      };
    }


    private createGuide(selection : D3.Selection) : void {
      var guideHeight = 170;
      var guideSelection = selection.append('g')
        .classed('guide', true)
        .style('visibility', 'hidden')
        .attr('transform', 'translate(0,' + (this.displayHeight - guideHeight) + ')')
        ;
      var line = d3.svg.line();
      var axisFrom = [this.displayWidth * 0.1, 35];
      var axisTo = [this.displayWidth * 0.9, 35];
      guideSelection.append('defs')
        .call(selection => {
          selection.append('marker')
            .attr({
              'id': 'arrow-start-marker',
              'markerUnits': 'strokeWidth',
              'markerWidth': 3,
              'markerHeight': 3,
              'viewBox': '0 0 10 10',
              'refX': 5,
              'refY': 5,
            })
            .append('polygon')
            .attr({
              'points': '10,0 5,5 10,10 0,5',
              'fill': 'black',
            })
            ;
          selection.append('marker')
            .attr({
              'id': 'arrow-end-marker',
              'markerUnits': 'strokeWidth',
              'markerWidth': 3,
              'markerHeight': 3,
              'viewBox': '0 0 10 10',
              'refX': 5,
              'refY': 5,
            })
            .append('polygon')
            .attr({
              'points': '0,0 5,5 0,10 10,5',
              'fill': 'black',
            })
            ;
        })
        ;

      guideSelection.append('rect')
        .attr({
          'opacity': 0.9,
          'width': this.displayWidth,
          'height': guideHeight,
          'fill': 'lightgray'
        })
        ;
      guideSelection.append('path')
        .attr({
          'stroke': 'black',
          'stroke-width': 5,
          'd': line([axisFrom, axisTo]),
          'marker-start': 'url(#arrow-start-marker)',
          'marker-end': 'url(#arrow-end-marker)',
        })
        ;
      guideSelection.append('text')
        .text('上位項目')
        .attr({
          'x': axisFrom[0],
          'y': 25,
          'text-anchor': 'start',
          'font-size': '1.5em',
        })
        ;
      guideSelection.append('text')
        .text('下位項目')
        .attr({
          'x': axisTo[0],
          'y': 25,
          'text-anchor': 'end',
          'font-size': '1.5em',
        })
        ;
      var upperElementTexts = [
        '○○だと、なぜいいのですか？',
        '○○が重要な理由は？',
        '○○だとどのように感じますか？',
        '○○であることには、どんないい点があるのですか？',
      ];
      guideSelection.append('g')
        .selectAll('text')
        .data(upperElementTexts)
        .enter()
        .append('text')
        .text(d => d)
        .attr({
          'x': axisFrom[0],
          'y': (_, i) => 20 * i + 60,
          'text-anchor': 'start'
        })
        ;
      var lowerElementTexts = [
        '○○のどこがいいのですか？',
        'どういった点で○○が重要なのですか？',
        '○○であるためには、具体的に何がどうなっていることが必要だと思いますか？',
      ];
      guideSelection.append('g')
        .selectAll('text')
        .data(lowerElementTexts)
        .enter()
        .append('text')
        .text(d => d)
        .attr({
          'x': axisTo[0],
          'y': (_, i) => 20 * i + 60,
          'text-anchor': 'end'
        })
        ;
    }


    private createNode(text : string) : Node {
      var node = new egrid.Node(text);
      return node;
    }


    /**
     * @method focusNode
     * @param node {egrid.Node}
     */
    focusNode(node : Node) : void {
      var s = this.contentsZoomBehavior.scale() || 1;
      var translate = new Svg.Transform.Translate(
        this.displayWidth / 2 - node.center().x * s,
        this.displayHeight / 2 - node.center().y * s
         );
      var scale = new Svg.Transform.Scale(s);
      this.contentsZoomBehavior.translate([translate.x, translate.y]);
      this.contentsSelection
        .transition()
        .attr("transform", translate.toString() + scale.toString());
    }


    /**
     * @method focusCenter
     */
    focusCenter() : EGM {
      var left = d3.min(this.nodes(), node => {
        return node.left().x;
      });
      var right = d3.max(this.nodes(), node => {
        return node.right().x;
      });
      var top = d3.min(this.nodes(), node => {
        return node.top().y;
      });
      var bottom = d3.max(this.nodes(), node => {
        return node.bottom().y;
      });

      var s = d3.min([1, 0.9 * d3.min([
          this.displayWidth / (right - left),
          this.displayHeight / (bottom - top)]) || 1]);
      var translate = new Svg.Transform.Translate(
          (this.displayWidth - (right - left) * s) / 2,
          (this.displayHeight - (bottom - top) * s) / 2
          );
      var scale = new Svg.Transform.Scale(s);
      this.contentsZoomBehavior.translate([translate.x, translate.y]);
      this.contentsZoomBehavior.scale(scale.sx);
      this.contentsSelection
        .transition()
        .attr("transform", translate.toString() + scale.toString());
      return this;
    }


    /**
     * @method selectElement
     * @param selection {D3.Selection}
     */
    selectElement(selection : D3.Selection) : void {
      this.rootSelection.selectAll(".selected").classed("selected", false);
      selection.classed("selected", true);
      this.drawNodeConnection();
    }


    /**
     * @method selectedNode
     * @return {egrid.Node}
     */
    selectedNode() : Node {
      var selection = this.rootSelection.select(".selected");
      return selection.empty() ? null : selection.datum();
    }


    /**
     * @method unselectElement
     */
    unselectElement() {
      this.rootSelection.selectAll(".selected").classed("selected", false);
      this.rootSelection.selectAll(".connected").classed("connected", false);
      this.rootSelection.selectAll(".link .removeLinkButton")
        .attr("opacity", 0)
        ;
    }


    dragNode() : DragNode {
      var egm = this;
      var isDroppable_;
      var dragToNode_;
      var dragToOther_;
      var f : any = function(selection : D3.Selection) : DragNode {
        var from;
        selection.call(d3.behavior.drag()
            .on("dragstart", () => {
              from = d3.select(".selected");
              from.classed("dragSource", true);
              var pos = [from.datum().center().x, from.datum().center().y];
              egm.rootSelection.select(".contents")
                .append("line")
                .classed("dragLine", true)
                .attr("x1", pos[0])
                .attr("y1", pos[1])
                .attr("x2", pos[0])
                .attr("y2", pos[1])
                ;
              d3.event.sourceEvent.stopPropagation();
            })
            .on("drag", () => {
              var dragLineSelection = egm.rootSelection.select(".dragLine");
              var x1 = Number(dragLineSelection.attr("x1"));
              var y1 = Number(dragLineSelection.attr("y1"));
              var p2 = egm.getPos(egm.rootSelection.select(".contents").node());
              var x2 = p2.x;
              var y2 = p2.y;
              var theta = Math.atan2(y2 - y1, x2 - x1);
              var r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) - 10;
              dragLineSelection
                .attr("x2", x1 + r * Math.cos(theta))
                .attr("y2", y1 + r * Math.sin(theta))
                ;
              var pos = egm.getPos(document.body);
              var to = d3.select(document.elementFromPoint(pos.x, pos.y).parentNode);
              var fromNode : Node = from.datum();
              var toNode : Node = to.datum();
              if (to.classed("element") && !to.classed("selected")) {
                if (isDroppable_ && isDroppable_(fromNode, toNode)) {
                  to.classed("droppable", true);
                } else {
                  to.classed("undroppable", true);
                }
              } else {
                egm.rootSelection.selectAll(".droppable, .undroppable")
                  .classed("droppable", false)
                  .classed("undroppable", false)
                  ;
              }
            })
            .on("dragend", () => {
              var pos = egm.getPos(document.body);
              var to = d3.select(document.elementFromPoint(pos.x, pos.y).parentNode);
              var fromNode : Node = from.datum();
              var toNode : Node = to.datum();
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
            }))
            ;
        return this;
      }
      f.isDroppable_ = (from : Node, to : Node) : boolean => true;
      f.isDroppable = function(f : (from : Node, to : Node) => boolean) : DragNode {
        isDroppable_ = f;
        return this;
      }
      f.dragToNode = function(f : (from : Node, to : Node) => void) : DragNode {
        dragToNode_ = f;
        return this;
      }
      f.dragToOther = function(f : (from : Node) => void) : DragNode {
        dragToOther_ = f;
        return this;
      }
      return f;
    }


    raddering(selection : D3.Selection, type : Raddering) : void {
      var dragToNode = (fromNode : Node, toNode : Node) : void => {
        switch (type) {
        case Raddering.RadderUp:
          if (this.grid().hasLink(toNode.index, fromNode.index)) {
            var link = this.grid().link(toNode.index, fromNode.index);
            this.grid().incrementLinkWeight(link.index);
            this.draw();
          } else {
            this.grid().radderUp(fromNode.index, toNode.index);
            this.draw();
            this.drawNodeConnection();
            this.focusNode(toNode);
          }
          break;
        case Raddering.RadderDown:
          if (this.grid().hasLink(fromNode.index, toNode.index)) {
            var link = this.grid().link(fromNode.index, toNode.index);
            this.grid().incrementLinkWeight(link.index);
            this.draw();
          } else {
            this.grid().radderDown(fromNode.index, toNode.index);
            this.draw();
            this.drawNodeConnection();
            this.focusNode(toNode);
          }
          break;
        }
        this.notify();
      };

      selection.call(this.dragNode()
          .isDroppable((fromNode : Node, toNode : Node) : boolean => {
            return !((type == Raddering.RadderUp && this.grid().hasPath(fromNode.index, toNode.index))
              || (type == Raddering.RadderDown && this.grid().hasPath(toNode.index, fromNode.index)))
          })
          .dragToNode(dragToNode)
          .dragToOther((fromNode : Node) : void => {
            var openPrompt;
            switch (type) {
            case Raddering.RadderUp:
              openPrompt = this.openLadderUpPrompt;
              break;
            case Raddering.RadderDown:
              openPrompt = this.openLadderDownPrompt;
              break;
            }

            openPrompt && openPrompt(text => {
              if (text) {
                var node;
                if (node = this.grid().findNode(text)) {
                  dragToNode(fromNode, node);
                } else {
                  node = this.createNode(text);
                  switch (type) {
                  case Raddering.RadderUp:
                    this.grid().radderUpAppend(fromNode.index, node);
                    break;
                  case Raddering.RadderDown:
                    this.grid().radderDownAppend(fromNode.index, node);
                    break;
                  }
                  this.draw();
                  this.drawNodeConnection();
                  this.focusNode(node);
                  this.notify();
                }
              }
            })
          }));
    }


    private getPos(container) : Svg.Point {
      var xy = d3.event.sourceEvent instanceof MouseEvent
        ? d3.mouse(container)
        : d3.touches(container, d3.event.sourceEvent.changedTouches)[0];
      return new Svg.Point(xy[0], xy[1]);
    }


    showRemoveLinkButton() : boolean;
    showRemoveLinkButton(flag : boolean) : EGM;
    showRemoveLinkButton(arg? : boolean) : any {
      if (arg === undefined) {
        return this.removeLinkButtonEnabled;
      }
      this.removeLinkButtonEnabled = arg;
      return this;
    }


    /**
     * @method appendNode
     * @return {egrid.EGM}
     */
    appendNode(text : string) : EGM {
      if (text) {
        var node;
        if (node = this.grid().findNode(text)) {
          // node already exists
        } else {
          // create new node
          node = this.createNode(text);
          node.original = true;
          this.grid().appendNode(node);
          this.draw();
        }
        var addedElement = this.contentsSelection
            .selectAll(".element")
            .filter(node => node.text == text);
        this.selectElement(addedElement);
        this.focusNode(addedElement.datum());
        this.notify();
      }
      return this;
    }


    /**
     * @method removeSelectedNode
     * @return {egrid.EGM}
     */
    removeSelectedNode() : EGM {
      return this.removeNode(this.selectedNode());
    }


    /**
     * @method removeNode
     * @return {egrid.EGM}
     */
    removeNode(node : Node) : EGM {
      if (node) {
        this.unselectElement();
        this.grid().removeNode(node.index);
        this.draw();
        this.notify();
      }
      return this;
    }


    /**
     * @method mergeNode
     * @return {egrid.EGM}
     */
    mergeNode(fromNode : Node, toNode : Node) : EGM {
      if (fromNode && toNode) {
        this.grid().mergeNode(fromNode.index, toNode.index);
        this.draw();
        this.unselectElement();
        this.focusNode(toNode);
        this.notify()
      }
      return this;
    }


    /**
     * @method editSelectedNode
     * @return {egrid.EGM}
     */
    editSelectedNode(text : string) : EGM {
      return this.editNode(this.selectedNode(), text);
    }


    /**
     * @method editNode
     * @return {egrid.EGM}
     */
    editNode(node : Node, text : string) : EGM {
      if (node && text) {
        this.grid().updateNodeText(node.index, text);
        this.draw();
        this.notify();
      }
      return this;
    }
  }
}
