var canvas = document.getElementById("canvas");
var buttons = document.getElementsByClassName("button");
var shapes = document.getElementsByClassName('shape');
var eraser = document.getElementById('eraser-image');
var activeNodes = canvas.getElementsByTagName('div');
var clearButton = document.getElementById('clear-button');
var submitButton = document.getElementById('size-form');
var colorPicker = document.getElementById('color-input');
var saveButton = document.getElementById('save-button');
var loadButton = document.getElementById('load-button');
// assign the initial computed height and width of the canvas

canvas.style.height = `${parseInt(window.getComputedStyle(canvas, null).getPropertyValue("height"))}px`;
canvas.style.width = `${parseInt(window.getComputedStyle(canvas, null).getPropertyValue("width"))}px`;

for(var i =0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', changeActiveButton);
}

for (var i = 0; i < shapes.length; i++) {
    shapes[i].addEventListener('click', changeActiveShape);
}

colorPicker.addEventListener('click', function(e) {
    if (eraser.classList.contains('active-eraser')) {
        eraser.classList.remove('active-eraser');
    }
    if (document.getElementsByClassName('active-button').length !== 0) {
        var active_button = document.getElementsByClassName('active-button')[0];
        active_button.classList.remove('active-button');
    }
    if(!colorPicker.classList.contains('active-color-input')) {
        colorPicker.classList.add('active-color-input');
    }
});

loadButton.addEventListener('click', load);
saveButton.addEventListener('click', save);

submitButton.addEventListener('submit', changeCanvasSize);

clearButton.addEventListener('click', eliminateNodes);

eraser.addEventListener('click', toggleActiveEraser);

canvas.addEventListener('mouseover', changeToBrushIcon);
canvas.addEventListener('mouseleave', changeToDefaultIcon );

canvas.addEventListener("mousedown", function (e) {
    
    canvas.onmousemove = function (e) {
        var rect = canvas.getBoundingClientRect();
        
        if (eraser.classList.contains('active-eraser')) {
            eraseOnCanvas(e);
        }
        else if (Math.floor(e.clientY - rect.top) <= (parseInt(canvas.style.height) -10) //in order for the paint to stay inside the canvas
            && Math.floor(e.clientX - rect.left) <= (parseInt(canvas.style.width) - 10)) { //in order for the paint to stay inside the canvas
            paintOnCanvas(e);
        }
    };
});

canvas.addEventListener("mouseup", function (e) {
    canvas.onmousemove = null
});

function changeCanvasSize(e) {
    e.preventDefault();
    var userCanvasWidth = document.getElementById('user-canvas-width');
    var userCanvasHeight = document.getElementById('user-canvas-height');
    canvas.style.width = `${userCanvasWidth.value}px`;
    canvas.style.height = `${userCanvasHeight.value}px`;
}

function eliminateNodes() {
    while(activeNodes.length > 0) {
        canvas.removeChild(activeNodes[0]);
    }
}

function toggleActiveEraser(e) {
    if(!eraser.classList.contains('active-eraser')) {
        eraser.classList.add('active-eraser');
        if (document.getElementsByClassName('active-button').length !== 0) {
            var active_button = document.getElementsByClassName('active-button')[0];
            active_button.classList.remove('active-button');
        }
        if (colorPicker.classList.contains('active-color-input')) {
            colorPicker.classList.remove('active-color-input');
        }
    }
}

function changeToBrushIcon() {
    if(eraser.classList.contains('active-eraser')) {
        document.body.style.cursor = "url('./media/eraser-brush.png'), auto"
    } else {
        document.body.style.cursor = "url('./media/brush.png'), auto";
    }
}
function changeToDefaultIcon() {
    document.body.style.cursor = "auto";
}

function createDivNode() {
    var node = document.createElement('div');
    node.style.display = 'inline-block';
    node.style.position = "absolute";
    node.style.width = `${returnActiveShape()['width']}`;
    node.style.height = `${returnActiveShape()['height']}`;
    node.style.borderRadius = `${returnActiveShape()['borderRadius']}`;
    node.style.padding = `${returnActiveSize()}`;
    node.style.backgroundColor = `${returnActiveColor()}`;
    return node;
}
function eraseOnCanvas(e) {
    var rect = canvas.getBoundingClientRect();
    for (let i=0; i < activeNodes.length; i++) {
        var dy = Math.floor(e.clientY - rect.top) - parseInt(activeNodes[i].style.top);
        var dx = Math.floor(e.clientX - rect.left) - parseInt(activeNodes[i].style.left);
        var distance = Math.sqrt(dx * dx + dy * dy); //proximity between eraser and nodes
        if(distance <= 20) {
            canvas.removeChild(activeNodes[i]);
        }
    }
}

