let symmetry = 12;
let counter;
let img;
let imageSize = 24;
let canvasClicked = false;
let temporaryCanvas = [];
let pastCanvasIndexs = [];
let futureCanvasIndexs = [];
let presentCanvasIndex = 0;
let doingUndo = false;
let doingRedo = false;
let zoomLock = false;
let useBrush = true;
let useEraser = false;
let applyingZoom = false;
let scrollingViewport = true;
let symmetrySliderValue = 12;
let imageSymmetry = 12;
let brushSize = 4;
let shadowSize = 10;
let eraserSize = 14;
let backgroundColor = "#000000";
let brushColor = "#ff0000";
let shadowColor = "#000000";
let showBrushShadow = false;
let randomColor = true;
let randomShadowColor = false;
let mirrorToggle = true;
let centerAtTouch = false;
let eraserSymmetry = true;
let brushStyle = "Line";
let colorType = "Hue";
let randomColorStyle = "Counter";
let symmetryCenterPosition = "Center";
let colorPickerColorValue;
let colorComponentName = "canvasBackgroundColor";

const backgroundColorContainer = document.getElementById("backgroundColorContainer");
let brushShadowToggle = document.getElementById("brushShadowToggle");
let brushColorContainer = document.getElementById("brushColorContainer");
let shadowColorContainer = document.getElementById("shadowColorContainer");
let randomColorToggle = document.getElementById("randomColorToggle");
let centerAtTouchToggle = document.getElementById("centerAtTouchToggle");
let randomShadowColorToggle = document.getElementById("randomShadowColorToggle");
let patternContainer = document.getElementById("patternContainer");
let patternImagesList = document.querySelector(".pattern_images");
let mirrorToggleSwitch = document.getElementById("mirrorToggle");
let eraserSymmetryToggleSwitch = document.getElementById("eraserSymmetryToggle");
let randomColorStyleSelector = document.getElementById("randomColorStyle");
let brushStyleSelector = document.getElementById("brushStyle");
let symmetryCenterSelector = document.getElementById("symmetryCenter");
let colorTypeSelector = document.getElementById("colorType");
let colorPicker = document.getElementById("colorPicker");
let settingsContainer = document.getElementById("settingsContainer");
let symmetrySlider = document.getElementById("symmetrySlider");
let symmetryValue = document.getElementById("symmetryValue");
let fullScreenContainer = document.getElementById("fullScreenContainer");
let brushSizeValue = document.getElementById("brushSizeValue");
let shadowSizeValue = document.getElementById("shadowSizeValue");
let imageSizeValue = document.getElementById("imageSizeValue");
let brushSizeSlider = document.getElementById("brushSizeSlider");
let shadowSizeSlider = document.getElementById("shadowSizeSlider");
let imageSizeSlider = document.getElementById("imageSizeSlider");
let eraserSizeSlider = document.getElementById("eraserSizeSlider");
let eraserSizeValue = document.getElementById("eraserSizeValue");
let imageSymmetryValue = document.getElementById("imageSymmetryValue");
let snackbar = document.getElementById("snackbar");
let windowSize = document.getElementById("canvasSize");
let canvas;
let initialCanvasWidth = 600;
let initialCanvasHeight = 600;

const bhupeshIcon = document.querySelector(".bhupesh-image");
const bhupeshMessageContainer = document.querySelector('.bhupesh-message-container');
const bhupeshMessage = document.querySelector('.bhupesh-message');
const bhupeshEmail = document.getElementById("bhupeshEmail");

setWindowSize();

function setWindowSize() {
    chrome.storage.sync.get({'windowSize' : "large"}, (result) => {
        switch(result.windowSize) {
            case "small":
                setCanvasSize(300, 300);
                break;
            case "medium":
                setCanvasSize(350, 600);
                break;
            case "large":
                setCanvasSize(600, 600);
                break;
            case "large-H":
                setCanvasSize(800, 600);
                break;
        }
        windowSize.value = result.windowSize;
    });


}

function setCanvasSize(width, height) {
    document.body.style.width = "" +width +"px";
    document.body.style.height = "" +height +"px";
    initialCanvasWidth = width;
    initialCanvasHeight = height;
}

