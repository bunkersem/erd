var appDrag = null;
var mouseDown = false;
var $userDragElem = $('#user-drag-rect');

// Register mouse down
$(document).on('mousedown', function(e) {
    mouseDown = true;
});

// Register mouse up
$(document).on('mouseup', function(e) {
    mouseDown = false;
});


// register drag start
$(document).on('mousedown', '#app .paper-container', function (e) {
    appDrag = null;
    if ($(e.target).is('.joint-type-html-element.joint-element rect')) {
        // We are not dragging a rectangle. We are moving an entity.
        return;
    }
    if ($(e.target).is('.html-element, .html-element *')) {
        // We are not dragging a rectangle. We are clicking on the html-element entity.
        return;
    }
    console.log('dragstart', e.target);
    appDrag = { x: e.clientX, y: e.clientY };
});

$(document).on('mouseup', '#app', function (e) {
    if (appDrag === null) {
        console.error('dragged without starting. drag is invalid');
        return;
    }
    var currentMouseDown = { x: e.clientX, y: e.clientY };
    console.log(appDrag, currentMouseDown)
    if (Math.abs((appDrag.x - currentMouseDown.x) + (appDrag.y - currentMouseDown.y)) < 3) {
        // This was not a drag.
        console.log('this was not a drag')
        return;
    }
    console.log('dragged from', appDrag, 'to', currentMouseDown);
    appDrag = null;
});

// Draw drag rectangle
$(document).on('mousemove', '#app', function (e) {
    if (appDrag === null) {
        // we are not dragging
        return;
    }
    if (mouseDown === false) {
        // We are not dragging
        appDrag = null;
        return;
    }
    var currentMouseDown = { x: e.clientX, y: e.clientY };
    var rect = {
        top: Math.min(appDrag.y, currentMouseDown.y), 
        left: Math.min(appDrag.x, currentMouseDown.x),
        bottom: Math.max(appDrag.y, currentMouseDown.y),
        right: Math.max(appDrag.x, currentMouseDown.x),
    }
    console.log('drawing dragging rectangle');
    $userDragElem.css('display', 'block');
    $userDragElem.css('left', rect.left);
    $userDragElem.css('top', rect.top);
    $userDragElem.css('width', rect.right - rect.left);
    $userDragElem.css('height', rect.bottom - rect.top);
});
// UnDraw drag recangle
$(document).on('mouseup', function (e) {
    $userDragElem.css('display', 'none');
})

$(document).on('click', '#app .paper-container', function (e) {
    console.log('click', e.target);
});