function paintOnCanvas(event) {
    var node = createDivNode();
    var rect = canvas.getBoundingClientRect();
    var posY = Math.floor(event.clientY - rect.top);
    var posX = Math.floor(event.clientX - rect.left);
    node.style.top = `${posY}px`;
    node.style.left = `${posX}px`;
    canvas.appendChild(node);
}
function changeActiveButton() {
    if (eraser.classList.contains('active-eraser')) {
        eraser.classList.remove('active-eraser');
        this.classList.add('active-button');
    }
    if (colorPicker.classList.contains('active-color-input')) {
        colorPicker.classList.remove('active-color-input');
    }
    if (document.getElementsByClassName('active-button').length === 0) {
        this.classList.add('active-button');
    } else {
        var active_button = document.getElementsByClassName('active-button')[0];
        active_button.classList.remove('active-button');
        this.classList.add('active-button');
    }
}
function changeActiveShape() {
    var active_shape = document.getElementsByClassName('active-shape')[0];
    active_shape.classList.remove('active-shape');
    this.classList.add('active-shape');
}
function returnActiveColor() {
    if (document.getElementsByClassName('active-button').length === 0) {
        return colorPicker.value;
    } else {
        var active_button = document.getElementsByClassName('active-button')[0];
        var active_button_color = window.getComputedStyle(active_button).getPropertyValue('background-color');
        return `${active_button_color}`;
    }
}
function returnActiveShape() {
    var active_shape = document.getElementsByClassName('active-shape')[0];
    var active_shape_obj = {
        height: "",
        width: "",
        borderRadius: ""
    }
    
    if (active_shape.classList.contains('circle')) {
        active_shape_obj['height'] = '5px';
        active_shape_obj['width'] = '5px';
        active_shape_obj['borderRadius'] = '50%';
    } else if (active_shape.classList.contains('square')) {
        active_shape_obj['height'] = '5px';
        active_shape_obj['width'] = '5px';
        active_shape_obj['borderRadius'] = '0';
    } else if (active_shape.classList.contains('line')) {
        active_shape_obj['height'] = '5px';
        active_shape_obj['width'] = '20px';
        active_shape_obj['borderRadius'] = '0';
    } // can add more shapes after this line

    return active_shape_obj;
}
function returnActiveSize() {
    var brush_size = document.getElementsByName('brush-size');
    console.log(brush_size);
    var active_brush_size = brush_size['0'].options[brush_size['0']['selectedIndex']].value + 'px';
    return active_brush_size;
}

function save() {
    var canvasLeftBound = canvas.getBoundingClientRect().left;
    var canvasTopBound = canvas.getBoundingClientRect().top;
    var SavedDrawingObj = {};
    SavedDrawingObj["paintNodes"] = [];
    for( let i = 0; i < activeNodes.length; i++) {
        var nodeObj = {};
        nodeObj["top"] = activeNodes[i].getBoundingClientRect().top - canvasTopBound;
        nodeObj["left"] = activeNodes[i].getBoundingClientRect().left - canvasLeftBound;
        nodeObj["width"] = activeNodes[i].style.width;
        nodeObj["height"] = activeNodes[i].style.height;
        nodeObj["borderRadius"] = activeNodes[i].style.borderRadius;
        nodeObj["padding"] = activeNodes[i].style.padding;
        nodeObj["backgroundColor"] = activeNodes[i].style.backgroundColor;
        SavedDrawingObj["paintNodes"].push(nodeObj);
    }
    localStorage.setItem('drawing', JSON.stringify(SavedDrawingObj));
    alert('Drawing Saved');
}

function load() {
    var loadedDrawingObj = JSON.parse(localStorage.getItem('drawing'));
    eliminateNodes(); //clearing the canvas before loading
    for (let i = 0; i < loadedDrawingObj["paintNodes"].length; i++) {
        var node = document.createElement('div');
        node.style.display = 'inline-block';
        node.style.position = "absolute";
        node.style.width = loadedDrawingObj["paintNodes"][i]["width"];
        node.style.height = loadedDrawingObj["paintNodes"][i]["height"];
        node.style.borderRadius = loadedDrawingObj["paintNodes"][i]["borderRadius"];
        node.style.padding = loadedDrawingObj["paintNodes"][i]["padding"];
        node.style.backgroundColor = loadedDrawingObj["paintNodes"][i]["backgroundColor"];
        node.style.top = loadedDrawingObj["paintNodes"][i]["top"] + 'px';
        node.style.left = loadedDrawingObj["paintNodes"][i]["left"] + 'px';
        canvas.appendChild(node);
    }
    alert('Drawing loaded');

}

/*
bug:
right and buttom get a little outside of the canvas.
*/