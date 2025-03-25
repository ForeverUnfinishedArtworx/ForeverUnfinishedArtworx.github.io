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
let selectedColor = '#FFFF00'; // Default color is now bright yellow
let selectedLineWidth = 5; //changed the default line width, this is the line width of the drawing tool
let mirrorPoints = 9; // Starting mirrors set to 9
let selectedBrushType = "Medium"; // Added a variable to keep track of the selected brush type
let isErasing = false; //flag to know if we are in eraser mode
let eraserWidth = 5;
let mainImage = ""; // removed default image
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
    //add a white border
    ctx.strokeStyle = "white";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// Call the function on load and on resize
window.addEventListener('load', updateCanvasSize);//
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

// Event listener for form submission
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the user's email
    const email = document.getElementById('userEmail').value;

    // Get the canvas data as a Blob
    canvas.toBlob(function(blob) {
        // Create a FormData object
        const formData = new FormData();
        
        // Append the email to the form data
        formData.append('email', email);
        
        // Append the canvas data as a file to the form data
        formData.append('image', blob, 'my-drawing.png');

        // Send the data using fetch
        fetch('https://formspree.io/f/mwplbjba', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                alert('Email sent successfully!');
            } else {
                alert('Error sending email.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred.');
        });
    }, 'image/png'); // Specify the type of the image
});

//set the number of mirrors to 9
const mirrorSelect = document.getElementById('mirrorSelect');
for (let i = 1; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    mirrorSelect.appendChild(option);
}

mirrorSelect.value = 9;
mirrorSelect.addEventListener('change', function () {
    mirrorPoints = parseInt(this.value);
});
