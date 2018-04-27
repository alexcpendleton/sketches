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
  translate(200, 200);
  //noLoop();
  setupSeed();
  setupQueryVars();
}
var angle = 2.0;
var offset = 300;
var scalar = 3.5;
var speed = 1;
var sizeIncrease = 1.5;
var col = {
  r: 255,
  g: 0,
  b: 0
};
var limit = 10000;
var shapesDrawn = 0;
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
}

function randomFromArray(arr) {
  const i = Math.floor(random(0, arr.length));
  return arr[i];
}
function randomColorFromPallete() {
  let r = randomFromArray(shapePalette);
  r.setAlpha(shapeAlpha);
  if (shapesDrawn < 5) {
    console.log(r);
  }
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
}
