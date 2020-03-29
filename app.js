canvas1 = document.getElementById("main");
const ctx1 = canvas1.getContext("2d");

canvas2 = document.createElement("canvas");
const ctx2 = canvas2.getContext("2d");

let positionX = 0;
let positionY = 0;

let offsetX = 0;
let offsetY = 0;

let scaleX = 1;
let scaleY = 1; //Should be the exact same
//scaleX === scaleY

const deltaScale = 1.001;

//mouseEvent.offsetX and mouseEvent.offsetY
//mouse.which

/*
onmousemove
onmouseup
onmousedown
*/

document.body.addEventListener(
    "touchstart",
    function(e) {
        if (e.target.nodeName == "CANVAS") {
            e.preventDefault();
        }
    },
    false
);
document.body.addEventListener(
    "touchend",
    function(e) {
        if (e.target.nodeName == "CANVAS") {
            e.preventDefault();
        }
    },
    false
);
document.body.addEventListener(
    "touchmove",
    function(e) {
        if (e.target.nodeName == "CANVAS") {
            e.preventDefault();
        }
    },
    false
);

let mousePressed = false;

let drawing = []; //An array of objects:
let pos = -1;

/*

each drawing object will have properties:

color
width
positionX: []
positionY: []

*/

let mode = "draw";

const drawLabel = document.getElementById("mode-label");

const selectButton = document.getElementById("select");
selectButton.addEventListener("click", (e) => {
    mode = "select";
    updateModeLabel(mode);
});

const drawButton = document.getElementById("draw");
drawButton.addEventListener("click", (e) => {
    mode = "draw";
    updateModeLabel(mode);
});

const eraseButton = document.getElementById("eraser");
eraseButton.addEventListener("click", (e) => {
    mode = "erase";
    updateModeLabel(mode);
});

function updateModeLabel(mode) {
    drawLabel.innerHTML = `Mode: ${mode}`;
}

const rect = canvas1.getBoundingClientRect();

function convertToCanvasMouse(e) {
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function convertToCanvasTouch(e) {
    return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
    };
}

let selectX = 0;
let selectY = 0;

canvas1.addEventListener("wheel", (e) => {
    //console.log(e.deltaY);

    const mouse = convertToCanvasMouse(e);

    //Zoom in at mousePosition, if e.deltaY == 3 and zoom out if e.deltaY == -3

    if (e.deltaY == 3) {
        //Zoom out if still can
        zoomOut(mouse);
    } else {
        //Zoom in if still can
        zoomIn(mouse);
    }
});

canvas1.addEventListener("mousemove", (e) => {
    //console.log("onmousemove", e);

    const mouse = convertToCanvasMouse(e);

    if (mousePressed) {
        if (mode === "draw") {
            drawing[pos].positionX.push(toWorldSpaceX(mouse.x));
            drawing[pos].positionY.push(toWorldSpaceY(mouse.y));
            drawing[pos].pos++;
            drawLine(drawing[pos]);
        } else if (mode == "select") {
            pan(mouse);
        }
    }
});

canvas1.addEventListener("mouseup", (e) => {
    //console.log("onmouseup", e);
    mousePressed = false;
});

canvas1.addEventListener("mousedown", (e) => {
    //console.log("onmousedown", e);
    console.log(e.which);

    const mouse = convertToCanvasMouse(e);

    if (e.which == 1) {
        mousePressed = true;
        if (mode === "draw") {
            drawing.push({
                color: "#000000",
                width: 3,
                pos: 0,
                positionX: [toWorldSpaceX(mouse.x)],
                positionY: [toWorldSpaceY(mouse.y)]
            });
            pos++;
            drawLine(drawing[pos]);
        } else if (mode === "select") {
            selectX = mouse.x;
            selectY = mouse.y;
        }
    }
});

canvas1.addEventListener("touchmove", (e) => {
    console.log("Hello World");
    e.preventDefault();
    //console.log("onmousemove", e);

    const mouse = convertToCanvasTouch(e);
    console.log("touchmove", e);

    if (mousePressed) {
        if (mode === "draw") {
            drawing[pos].positionX.push(toWorldSpaceX(mouse.x));
            drawing[pos].positionY.push(toWorldSpaceY(mouse.y));
            drawing[pos].pos++;
            drawLine(drawing[pos]);
        } else if (mode == "select") {
            pan(mouse);
        }
    }
});

canvas1.addEventListener("touchend", (e) => {
    e.preventDefault();
    //console.log("onmouseup", e);
    mousePressed = false;
});

canvas1.addEventListener("touchstart", (e) => {
    //console.log("onmousedown", e);
    e.preventDefault();

    const mouse = convertToCanvasMouse(e);

    mousePressed = true;
    if (mode === "draw") {
        drawing.push({
            color: "#000000",
            width: 3,
            pos: 0,
            positionX: [toWorldSpaceX(mouse.x)],
            positionY: [toWorldSpaceY(mouse.y)]
        });
        pos++;
        drawLine(drawing[pos]);
    } else if (mode === "select") {
        selectX = mouse.x;
        selectY = mouse.y;
    }
});
/*
if(currPosX > offsetX && currPosX < offsetX + canvas1.width / scaleX)
*/
function toWorldSpaceX(positionX) {
    return positionX + offsetX;
}

function toWorldSpaceY(positionY) {
    return positionY + offsetY;
}

function toScreenSpaceX(positionX) {
    return positionX - offsetX;
}

function toScreenSpaceY(positionY) {
    return positionY - offsetY;
}

function zoomIn(mouse) {}

function zoomOut(mouse) {}

function pan(mouse) {
    clearImage();
    offsetX -= mouse.x - selectX;
    offsetY -= mouse.y - selectY;
    redraw();

    selectX = mouse.x;
    selectY = mouse.y;
}

function redraw() {
    for (let i = 0; i < drawing.length; i++) {
        ctx1.strokeStyle = drawing[i].color;
        ctx1.lineWidth = drawing[i].width;
        for (let k = 0; k < drawing[i].positionX.length; k++) {
            let currPos = k + 1;
            let previousPos = k;
            if (k == drawing[i].positionX.length - 1) {
                currPos = previousPos;
            }

            let currDrawObject = drawing[i];
            //Draw the line
            ctx1.beginPath();
            ctx1.moveTo(
                toScreenSpaceX(currDrawObject.positionX[previousPos]),
                toScreenSpaceY(currDrawObject.positionY[previousPos])
            );
            ctx1.lineTo(
                toScreenSpaceX(currDrawObject.positionX[currPos]),
                toScreenSpaceY(currDrawObject.positionY[currPos])
            );
            ctx1.stroke();
        }
    }
}

function drawLine(currDrawObject) {
    //Set the parameters of the drawing
    ctx1.strokeStyle = currDrawObject.color;
    ctx1.lineWidth = currDrawObject.width;

    const currPos = currDrawObject.pos;

    const previousPos = currPos === 0 ? 0 : currPos - 1;
    //Draw the line
    ctx1.beginPath();
    ctx1.moveTo(
        toScreenSpaceX(currDrawObject.positionX[previousPos]),
        toScreenSpaceY(currDrawObject.positionY[previousPos])
    );
    ctx1.lineTo(
        toScreenSpaceX(currDrawObject.positionX[currPos]),
        toScreenSpaceY(currDrawObject.positionY[currPos])
    );
    ctx1.stroke();
}

function clearImage() {
    ctx1.fillStyle = "#FFF";
    ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
}

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
    clearImage();
    drawing = [];
    pos = -1;
});
