resize()
setPointer()
// events
addEventListener("resize", resize);
canvas.addEventListener("pointerdown", start);
canvas.addEventListener("pointermove", draw);
addEventListener("pointerup", stop);
canvas.addEventListener("mouseout", out);
canvas.addEventListener("mouseenter", enter);
// button events
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);
clearBtn.addEventListener("click", clearCanvas);
downloadImgBtn.addEventListener("click", downloadImg);
// keyboard events
addEventListener("keypress", key);
// blocking context menu in canvas
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

