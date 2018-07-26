let mid = {};
let size = qp("size", 600);
let palette = ["#6d9db0", "#dd6c84", "#daaa32", "#7776a7", "#df553c"];
const ringSize = qp("ringSize", 5);

function setup() {
  //960,720;
  createCanvas(size, size);
  const bg = color(0,0,0,0);
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
}

function draw() {
  const maxRingX = size;
  const numberOfRings = maxRingX / ringSize;
  translate(mid.x, mid.y);
  for(let i = 0; i < numberOfRings; i++) {
    const ringColor = randomFromArray(palette);
    stroke(ringColor);
    noFill();
    const ringW = i * ringSize;
    const ringH = ringW;
    strokeWeight(ringSize);
    ellipse(0, 0, ringW, ringH);
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

//https://coolors.co/6d9db0-dd6c84-daaa32-7776a7-df553c
//["#6d9db0", "#dd6c84", "#daaa32", "#7776a7", "#df553c"]
//https://imgur.com/gallery/mLsH1mr