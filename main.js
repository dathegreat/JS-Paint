//TODO: add undo / redo buttons

const colors = {
    black : "#000000",
    white : "#ffffff",
    darkBlue : "#264653",
    lightGrey : "#EEEEEE"
}

const canvasSize = 500
let brushSize = 5
let brushColor = colors.black


class Canvas {
    //a utility class to reference the current canvas' context
    constructor() {
      this.canvas = document.getElementById("canvas")
      this.canvas.height = canvasSize
      this.canvas.width = canvasSize
      this.ctx = this.canvas.getContext("2d")
      this.rect = this.canvas.getBoundingClientRect()
      this.path = new Path2D()
    }

    resize(){
        this.canvas.height = window.innerHeight * 0.75
        this.canvas.width = window.innerWidth * 0.75
    }

    redraw(){
        //save current canvas state
        const tempCanvas = document.createElement("canvas")
        tempCanvas.height = this.canvas.height
        tempCanvas.width = this.canvas.width
        tempCanvas.getContext("2d").drawImage(this.canvas, 0, 0)
        //resize canvas element
        this.resize()
        //draw saved state onto new canvas
        this.ctx.drawImage(tempCanvas, 0, 0)
    }

    changeShadows(){
        this.ctx.fillStyle = "#ffffff"
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height)
        this.ctx.stroke(this.path)
    }
  }

//global canvas object
const canvas = new Canvas()

//set up page layout and feel
function init(){
    //color document
    document.getElementById("body").style.backgroundColor = colors.lightGrey
    canvas.canvas.style.border = "1px solid white"
    canvas.canvas.style.backgroundColor = colors.white
    //resize canvas to fit window
    canvas.redraw()
    window.onresize = canvas.redraw()
    //add event listeners
    canvas.canvas.addEventListener("mousedown", downClick)
    canvas.canvas.addEventListener("touchstart", downClick)
    canvas.canvas.addEventListener("mouseup", upClick)
    canvas.canvas.addEventListener("touchend", upClick)
    //add slider input logic
    const sizeSlider = document.getElementById("sizeSlider")
    const sizeLabel = document.getElementById("sizeLabel")
    sizeSlider.oninput = () => { 
        brushSize = sizeSlider.valueAsNumber
        sizeLabel.innerHTML = `Brush Size: ${sizeSlider.valueAsNumber}` }
    //add color picker logic
    const brushColorPicker = document.getElementById("brushColorPicker")
    brushColorPicker.oninput = () => { brushColor = brushColorPicker.value }
    const backColorPicker = document.getElementById("backColorPicker")
    backColorPicker.oninput = () => { canvas.canvas.style.backgroundColor = backColorPicker.value }
    //add gyro listener
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // Handle iOS 13+ devices.
        DeviceMotionEvent.requestPermission()
          .then((state) => {
            if (state === 'granted') {
              window.addEventListener('devicemotion', handleOrientation);
            } else {
              console.error('Request to access the orientation was rejected');
            }
          })
          .catch(console.error);
      } else {
        // Handle regular non iOS 13+ devices.
        window.addEventListener("deviceorientation", processGyro, true);
    }
    
}

function processGyro(event){
    const z = event.alpha // (0,360)
    const x = event.beta // (-180,180)
    const y = event.gamma // (-90,90)
    const zRotation = z > 180 ? z - 360 : z;
    const xRotation = x;
    const yRotation = y > 180 ? 360 - y : -y;
    const shadowLength = 10
    let gyroData = document.getElementById("gyrodata")
    gyroData.innerHTML = `${z}, ${x}, ${y}<br>${zRotation}, ${xRotation}, ${yRotation}`
    canvas.ctx.shadowOffsetX = (yRotation / 90) * shadowLength
    canvas.ctx.shadowOffsetY = (xRotation / 90) * shadowLength
    canvas.changeShadows()
}

function changeBackground(){
    
}

function draw(event){
    canvas.ctx.strokeStyle = brushColor
    canvas.ctx.lineWidth = brushSize
    canvas.path.lineTo(event.offsetX, event.offsetY)
    canvas.ctx.stroke(canvas.path)
}

function downClick(e){
    canvas.path.moveTo(e.offsetX, e.offsetY)
    canvas.ctx.shadowOffsetX = 10;
    canvas.ctx.shadowOffsetY = 10;
    canvas.ctx.shadowBlur = 10;
    canvas.ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
    canvas.canvas.addEventListener("mousemove", draw)
    canvas.canvas.addEventListener("touchmove", draw)
}

function upClick(){
    canvas.canvas.removeEventListener("mousemove", draw)
    canvas.canvas.removeEventListener("touchmove", draw)
}
