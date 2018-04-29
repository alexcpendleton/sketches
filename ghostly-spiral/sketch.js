let mid = {};
let shapePalette = [];
let shapeAlpha = 1;
function setup() {
  shapePalette = [
    color("#9a02a2"),
    color("#7f7eff"),
    color("#efe9f4"),
    color("#b8b8f3"),
    color("#d68fd6")
  ];
  createCanvas(600, 600);
  const bg = color("#000");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();
  setupQueryVars();
}
var angle = 2.0;
var offset = 300;
var scalar = 3.5;
var speed = 1;
var sizeIncrease = 1.5;
var limit = 10000;
var shapesDrawn = 0;
var alphaChange = 1;
function draw() {
  drawShapeAt();
  drawShapeAt(-1);
  angle += speed;
  scalar += speed;
}

function drawShapeAt(mod = 1) {
  if (shapesDrawn > limit) return;
  var x = offset + cos(angle) * scalar * mod;
  var y = offset + sin(angle) * scalar * mod;
  fill(randomColorFromPallete());
  noStroke();
  ellipse(x, y, scalar, scalar);
  shapesDrawn++;
  if (shapeAlpha == 0) {
    shapeAlpha = alphaChange;
  } else {
    shapeAlpha += alphaChange;
  }
}

function randomFromArray(arr) {
  const i = Math.floor(random(0, arr.length));
  return arr[i];
}
function randomColorFromPallete() {
  let x = randomFromArray(shapePalette);
  x = x.levels;
  if (shapesDrawn < 5) {
    console.log(x);
    //console.log(r);
  }
  let r = color(x[0], x[1], x[2], shapeAlpha);
  return r;
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
function setupQueryVars() {
  const vars = new URL(document.location).searchParams;
  if (vars.get("alpha")) {
    shapeAlpha = parseInt(vars.get("alpha", 10));
  }
  if (vars.get("alphaChange")) {
    alphaChange = parseFloat(vars.get("alphaChange"));
  }
  if (vars.get("speed")) {
    //speed = parseFloat(vars.get("speed"));
  }
}
