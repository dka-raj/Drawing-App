function resize() {
  let paperGeo = paper.getBoundingClientRect();
  canvas.width = paperGeo.width - 4.5;
  drawingArea.style.width = `${canvas.width}px`;
  canvas.height = paperGeo.height - 4.5;
  drawingArea.style.height = `${canvas.height}px`;
}
function applySettings() {
  settings.values.color && (ctx.strokeStyle = settings.values.color);
  settings.values.size && (ctx.lineWidth = settings.values.size);
  let brush = settings.values.brushType;
  (brush === "round" && (ctx.lineCap = ctx.lineJoin = "round")) ||
    (brush === "square" &&
      (ctx.lineCap = "square") &&
      (ctx.lineJoin = "miter")) ||
    ((ctx.lineCap = "butt") && (ctx.lineJoin = "bevel"));
}
function setPointer() {
  let pointer = settings?.pointers?.[settings.values.mode];
  pointer &&
    document.body.style.setProperty(
      "--cursor",
      `url(../assets/images/cursors/${pointer}), cell`
    );
}
function undo() {
  if (history.index <= 0) {
    history.index === 0 &&
      confirm("Do you want to clear the canvas?") &&
      clearCanvas();
    return;
  }
  let image = new Image();
  image.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    history.index--;
    history.index <= 0 && (undoBtn.classList.remove("active"))
    redoBtn.classList.add("active")
  };
  image.src = history.data[history.index - 1];
}
function redo() {
  if (history.index >= history.data.length - 1) return;
  let image = new Image();
  image.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    history.index++;
    history.index >= history.data.length - 1 &&
      (redoBtn.classList.remove("active"))
    undoBtn.classList.add("active")
  };
  image.src = history.data[history.index + 1];
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(i=0;i<=1;i++){
    doBtn[i].classList.remove("active")
  }
  history.data = [];
  history.index = -1;
}
function downloadImg() {
  let link = document.createElement("a");
  let date = new Date();
  link.href = canvas.toDataURL();
  link.download = `painting on ${date
    .toISOString()
    .slice(
      0,
      10
    )} at ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.png`;
  link.click();
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
  document.body.style.cursor="var(--cursor)"
  applySettings();
  let pos = getPos(e);
  e.button === 2 &&
  settings.values.color2 &&
  (ctx.strokeStyle = settings.values.color2);
  draw(null, pos);
}
function paint(x, y) {
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}
function draw(e, pos) {
  if (!user.isDrawing) return;
  e && (pos = getPos(e));
  settings.values.mode === "pencil" && paint(pos.x, pos.y);
}
function stop() {
  if (!user.isDrawing) return;
  user.isDrawing = false;
  document.body.style.cursor="default"
  ctx.beginPath();
  // save history
  history.data.length != 0 && (undoBtn.classList.add("active"))
  redoBtn.classList.remove("active")
  history.data.length - 1 > history.index &&
    (history.data = history.data.slice(0, history.index + 1));
  history.data.push(canvas.toDataURL());
  history.index++;
}
function setPos(e) {
  if (
    e.srcElement.tagName.toLowerCase() === "canvas" &&
    e.srcElement.id === "drawingArea"
  )
    return;
  user.entPos = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop,
  };
}
function out(e) {
  draw(e);
  ctx.beginPath();
  addEventListener("mousemove", setPos);
}
function enter(e) {
  removeEventListener("mousemove", setPos);
  draw(null, user.entPos);
}
function key() {
  if (!e.ctrlKey) return;
  e.key === "z" && undo();
  e.key === "y" && redo();
}