windowSize.addEventListener('change', () => {
    chrome.storage.sync.set({"windowSize" : windowSize.value}, () => {});
    //location.reload(true);
    location.reload(true);
});

colorPicker.addEventListener("input", function() {
    colorPickerColorValue = colorPicker.value;
    switch (colorComponentName) {
    case "canvasBackgroundColor":
        backgroundColor = colorPickerColorValue;
        backgroundColorContainer.style.backgroundColor = "" + backgroundColor;
        background("" + backgroundColor);
        break;

    case "brushColor":
        brushColor = colorPickerColorValue;
        brushColorContainer.style.backgroundColor = "" + brushColor;
        randomColor = false;
        randomColorToggle.checked = false;
        break;

    case "shadowColor":
        shadowColor = colorPickerColorValue;
        shadowColorContainer.style.backgroundColor = "" + shadowColor;
        randomShadowColor = false;
        randomShadowColorToggle.checked = false;
        break;
    }
    ;
});

// document.getElementById("aboutButton").addEventListener("click", function() {
//   if (chrome.runtime.openOptionsPage) {
//     chrome.runtime.openOptionsPage();
//   } else {
//     window.open(chrome.runtime.getURL('about.html'));
//   }
// });

document.getElementById("eraserTab").addEventListener("click", (e) => {
  eraserFun(e);
});

document.getElementById("undoButton").addEventListener("click", function() {
    undoCanvas();
});

document.getElementById("redoButton").addEventListener("click", function() {
    redoCanvas();
});

document.getElementById("saveButton").addEventListener("click", function() {
    saveCanvasImage();
});

document.getElementById("settingsButton").addEventListener("click", function() {
    showHideSettings();
});

document.getElementById("clearButton").addEventListener("click", function() {
    clearCanvas();
});

document.getElementById("patternButton").addEventListener("click", function() {
    showHidePatternContainer();
});

randomColorStyleSelector.addEventListener("change", function(event) {
    randomColorStyle = event.currentTarget.value;
});

document.getElementById("backgroundColorSetting").addEventListener("click", function() {
    colorComponentName = "canvasBackgroundColor";
    colorPicker.value = backgroundColor;
});

document.getElementById("brushColorSetting").addEventListener("click", function() {
    colorComponentName = "brushColor";
    colorPicker.value = brushColor;
});

document.getElementById("shadowColorSetting").addEventListener("click", function() {
    colorComponentName = "shadowColor";
    colorPicker.value = shadowColor;
});

bhupeshIcon.addEventListener("click", () => {
    bhupeshMessageContainer.style.display = "flex";
})

bhupeshMessageContainer.addEventListener("click", (e) => {
    bhupeshMessageContainer.style.display = "none";
})

bhupeshEmail.addEventListener('click', e => {
    e.stopPropagation();
});

brushShadowToggle.addEventListener("change", function(event) {
    showBrushShadow = !showBrushShadow;
    if (showBrushShadow && symmetrySliderValue > 15) {
        symmetrySliderValue = 15;
        symmetryValue.textContent = "15";
        symmetrySlider.value = 15;
    }
});

symmetrySlider.addEventListener('input', (e) => {
    symmetrySliderValue = e.target.value;
    symmetryValue.textContent = e.target.value;
});

brushSizeSlider.addEventListener('input', (e) => {
  brushSize = e.target.value;
  brushSizeValue.textContent = e.target.value;
});    

shadowSizeSlider.addEventListener('input', (e) => {
  shadowSize = e.target.value;
  shadowSizeValue.textContent = e.target.value;
});  

mirrorToggleSwitch.addEventListener("change", function(event) {
    mirrorToggle = !mirrorToggle;
});

eraserSymmetryToggleSwitch.addEventListener("change", function(event) {
    eraserSymmetry = !eraserSymmetry;
});

brushStyleSelector.addEventListener("change", function(event) {
    brushStyle = event.currentTarget.value;
});

symmetryCenterSelector.addEventListener("change", function(event) {
    symmetryCenterPosition = event.currentTarget.value;
    centerAtTouch = false;
    centerAtTouchToggle.checked = false;
});

