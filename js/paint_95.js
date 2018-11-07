var canvas = document.getElementById("canvas");
var rect = canvas.getBoundingClientRect();
var buttons = document.getElementsByClassName("button");
var shapes = document.getElementsByClassName('shape');
var eraser = document.getElementById('eraser-image');
var activeNodes = canvas.getElementsByTagName('div');
var clearButton = document.getElementById('clear-button');

for(var i =0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', changeActiveButton);
}

for (var i = 0; i < shapes.length; i++) {
    shapes[i].addEventListener('click', changeActiveShape);
}

clearButton.addEventListener('click', eliminateNodes);

eraser.addEventListener('click', toggleActiveEraser);

canvas.addEventListener('mouseover', changeToBrushIcon);
canvas.addEventListener('mouseleave', changeToDefaultIcon );

canvas.addEventListener("mousedown", function (e) {
    // mouseDownFunction(e);
    
    canvas.onmousemove = function (e) {
        if (eraser.classList.contains('active-eraser')) {
            eraseOnCanvas(e);
        }
        else if (document.getElementsByClassName('active-button')[0].classList.contains('active-button')) {
            paintOnCanvas(e);
        }
    };
});

canvas.addEventListener("mouseup", function (e) {
    canvas.onmousemove = null
});

function eliminateNodes(e) {
    do {
        canvas.removeChild(activeNodes[0]);
    } while(activeNodes.length > 0);
}

function toggleActiveEraser(e) {
    if(!eraser.classList.contains('active-eraser')) {
        eraser.classList.add('active-eraser');
        var active_button = document.getElementsByClassName('active-button')[0];
        active_button.classList.remove('active-button');
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
function eraseOnCanvas(e) { //new code
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
    var active_button = document.getElementsByClassName('active-button')[0];
    var active_button_color = window.getComputedStyle(active_button).getPropertyValue('background-color');
    return `${active_button_color}`;
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

/*
bug:
right and buttom get a little outside of the canvas.
*/