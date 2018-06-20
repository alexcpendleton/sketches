let mid = {};
var easycam;
let bgColor;
let beamColor;
function setup() {
  //960,720;
  createCanvas(screen.width, screen.height, WEBGL);
  bgColor = color("#000");
  beamColor=color("#fff");
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();
  easycam = createEasyCam();

  // Imagine a dark underwater scene
  // With a beam of light coming down from the top
  // and there's just like silt and shiny stuff floating through it peacefully
}

function draw() {
  //specularMaterial(128, 0, 0);
  background(bgColor);
  translate(0, 0, 0);
  //translate(mid.x, mid.y);
  drawBeam();
  scale(0.75);
  stroke(color("red"))
  //fill(color("red"))
  sphere();
}

function drawBeam() {
	var dirY = (mouseY / height - 0.5) * 4;
	var dirX = (mouseX / width - 0.5) * 4;
	directionalLight(204, 204, 204, dirX, dirY, 1);
}

let silt = [];
function drawSilt() {
  if (silt.length === 0) {
    //silt = 
  }
}

class SiltParticle {
  constructor() {
    this.position = createVector(0, 0, 0);

  }
  draw() {

  }
  update() {

  }
}

function setupSeed() {
  const fromLocation = new URL(document.location).searchParams.get("seed");
  if (fromLocation) {
    window.seed = parseFloat(fromLocation);
  } else {
    window.seed = ceil(random(0, 1000000));
  }
  console.log(window.seed);
  randomSeed(window.seed);
}

function randomFromArray(arr) {
  const i = Math.floor(random(0, arr.length));
  return arr[i];
}

function qp(name, def, customParser) {
  let value = new URL(document.location).searchParams.get(name);
  if (value === null || value === undefined || value === "") {
    value = def;
  }
  if (customParser) {
    value = customParser(value);
  } else {
    if (!isNaN(value)) {
      value = parseFloat(value);
    }
  }
  console.log("qp", name, value, def);
  return value;
}

function mouseReleased() {
  return;
  if (mouseReleased.isCurrentlyPaused) {
    console.log("resumed");
    mouseReleased.isCurrentlyPaused = false;
    return loop();
  }
  mouseReleased.isCurrentlyPaused = true;
  noLoop();
  console.log("paused");
}
