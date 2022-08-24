//TODO: add undo / redo buttons

const canvasSize = 500
let brushSize = 5
let brushColor = "#ffffff"
const colors = {
    black : "#000000",
    white : "#ffffff",
    darkBlue : "#264653",
    lightGrey : "#EEEEEE"
}

class Canvas {
    //a utility class to reference the current canvas' context
    constructor() {
      this.canvas = document.getElementById("canvas")
      this.canvas.height = canvasSize
      this.canvas.width = canvasSize
      this.ctx = this.canvas.getContext("2d")
      this.rect = this.canvas.getBoundingClientRect()
    }
  }

//global canvas object
const canvas = new Canvas()

function resizeCanvas(){
    //save current canvas state
    const tempCanvas = document.createElement("canvas")
    tempCanvas.height = canvas.canvas.height
    tempCanvas.width = canvas.canvas.width
    tempCanvas.getContext("2d").drawImage(canvas.canvas, 0, 0)
    //resize canvas element
    canvas.canvas.height = window.innerHeight * 0.75
    canvas.canvas.width = window.innerWidth * 0.75
    //draw saved state onto new canvas
    canvas.ctx.drawImage(tempCanvas, 0, 0)
}


//set up page layout and feel
function init(){
    //color document
    document.getElementById("body").style.backgroundColor = colors.lightGrey
    canvas.canvas.style.border = "1px solid white"
    canvas.canvas.style.backgroundColor = colors.black
    //resize canvas to fit window
    resizeCanvas()
    window.onresize = resizeCanvas
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
}

function changeBackground(){

}

function draw(event){
    canvas.ctx.strokeStyle = brushColor
    canvas.ctx.lineWidth = brushSize
    canvas.ctx.lineTo(event.offsetX, event.offsetY)
    canvas.ctx.stroke()
}

function downClick(e){
    canvas.ctx.beginPath()
    canvas.canvas.addEventListener("mousemove", draw)
    canvas.canvas.addEventListener("touchmove", draw)
}

function upClick(){
    canvas.canvas.removeEventListener("mousemove", draw)
    canvas.canvas.removeEventListener("touchmove", draw)
}