colorTypeSelector.addEventListener("change", function(event) {
    colorType = event.currentTarget.value;
});

randomColorToggle.addEventListener("change", function(event) {
    randomColor = !randomColor;
});

randomShadowColorToggle.addEventListener("change", function(event) {
    randomShadowColor = !randomShadowColor;
    if (randomShadowColor) {
        brushShadowToggle.checked = true;
        showBrushShadow = true;
    }
});

centerAtTouchToggle.addEventListener("change", function(event) {
    centerAtTouch = !centerAtTouch;
});

function openSetting(evt, settingName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    if (settingName == "All") {
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "block";
        }
    } else {
        document.getElementById(settingName).style.display = "block";
    }
    evt.currentTarget.className += " active";
}

fullScreenContainer.addEventListener("click", function(event) {
    if (fullScreenContainer.style.display == "none") {
        fullScreenContainer.style.display = "block";
    } else {
        fullScreenContainer.style.display = "none";
    }
});

patternContainer.addEventListener("click", function(event) {
    if (patternContainer.style.display == "none") {
        patternContainer.style.display = "block";
    } else {
        patternContainer.style.display = "none";
    }
});

settingsContainer.addEventListener("click", function(event) {
    event.stopPropagation();
});

patternImagesList.addEventListener("click", function(event) {
    event.stopPropagation();
});

const patternImages = document.querySelectorAll(".pattern_image_container");
for (var i = patternImages.length - 1; i >= 0; i--) {
    patternImages[i].addEventListener("click", function(event) {
        patternContainer.style.display = "none";
        var patternName = event.currentTarget.getAttribute("data-name");
        changeDrawingPattern(patternName);
        chrome.storage.sync.set({"drawingPattern" : patternName}, () => {});
    });
}

const tabLinks = document.querySelectorAll(".tablinks");
tabLinks.forEach(tab => {
  tab.addEventListener('click', (event) => {
    openSetting(event, tab.dataset.name);
  });
});

chrome.storage.sync.get({'drawingPattern' : "pattern_4"}, (result) => {changeDrawingPattern(result.drawingPattern);});
resetAllSettings();
function setup() {
    canvas = createCanvas(initialCanvasWidth, initialCanvasHeight);
    angleMode(DEGREES);
    background(backgroundColor);
    counter = random(255);
    colorMode(HSB);
    strokeWeight(brushSize);
    //img = new Image();
    //img.crossOrigin = "anonymous";
    //img.src = "images/" +mainImage;
    canvas.touchStarted(canvasTouched);
    canvas.touchEnded(canvasUntouched);
    canvas.mousePressed(canvasTouched);
    //canvas.mouseDragged(canvasTouched);
    canvas.mouseReleased(canvasUntouched);
    for (let i = 0; i < 7; i++) {
        temporaryCanvas[i] = createGraphics(initialCanvasWidth, initialCanvasHeight);
    }
}

