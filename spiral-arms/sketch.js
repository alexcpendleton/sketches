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
var angle = 3.0;
var offset = 0;
var shapeSize = 1;
var whatever = 1;
var speed = 50;
var limit = 54; //000;
var shapesDrawn = 0;
var alphaChange = 1;
var shapeChange = 3;
var mc = 1.05;
var whateverspeed = 10;

function draw() {
  translate(300, 300);
  if (shapesDrawn == 0) {
    drawShapeAt(0, shapeSize * 0.5);
  }
  const col = randomColorFromPallete();
  const m = shapesDrawn * 0.05;
  drawShapeAt({ mod: 1.1, useColor: col, fa: m });
  drawShapeAt({ mod: -1.1, useColor: col, fa: -1 * m });

  angle += speed;
  //scalar += speed;
  whatever += whateverspeed;
  shapeSize += shapeChange;
}

function drawShapeAt({
  mod = 1,
  size = shapeSize,
  useColor = null,
  am = 1,
  aa = 0,
  fa = 0
}) {
  if (shapesDrawn > limit) return;
  console.log(shapesDrawn, x, y);

  var x = offset + cos(angle * am + aa) * whatever * mod + fa;
  var y = offset + sin(angle * am + aa) * whatever * mod + fa;

  fill(useColor || randomColorFromPallete());
  noStroke();
  ellipse(x, y, size, size);

  shapesDrawn++;
  fill(0);
  //text(shapesDrawn, x, y);
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
  let x = randomFromArray(shapePalette).levels;
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
    speed = parseFloat(vars.get("speed"));
  }
  if (vars.get("angle")) {
    angle = parseFloat(vars.get("angle"));
  }
}
