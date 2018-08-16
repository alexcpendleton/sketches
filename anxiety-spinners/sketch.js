let mid = {};
let bg = {};
let shapePalette = [];
let numberOfSegments = qp("numberOfSegments", 16);
let numberOfSpinners = qp("numberOfSpinners", 10);
let anxiety = qp("anxiety", 0.08);

function setup() {
  //960,720;
  shapePalette = [
    color("#e9c46a"),
    color("#f4a261"),
    color("#2a9d8f"),
    color("#e76f51"),
    color("#264653")
  ];
  createCanvas(400, 400);
  bg = color("#000");
  document.body.style.backgroundColor = "#000";
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();
}

let rotationCount = 0;
function draw() {
  translate(mid.x, mid.y);
  background(bg);
  strokeWeight(4);

  for (let i = 0; i < numberOfSpinners; i++) {
    drawNextAnxietySpinner(i);
  }

  rotationCount += 6;
  if (rotationCount === 360) {
    rotationCount = 0;
  }
}

function drawNextAnxietySpinner(i) {
  push();
  const radius = (i + 1) * 24;
  const direction = i % 2 == 0 ? 1 : -1;
  const scaleMax = random(0, anxiety);
  scale(random(0, scaleMax) + 1);
  rotate(radians(rotationCount) * direction);
  drawGradientCircle({
    radius: radius,
    startColor: pickNextColor(i),
    endColor: bg
  });
  pop();
}
function drawGradientCircle({ radius, startColor, endColor }) {
  // make n segments of the circle
  // for each segment, lerp the color by 360/(n*i)
  //
  // draw an arc from the previous segment end point to this one's start point

  const factor = 360 / numberOfSegments;
  let lastColor = null;
  for (let i = 0; i < numberOfSegments; i++) {
    const startAngle = radians(factor * i);
    const endAngle = radians(factor * (i + 1));

    var inter = map(i, numberOfSegments, i - numberOfSegments, 0, 1);
    var c = lerpColor(lastColor || startColor, endColor, inter);
    stroke(c);
    noFill();
    arc(0, 0, radius, radius, startAngle, endAngle, OPEN);
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
  if (mouseReleased.isCurrentlyPaused) {
    console.log("resumed");
    mouseReleased.isCurrentlyPaused = false;
    return loop();
  }
  mouseReleased.isCurrentlyPaused = true;
  noLoop();
  console.log("paused");
}

function randomColorFromPallete() {
  let x = randomFromArray(shapePalette);
  x = x.levels;
  let r = color(x[0], x[1], x[2]);
  return r;
}

function pickNextColor(index) {
  let options = shapePalette;
  let i = index;
  if (i >= options.length) {
    i = i % options.length;
  }
  return options[i];
}