function draw() {
    if (useBrush) {
        symmetry = symmetrySliderValue;
    } else {
        symmetry = imageSymmetry;
    }
    
    if (touches.length != 2 && canvasClicked) {

        if (centerAtTouch) {
            translate(originX, originY);
        } else {
            switch (symmetryCenterPosition) {

            case "Center":
                translate(width / 2, height / 2);
                break;

            case "Top Left":
                translate(0, 0);
                break;

            case "Top Right":
                translate(width, 0);
                break;

            case "Bottom Left":
                translate(0, height);
                break;

            case "Bottom Right":
                translate(width, height);
                break;

            case "Top Middle":
                translate(width / 2, 0);
                break;

            case "Right Middle":
                translate(width, height / 2);
                break;

            case "Bottom Middle":
                translate(width / 2, height);
                break;

            case "Left Middle":
                translate(0, height / 2);
                break;

            }
        }

        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {

            let mx, my, pmx, pmy;

            if (centerAtTouch) {
                mx = mouseX - originX;
                my = mouseY - originY;
                pmx = pmouseX - originX;
                pmy = pmouseY - originY;
            } else {
                switch (symmetryCenterPosition) {

                case "Center":
                    mx = mouseX - width / 2;
                    my = mouseY - height / 2;
                    pmx = pmouseX - width / 2;
                    pmy = pmouseY - height / 2;
                    break;

                case "Top Left":
                    mx = mouseX;
                    my = mouseY;
                    pmx = pmouseX;
                    pmy = pmouseY;
                    break;

                case "Top Right":
                    mx = mouseX - width;
                    my = mouseY;
                    pmx = pmouseX - width;
                    pmy = pmouseY;
                    break;

                case "Bottom Left":
                    mx = mouseX;
                    my = mouseY - height;
                    pmx = pmouseX;
                    pmy = pmouseY - height;
                    break;

                case "Bottom Right":
                    mx = mouseX - width;
                    my = mouseY - height;
                    pmx = pmouseX - width;
                    pmy = pmouseY - height;
                    break;

                case "Top Middle":
                    mx = mouseX - width / 2;
                    my = mouseY;
                    pmx = pmouseX - width / 2;
                    pmy = pmouseY;
                    break;

                case "Right Middle":
                    mx = mouseX - width;
                    my = mouseY - height / 2;
                    pmx = pmouseX - width;
                    pmy = pmouseY - height / 2;
                    break;

                case "Bottom Middle":
                    mx = mouseX - width / 2;
                    my = mouseY - height;
                    pmx = pmouseX - width / 2;
                    pmy = pmouseY - height;
                    break;

                case "Left Middle":
                    mx = mouseX;
                    my = mouseY - height / 2;
                    pmx = pmouseX;
                    pmy = pmouseY - height / 2;
                    break;
                }
            }

            if (mouseIsPressed) {
            
                strokeWeight(brushSize);

                if (randomColor) {
                    switch (randomColorStyle) {
                    case "Counter":
                        counter += 3;
                        if (counter > 400) {
                            counter = random(255);
                        }
                        break;

                    case "Touch":
                        break;
                    }

                    switch (colorType) {
                    case "Plane":
                        stroke(counter, 255, 255, 100);
                        break;

                    case "Hue":
                        stroke(counter, getRandomColor(), 255, 100);
                        break;

                    case "Alpha":
                        stroke(counter, getRandomColor(), 255, 0.5);
                        break;
                    }
                } else {
                    switch (brushColor) {
                    case "#000000":
                        stroke(brushColor);
                        break;

                    case "#ffffff":
                        stroke(brushColor);
                        break;

                    default:

                        switch (colorType) {
                        case "Plane":
                            stroke(brushColor);
                            //stroke(hue(brushColor), 255,255, 100);
                            break;

                        case "Hue":
                            stroke(hue(brushColor), getRandomColor(), 255, 100);
                            break;

                        case "Alpha":
                            stroke(hue(brushColor), getRandomColor(), 255, 0.5);
                            break;
                        }

                        break;
                    }
                }

                if (randomShadowColor) {
                    if (!randomColor && randomColorStyle == "Counter") {
                        counter += 3;
                        if (counter > 400) {
                            counter = random(255);
                        }
                    }
                    var color = "hsla(" + counter + ", 100%, 50%, 1)";
                    drawingContext.shadowColor = color;
                } else {
                    drawingContext.shadowColor = shadowColor;
                }

                if (showBrushShadow && !useEraser) {
                    drawingContext.shadowBlur = shadowSize;
                } else {
                    drawingContext.shadowBlur = 0;
                }

                let angle = 360 / symmetry;

                if (useEraser) {
                    if (!zoomLock) {
                        stroke(backgroundColor);
                        fill(backgroundColor);
                        if (eraserSymmetry) {
                            for (let i = 0; i < symmetry; i++) {
                                rotate(angle);
                                circle(mx, my, eraserSize);
                                if (mirrorToggle) {
                                    push();
                                    scale(1, -1);
                                    circle(mx, my, eraserSize);
                                    pop();
                                }
                            }
                        } else {
                            circle(mx, my, eraserSize);
                        }
                    }
                } else {
                    /*
          // generates some uneven symmetry
          if (!useBrush) {
            symmetry = imageSymmetry;
          }*/
                    for (let i = 0; i < symmetry; i++) {
                        rotate(angle);

                        if (!zoomLock) {
                            if (useBrush) {
                                switch (brushStyle) {
                                case "Line":
                                  line(mx, my, pmx, pmy);
                                  break;
                                  
                                case "Star":
                                  triangle(mx, my + 3, mx + 10, my + 20, mx - 10, my + 20);
                                  triangle(mx, my + 25, mx + 10, my + 10, mx - 10, my + 10);
                                  break;
                                  
                                case "Circle":
                                    circle(mx, my, brushSize);
                                    break;

                                case "Square":
                                    square(mx, my, brushSize);
                                    break;

                                case "Triangle":
                                    triangle(mx, my, mx + 10, my + 20, mx - 10, my + 20);
                                    break;

                                case "Pattern 1":
                                    rect(mx, my, 200, 200)
                                  break;
                                }
                            } else {
                                drawingContext.drawImage(img, mx - imageSize / 2, my - imageSize / 2, imageSize, imageSize);
                            }
                            if (mirrorToggle) {
                                push();
                                scale(1, -1);
                                if (useBrush) {

                                    switch (brushStyle) {
                                    case "Line":
                                        line(mx, my, pmx, pmy);
                                        break;

                                    case "Star":
                                        triangle(mx, my + 3, mx + 10, my + 20, mx - 10, my + 20);
                                        triangle(mx, my + 25, mx + 10, my + 10, mx - 10, my + 10);
                                        break;

                                    case "Circle":
                                        circle(mx, my, brushSize);
                                        break;

                                    case "Square":
                                        square(mx, my, brushSize);
                                        break;

                                    case "Triangle":
                                        triangle(mx, my, mx + 10, my + 20, mx - 10, my + 20);
                                        break;

                                    case "Pattern 1":
                                        rect(mx, my, 200, 200)
                                      break;
                                }

                                 
                                } else {
                                    drawingContext.drawImage(img, mx - imageSize / 2, my - imageSize / 2, imageSize, imageSize);
                                }
                                pop();
                            }
                        }
                    }
                }
            }
        }
    }
}

