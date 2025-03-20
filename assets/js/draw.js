const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvasContainer = document.querySelector('.canvas-container');
let canvasWidth = 1000;
let canvasHeight = 400; //changed the default height
const originalAspectRatio = canvasWidth / canvasHeight;
let centerX = canvasWidth / 2;
let centerY = canvasHeight / 2;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isSymmetric = false;
let selectedColor = '#D71E09'; // Default color is now red
let selectedLineWidth = 5; //changed the default line width, this is the line width of the drawing tool
let mirrorPoints = 1;
let selectedBrushType = "Medium"; // Added a variable to keep track of the selected brush type
let isErasing = false; //flag to know if we are in eraser mode
let eraserWidth = 5;
let mainImage = "apple";
let isDrawingImage = false;
let imageX = 0;
let imageY = 0;
let imageWidth = 0;
let imageHeight = 0;
let initialImageWidth = 0;
let initialImageHeight = 0;

// Function to update the canvas size
function updateCanvasSize() {
    const containerWidth = canvasContainer.offsetWidth;
    const newCanvasWidth = containerWidth;
    const newCanvasHeight = newCanvasWidth / originalAspectRatio;
    canvas.width = newCanvasWidth;
    canvas.height = newCanvasHeight;
    canvasWidth = newCanvasWidth;
    canvasHeight = newCanvasHeight;
    // Update the center after the size is updated
    centerX = canvasWidth / 2;
    centerY = canvasHeight / 2;
    // Redraw everything
    applyDrawingStyles();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Call the function on load and on resize
window.addEventListener('load', updateCanvasSize);
window.addEventListener('resize', updateCanvasSize);
function applyDrawingStyles() {
    ctx.lineWidth = selectedLineWidth;
    ctx.strokeStyle = selectedColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    //ctx.globalCompositeOperation = 'source-over'; // Default drawing mode
}
function canvasTouched(event) {
    //console.log("canvas touched");
    isDrawing = true;
    let rect = canvas.getBoundingClientRect();
    lastX = event.clientX - rect.left;
    lastY = event.clientY - rect.top;
}
function canvasUntouched() {
    //console.log("canvas untouched");
    isDrawing = false;
}
function draw(event) {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        let rect = canvas.getBoundingClientRect();
        let currentX = event.clientX - rect.left;
        let currentY = event.clientY - rect.top;
        ctx.lineTo(currentX, currentY);
        if (isErasing) {
            ctx.globalCompositeOperation = 'destination-out'; // Set composite operation to erase
            ctx.strokeStyle = `rgba(0,0,0,1)`; //make the eraser always black
            ctx.lineWidth = eraserWidth;
        } else {
            ctx.globalCompositeOperation = 'source-over'; // Reset composite operation
            applyDrawingStyles();
        }
        ctx.stroke();
        lastX = currentX;
        lastY = currentY;
    }
}


// Add event listeners to handle drawing
canvas.addEventListener('mousedown', canvasTouched);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', canvasUntouched);
canvas.addEventListener('mouseout', canvasUntouched);
canvas.addEventListener('touchstart', canvasTouched);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', canvasUntouched);

// Event listener for the eraser button
document.getElementById('eraserButton').addEventListener('click', function () {
    isErasing = !isErasing; // Toggle eraser mode
    if (isErasing) {
        this.style.backgroundColor = "red";
    } else {
        this.style.backgroundColor = "";
    }
});

// Event listener for eraser size changes
document.getElementById('eraserSize').addEventListener('change', function () {
    eraserWidth = parseInt(this.value); // Update eraser width
});

// Event listener for download button
document.getElementById('downloadButton').addEventListener('click', function () {
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
});
