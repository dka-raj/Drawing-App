// values
const canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d"),
    toolBar = document.getElementById("toolBar"),
    statusBar = document.getElementById("statusBar"),
    paper = document.getElementById("paper"),
    undoBtn = document.getElementById("undoBtn"),
    redoBtn = document.getElementById("redoBtn"),
    clearBtn = document.querySelector(".clearCanvas.btn"),
    downloadImgBtn = document.querySelector(".downloadImg.btn"),
    user = {
        isDrawing: false,
    },
    settings = defSettings.values,
    history = {
        data: [],
        index: -1
    };

// functions
function resize() {
    let paperGeo = paper.getBoundingClientRect();
    canvas.width = paperGeo.width - 4.5;
    drawingArea.style.width = `${canvas.width}px`;
    canvas.height = paperGeo.height - 4.5;
    drawingArea.style.height = `${canvas.height}px`;
}
function applySettings() {
    settings.color && (ctx.strokeStyle = settings.color);
    settings.size && (ctx.lineWidth = settings.size);
    let brush = settings.brushType;
    if (brush === "round") {
        ctx.lineCap = ctx.lineJoin = "round";
    } else if (brush === "square") {
        ctx.lineCap = "square";
        ctx.lineJoin = "miter";
    } else {
        ctx.lineCap = "butt";
        ctx.lineJoin = "bevel";
    }
}
function undo() {
    if (history.index <= 0) return;
    let image = new Image();
    image.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        history.index--;
        (history.index <= 0) && (undoBtn.children[0].style.fill = "var(--inactive)")
        redoBtn.children[0].style.fill = "var(--fg)";
    };
    image.src = history.data[history.index - 1];
}
function redo() {
    if (history.index >= (history.data.length - 1)) return
    let image = new Image();
    image.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        history.index++;
        (history.index >= (history.data.length - 1)) && (redoBtn.children[0].style.fill = "var(--inactive)")
        undoBtn.children[0].style.fill = "var(--fg)";
    };
    image.src = history.data[history.index + 1];
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    undoBtn.children[0].style.fill = "var(--inactive)"
    redoBtn.children[0].style.fill = "var(--inactive)"
    history.data = []
    history.index = -1
}
function downloadImg() {
    let link=document.createElement("a")
    let date=new Date()
    link.href=canvas.toDataURL()
    link.download=`painting on ${date.toISOString().slice(0,10)} at ${date.toLocaleTimeString()}.png`
    link.click()
}
function getPos(e) {
    if (e.type === "touch") {
        return {
            x: e.clientX - canvas.offsetLeft,
            y: e.clientY - canvas.offsetTop,
        };
    }
    return {
        x: e.offsetX,
        y: e.offsetY,
    };
}
function start(e) {
    if (user.isDrawing) return;
    user.isDrawing = true;
    applySettings();
    let pos = getPos(e);
    e.button === 2 && settings.color2 && (ctx.strokeStyle = settings.color2);
    settings.mode === "pencil" && paint(pos.x, pos.y);
}
function paint(x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}
function draw(e) {
    if (!user.isDrawing) return;
    let pos = getPos(e);
    settings.mode === "pencil" && paint(pos.x, pos.y);
}
function stop() {
    if (!user.isDrawing) return;
    user.isDrawing = false;
    ctx.beginPath();
    // save history
    (history.data.length != 0) && (undoBtn.children[0].style.fill = "var(--fg)")
    redoBtn.children[0].style.fill = "var(--inactive)";
    ((history.data.length - 1) > history.index) && (history.data = history.data.slice(0, history.index + 1))
    history.data.push(canvas.toDataURL());
    history.index++;
    (!history.undo) && (history.undo = true);
}
// events
addEventListener("resize", resize);
canvas.addEventListener("pointerdown", start);
canvas.addEventListener("pointermove", draw);
addEventListener("pointerup", stop);
canvas.addEventListener("mouseout", (e) => {
    draw(e)
    ctx.beginPath()
});
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

clearBtn.addEventListener("click",clearCanvas)
downloadImgBtn.addEventListener("click", downloadImg)
// blocking context menu
addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// at starting
resize();
document.body.style.setProperty("--cursor", `url(../assets/images/cursors/${defSettings.pointers[settings.mode][0]}) 2 21, cell`)