function changeDrawingPattern(patternName) {
  resetAllSettings();
    switch (patternName) {
    case "pattern_1":
        // random brush color on touch
        randomColorStyle = "Touch";
        randomColorStyleSelector.value = randomColorStyle;
        break;

    case "pattern_2":
        // default setting
        break;

    case "pattern_3":
        // center: right middle, random touch color, default shadow
        showBrushShadow = true;
        brushShadowToggle.checked = showBrushShadow;

        randomColorStyle = "Touch";
        randomColorStyleSelector.value = randomColorStyle;

        symmetryCenterPosition = "Right Middle";
        symmetryCenterSelector.value = symmetryCenterPosition;

        shadowSize = 5;
        shadowSizeSlider.value = shadowSize;
        shadowSizeValue.textContent = "" + shadowSize;

        symmetrySliderValue = 45;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;
        break;

    case "pattern_4":
        // symmetry: 100, brushSize: 1, random touch color,
        randomColorStyle = "Touch";
        randomColorStyleSelector.value = randomColorStyle;

        symmetrySliderValue = 100;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;

        colorType = "Alpha";
        colorTypeSelector.value = colorType;

        brushSize = 1;
        brushSizeSlider.value = brushSize;
        brushSizeValue.textContent = "" + brushSize;
        break;

    case "pattern_5":
        brushStyle = "Triangle";
        brushStyleSelector.value = brushStyle;

        symmetrySliderValue = 8;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;
        break;

    case "pattern_6":
        // default shadow, random touch color
        showBrushShadow = true;
        brushShadowToggle.checked = showBrushShadow;

        randomColorStyle = "Touch";
        randomColorStyleSelector.value = randomColorStyle;

        symmetrySliderValue = 10;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;
        break;

    case "pattern_7":
        // random shadow, random counter color
        showBrushShadow = true;
        brushShadowToggle.checked = showBrushShadow;

        randomColorStyle = "Counter";
        randomColorStyleSelector.value = randomColorStyle;

        symmetrySliderValue = 10;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;

        randomShadowColor = true;
        randomShadowColorToggle.checked = randomShadowColor;

        shadowSize = 20;
        shadowSizeSlider.value = shadowSize;
        shadowSizeValue.textContent = "" + shadowSize;
        break;

    case "pattern_8":
        // white color, default shadow
        randomColor = false;
        randomColorToggle.checked = randomColor;

        showBrushShadow = true;
        brushShadowToggle.checked = showBrushShadow;

        brushColor = "#ffffff";
        brushColorContainer.style.backgroundColor = brushColor;

        symmetrySliderValue = 10;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;

        shadowSize = 5;
        shadowSizeSlider.value = shadowSize;
        shadowSizeValue.textContent = "" + shadowSize;
        break;

    case "pattern_9":
        // black color, white shadow
        randomColor = false;
        randomColorToggle.checked = randomColor;

        showBrushShadow = true;
        brushShadowToggle.checked = showBrushShadow;

        shadowColor = "#ffffff";
        brushColor = "#000000";
        shadowColorContainer.style.backgroundColor = shadowColor;
        brushColorContainer.style.backgroundColor = brushColor;

        symmetrySliderValue = 10;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;

        shadowSize = 5;
        shadowSizeSlider.value = shadowSize;
        shadowSizeValue.textContent = "" + shadowSize;
        break;

    case "pattern_10":
        // random touch color, center at touch
        centerAtTouch = true;
        centerAtTouchToggle.checked = centerAtTouch;

        randomColorStyle = "Touch";
        randomColorStyleSelector.value = "Touch";

        symmetrySliderValue = 10;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;
        break;

    case "pattern_11":
        randomColor = false;
        randomColorToggle.checked = randomColor;

        brushColor = "#ffffff";
        brushColorContainer.style.backgroundColor = brushColor;

        brushSize = 1;
        brushSizeSlider.value = brushSize;
        brushSizeValue.textContent = "" + brushSize;
        break;

    case "pattern_12":
        // white color, random touch shadow color;
        randomColor = false;
        randomColorToggle.checked = randomColor;

        showBrushShadow = true;
        brushShadowToggle.checked = showBrushShadow;

        brushColor = "#ffffff";

        randomShadowColor = true;
        randomShadowColorToggle.checked = randomShadowColor;

        brushColorContainer.style.backgroundColor = brushColor;

        randomColorStyle = "Touch";
        randomColorStyleSelector.value = randomColorStyle;

        symmetrySliderValue = 10;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;

        shadowSize = 30;
        shadowSizeSlider.value = shadowSize;
        shadowSizeValue.textContent = "" + shadowSize;
        break;

    case "pattern_13":
        // white color, random counter shadow color;
        randomColor = false;
        randomColorToggle.checked = randomColor;

        showBrushShadow = true;
        brushShadowToggle.checked = showBrushShadow;

        brushColor = "#ffffff";

        randomShadowColor = true;
        randomShadowColorToggle.checked = randomShadowColor;

        brushColorContainer.style.backgroundColor = brushColor;

        randomColorStyle = "Counter";
        randomColorStyleSelector.value = randomColorStyle;

        symmetrySliderValue = 10;
        symmetrySlider.value = symmetrySliderValue;
        symmetryValue.textContent = "" + symmetrySliderValue;

        shadowSize = 30;
        shadowSizeSlider.value = shadowSize;
        shadowSizeValue.textContent = "" + shadowSize;
        break;

    case "pattern_14":
        // triangle, brush size max;
        brushStyle = "Triangle";
        brushStyleSelector.value = brushStyle;

        brushSize = 70;
        brushSizeSlider.value = brushSize;
        brushSizeValue.textContent = "" + brushSize;
        break;
    }
}

