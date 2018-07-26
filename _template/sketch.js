let mid = {};
let size = qp("size", 600);
let bg = () => qpColor("bg", "000");
let lineColor = qpColor("lineColor", "fff");

let frequency = qp("frequency", 60);
let amplitude = qp("amplitude", 80);
let lineLength = qp("lineLength", 400);
let xOffset = 0;
let step = qp("step", 10);

function setup() {
  createCanvas(size, size);
  mid = {
    x: size / 2,
    y: size / 2
  };
  //noLoop();
  setupSeed();
}

function draw() {
  background(bg());
  translate(mid.x, mid.y);
  let numberOfPoints = Math.floor(size / step);
  for(var i = 0; i < numberOfPoints; i++) {
    let x = i;
    let s = (x+xOffset)/frequency;
    let y = 0;
    ellipse(x, y, 10, 10);
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

function qpColor(name, def) {
  return qp(name, def, (v) => {
    if (v) {
      return "#" + v;
    }
    return v;
  })
}