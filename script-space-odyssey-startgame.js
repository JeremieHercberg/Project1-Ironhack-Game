var canvas = document.getElementById("second-canvas");
var context = canvas.getContext("2d");
var width = canvas.getAttribute("width");
var height = canvas.getAttribute("height");
var bgImage = new Image();
bgImage.src = "./images/background-image-index.png";

context.font = "110px Impact";
context.fillStyle = "#0099CC";
context.textAlign = "center";
context.fillText("Space Odyssey Game", canvas.width / 2, canvas.height / 2);

context.font = "40px Impact";
context.fillText(
  "Embark on a adventure",
  canvas.width / 2,
  canvas.height / 2 + 125
);

document.getElementById("button-play");