function saveCanvasImage() {
    let d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var imageName = date + "_" + month + "_" + year + "_" + hours + "_" + minutes + "_" + seconds + ".png";
    saveCanvasAsImage("Mandala_" + imageName);
    //let link = document.createElement('a');
    //link.href = canvas.toDataURL();
    //link.download = imageName;
}

function clearCanvas() {
    background(backgroundColor);
}

function canvasTouched() {
    canvasClicked = true;
    scrollingViewport = false;
    applyingZoom = false;
    if (randomColor && randomColorStyle == "Touch" || randomShadowColor && randomColorStyle == "Touch") {
        counter = random(360);
    }
}

function showHidePatternContainer() {
    if (fullScreenContainer.style.display == "block") {
        fullScreenContainer.style.display = "none";
    }

    if (patternContainer.style.display == "none") {
        patternContainer.style.display = "block";
    } else {
        patternContainer.style.display = "none";
    }
}

function useBrushFun() {
    useBrush = !useBrush;
    if (useBrush) {
        showToastMessage(brushString + ": " + onString);
    } else {
        showToastMessage(brushString + ": " + offString);
    }
}

function eraserFun(e) {
    useEraser = !useEraser;
    if (!useEraser) {
        fill(255);
        //console.log(e.target.parentNode);
        e.target.parentNode.style.borderBottom = "none";
        //showToastMessage("Eraser off");
    } else {
        //showToastMessage("Eraser on");
        e.target.parentNode.style.borderBottom = "3px solid #22ab78";
    }
}

