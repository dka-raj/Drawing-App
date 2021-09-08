const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d"),
  toolBar = document.getElementById("toolBar"),
  statusBar = document.getElementById("statusBar"),
  paper = document.getElementById("paper"),
  doBtn=document.querySelectorAll(".doBtn"),
  undoBtn = document.querySelector(".undoBtn"),
  redoBtn = document.querySelector(".redoBtn"),
  clearBtn = document.querySelector(".clearCanvas.btn"),
  downloadImgBtn = document.querySelector(".downloadImg.btn"),
  contextDiv=document.getElementById("contextMenu"),
  user = {
    isDrawing: false,
    entPos:{}
  },
  history = {
    data: [],
    index: -1,
  };
