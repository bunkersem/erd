var App = window.App || {};

(function (_, joint) {

    'use strict';
    console.log('erd');

    App.MainView = joint.mvc.View.extend({

        className: 'app',

        events: {
            'focus input[type="range"]': function (evt) { evt.target.blur(); }
        },

        init: function () {

            this.initializePaper();
        },

        initializePaper: function () {
            var graph = window.graph = this.graph = new joint.dia.Graph;
            var paper = new joint.dia.Paper({
                width: 1000,
                height: 1000,
                gridSize: 10,
                drawGrid: true,
                model: graph,
                el: '#paper',
                defaultLink: new joint.shapes.app.Link
            });

            paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
            paper.on('cell:mousewheel', this.onMousewheel, this);

            console.log(paper);

            graph.on('add', function (cell, collection, opt) {
                if (opt.stencil) this.createInspector(cell);
            }, this);

            

            // Create JointJS elements and add them to the graph as usual.
            // -----------------------------------------------------------

            var el1 = new joint.shapes.html.Element({
                position: { x: 80, y: 80 },
                size: { width: 170, height: 100 },
                input: 'I am HTML',
                propshtml: 'props1',
                select: 'one'
            });
            var el2 = new joint.shapes.html.Element({
                position: { x: 370, y: 160 },
                size: { width: 170, height: 100 },
                input: 'Me too',
                propshtml: 'props2',
                select: 'two'
            });
            var l = new joint.dia.Link({
                source: { id: el1.id },
                target: { id: el2.id },
                attrs: { '.connection': { 'stroke-width': 2, stroke: '#34495E' } }
            });

            graph.addCells([el1, el2, l]);
        },

        changeSnapLines: function (checked) {

            if (checked) {
                this.snaplines.startListening();
                this.stencil.options.snaplines = this.snaplines;
            } else {
                this.snaplines.stopListening();
                this.stencil.options.snaplines = null;
            }
        },

        onMousewheel: function (cellView, evt, x, y, delta) {

        },

        layoutDirectedGraph: function () {

            joint.layout.DirectedGraph.layout(this.graph, {
                setLinkVertices: true,
                rankDir: 'TB',
                marginX: 100,
                marginY: 100
            });
        }
    });

})(_, joint);