function zoomLockFun() {
    zoomLock = !zoomLock;
    if (zoomLock) {
        canvas.style("touch-action", "inherit");
        showToastMessage(zoomString + ": " + onString);
    } else {
        canvas.style("touch-action", "pinch-zoom");
        showToastMessage(zoomString + ": " + offString);
    }

}


// function imageSymmetrySliderValueChanged(value) {
//     imageSymmetry = value;
//     imageSymmetryValue.textContent = value;
// }

// function imageSizeSliderValueChanged(value) {
//     imageSize = value;
//     imageSizeValue.textContent = value;
// }

// function eraserSizeSliderValueChanged(value) {
//     eraserSize = value;
//     eraserSizeValue.textContent = value;
// }

function showHideSettings() {
    if (patternContainer.style.display == "block") {
        patternContainer.style.display = "none";
    }

    if (fullScreenContainer.style.display == "none") {
        fullScreenContainer.style.display = "block";
    } else {
        fullScreenContainer.style.display = "none";
    }
}

function hideUiLayout() {
    patternContainer.style.display = "none";
    fullScreenContainer.style.display = "none";
}

function canvasUntouched() {
  
    canvasClicked = false;
    if (!zoomLock && !applyingZoom && !scrollingViewport) {
        if (pastCanvasIndexs.length == numberOfOffscreenBuffer) {
                pastCanvasIndexs.shift()
        }
        temporaryCanvas[presentCanvasIndex].image(canvas, 0, 0);
        pastCanvasIndexs.push(presentCanvasIndex);
        presentCanvasIndex++;
        if (presentCanvasIndex == numberOfOffscreenBuffer) {
            presentCanvasIndex = 0;
        }
        if (doingUndo || doingRedo) {
            futureCanvasIndexs = [];
            doingUndo = false;
            doingRedo = false;
        }
    }

}

function undoCanvas() {
    if (pastCanvasIndexs.length > 1) {
        doingUndo = true;
        futureCanvasIndexs.unshift(pastCanvasIndexs.pop());
        presentCanvasIndex = pastCanvasIndexs[pastCanvasIndexs.length - 1];
        image(temporaryCanvas[presentCanvasIndex], 0, 0);
        presentCanvasIndex++;
        if (presentCanvasIndex == numberOfOffscreenBuffer) {
            presentCanvasIndex = 0;
        }
    }
}

function redoCanvas() {
    if (futureCanvasIndexs.length >= 1) {
        pastCanvasIndexs.push(presentCanvasIndex);
        image(temporaryCanvas[futureCanvasIndexs.shift()], 0, 0);
        presentCanvasIndex++;
        if (presentCanvasIndex == numberOfOffscreenBuffer) {
            presentCanvasIndex = 0;
        }
    }
}

function changeImage(imageName) {
    useBrush = false;
    useEraser = false;
    img.crossOrigin = "anonymous";
    img.src = "images/" + imageName + ".png";
}

function showToastMessage(message) {
  
  snackbar.textContent = message;
    snackbar.className = "show";
    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 1200);
}

function getRandomColor() {
    return random(255);
}

