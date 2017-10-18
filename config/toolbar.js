$(document).on('click', '.stencil-container .create-rect', function(e) {
    console.log('click')
    var el1 = new joint.shapes.html.Element({
        position: { x: 80 + Math.random() * 100, y: 80 + Math.random() * 100 },
        size: { width: 170, height: 100 },
        input: 'I am HTML',
        propshtml: 'props1',
        select: 'one'
    });
    graph.addCells([el1]);
});