let mid = {};
let shapePalette = [];
let shapeAlpha = 127;
function setup() {
  shapePalette = [
    color("#9a02a2"),
    color("#7f7eff"),
    color("#efe9f4"),
    color("#b8b8f3"),
    color("#d68fd6")
  ];
  shapePallete = [
    color("#9a02a2"),
    color("#d68fd6"),
    color("#d68fd6"),
    color("#d68fd6"),
    color("#d68fd6")
  ];
  createCanvas(700, 700);
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
var angle = 10;
var offset = 0;
var shapeSize = 1;
var whatever = 1;
var speed = 50;
var limit = 54; //000;alpha=127&alphaChange=25&angle=10
var shapesDrawn = 0;
var alphaChange = 25;
var shapeChange = 3;
var mc = 1.05;
var whateverspeed = 10;
var rotation = 0;
var rotationChange = 10;
function draw() {
  //console.log("draw");
  translate(width / 2, height / 2);

  const r = PI + rotation;
  rotation += rotationChange;
  push();
  rotate(r);
  pop();
  for (let shapeCount = 0; shapeCount < limit; shapeCount++) {
    //console.log(shapeCount);
    if (shapesDrawn == 0) {
      drawShapeAt({ mod: 1, useColor: color("#fff"), size: shapeSize });
    }

    //console.log(shapeCount, frameCount, shapeCount % frameCount);
    let col = color("#d68fd6"); //randomColorFromPallete();
    if (shapeCount == limit - 1) {
      col = color("#fff");
      console.log(shapeCount);
    }
    const m = shapesDrawn * 0.05;
    drawShapeAt({ mod: 1.1, useColor: col, fa: m });
    drawShapeAt({ mod: -1.1, useColor: col, fa: -1 * m });

    angle += speed;
    //scalar += speed;
    whatever += whateverspeed;
    shapeSize += shapeChange;
  }
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
  if (vars.get("rotationChange")) {
    rotationChange = parseFloat(vars.get("rotationChange"));
  }
}