function touchStarted() {
    originY = mouseY;
    originX = mouseX;
}

function resetAllSettings(){
    symmetrySliderValue = 12;
    imageSize = 24;
    useBrush = true;
    brushSize = 4;
    shadowSize = 10;
    eraserSize = 14;
    zoomLock = false;
    useEraser = false;
    //backgroundColor = "#000000";
    brushColor = "#ff0000";
    
    shadowColor = "#000000";
    showBrushShadow = false;
    randomColor = true;
    randomShadowColor = false;
    mirrorToggle = true;
    centerAtTouch = false;
    eraserSymmetry = true;
    brushStyle = "Line";
    colorType = "Hue";
    randomColorStyle = "Counter"
    symmetryCenterPosition = "Center";
  mirrorToggleSwitch.checked = true;
  centerAtTouchToggle.checked = false;
  randomColorToggle.checked = true;
  brushShadowToggle.checked = false;
  randomShadowColorToggle.checked = false;
  eraserSymmetryToggle.checked = true;
    //backgroundColorContainer.style.backgroundColor = backgroundColor;
    symmetrySlider.value = symmetrySliderValue;
    symmetryValue.textContent = symmetrySliderValue;
  symmetryCenterSelector.value = symmetryCenterPosition;
  randomColorStyleSelector.value = randomColorStyle;
    brushSizeSlider.value = brushSize;
    brushSizeValue.textContent = brushSize;
    brushStyleSelector.value = brushStyle;
    brushColorContainer.style.backgroundColor = brushColor;
    colorTypeSelector.value = colorType;
  imageSizeSlider.value = imageSize;
  imageSizeValue.textContent = imageSize;
  shadowSizeSlider.value = shadowSize;
  shadowSizeValue.textContent = shadowSize;
  shadowColorContainer.style.backgroundColor = shadowColor;
  eraserSizeSlider.value = eraserSize;
  eraserSizeValue.textContent = eraserSize;
}

//window.visualViewport.addEventListener("resize", viewportHandler);
//window.visualViewport.addEventListener("scroll", viewportScrollHandler);
function saveCanvasAsImage(name) {
    saveCanvas(canvas, name, 'png');

}
function viewportHandler(event) {
    applyingZoom = true;
    var viewportScaleValue = event.target.scale;

    /* scale element to normal size based on page zoom*/
    if (viewportScaleValue > 1) {
        var scale = 1 / viewportScaleValue;
        var value = 'scale(' + scale + ')';
        fullScreenContainer.style.transform = "" + value;
        snackbar.style.transform = "" + value;
        patternContainer.style.transform = "" + value;
    } else if (viewportScaleValue == 1) {
        fullScreenContainer.style.transform = "scale(1)";
        snackbar.style.transform = "scale(1)";
        patternContainer.style.transform = "scale(1)";
    }
    handleUiPositioning(event, viewportScaleValue);
}

function viewportScrollHandler(event) {
    scrollingViewport = true;
    var viewportScaleValue = event.target.scale;
    handleUiPositioning(event, viewportScaleValue);
}

function handleUiPositioning(event, viewportScaleValue) {
    /*position scaled element according to normal viewport*/

    var pageTop = event.target.pageTop;
    var pageLeft = event.target.pageLeft;

    var viewportWidth = event.target.width;
    var viewportHeight = event.target.height;

    var scaledMarginTop = ((viewportHeight * viewportScaleValue) - viewportHeight) / 2;
    var scaledMarginLeft = ((viewportWidth * viewportScaleValue) - viewportWidth) / 2;

    var marginTop = pageTop - scaledMarginTop;
    var marginLeft = pageLeft - scaledMarginLeft;

    fullScreenContainer.style.marginTop = "" + (marginTop) + "px";
    fullScreenContainer.style.marginLeft = "" + (marginLeft) + "px";

    patternContainer.style.marginTop = "" + (marginTop) + "px";
    patternContainer.style.marginLeft = "" + (marginLeft) + "px";

    snackbar.style.marginTop = "" + (marginTop) + "px";
    snackbar.style.marginLeft = "" + (-120 + marginLeft) + "px";
}
