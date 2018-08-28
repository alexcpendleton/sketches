let mid = {};
let palette = [];
let bg;
let clusterWidth;
let clusterHeight;
let bounds;
let amountHorizontal = 14;
let amountVertical = 14;
let shrinkFactor = 0.85;
let horizontalSpacing;
let horizontalSpacingFactor = 0.8;
let verticalSpacing;

let amountDrawn = 0;
let infiniteLoopLimit = 10000;
let lineWeight = qp("lineWeight", 1);
let lineColor;
function setup() {
  lineColor = ca("#000", 128);
  //960,720;
  bounds = {
    width: qp("width", 640),
    height: qp("height", 640)
  };
  //createCanvas(bounds.width, bounds.height);
  createCanvas(1000, 1000);
  translate(bounds.width, bounds.height);
  bg = qpColor("bg", "fff");
  clusterWidth = Math.floor(
    (bounds.width * horizontalSpacingFactor) / (amountHorizontal + 6)
  );
  clusterHeight = clusterWidth;
  horizontalSpacing = clusterWidth * horizontalSpacingFactor;
  verticalSpacing = horizontalSpacing;
  console.log("horizontalSpacing", horizontalSpacing);
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
}

function draw() {
  noFill();
  strokeWeight(lineWeight);
  stroke(lineColor);
  rectMode(CENTER);
  //let amountOfDraws = 20000;
  for (let drawIndex = 0; drawIndex < amountOfDraws; drawIndex++) {
    for (
      let verticalIndex = 0;
      verticalIndex < amountVertical;
      verticalIndex++
    ) {
      for (
        let horizontalIndex = 0;
        horizontalIndex < amountHorizontal;
        horizontalIndex++
      ) {
        let currentClusterPosition = {
          x: horizontalIndex * clusterWidth,
          y: verticalIndex * clusterHeight
        };
        currentClusterPosition.x += (horizontalIndex + 1) * horizontalSpacing;
        currentClusterPosition.y += (verticalIndex + 1) * verticalSpacing;
        drawCluster(currentClusterPosition);
      }
    }
  }
}

function drawCluster(position) {
  let minimumWidth = clusterWidth * 0.1;
  let currentWidth = clusterWidth;
  let currentWeight = lineWeight;

  let middleOfCluster = { x: 0, y: 0 };
  middleOfCluster.x = position.x + clusterWidth / 2;
  middleOfCluster.y = position.y + clusterHeight / 2;

  push();
  translate(middleOfCluster.x, middleOfCluster.y);
  while (currentWidth > minimumWidth) {
    if (infiniteLoopLimit > 0 && amountDrawn > infiniteLoopLimit) {
      break;
    }
    drawSingle(currentWidth, currentWeight);
    currentWeight = currentWeight * shrinkFactor;
    currentWidth = currentWidth * shrinkFactor;
    if (currentWeight < 0.4) {
      currentWeight = 0.4;
    }
  }
  pop();
}

function drawSingle(radius, weight) {
  strokeWeight(weight);
  //rect(0, 0, radius, radius);
  push();
  rotate(radians(45));
  beginShape();
  const points = polygonPoints(radius, 4);
  points.forEach(p => {
    const factor = radius * 0.1;
    const x = fuzz(p.x, factor, { ao: PI });
    const y = fuzz(p.y, factor, { ao: PI });
    vertex(x, y);
  });
  endShape(CLOSE);
  pop();
  amountDrawn++;
}

function fuzz(i, fuzzFactor) {
  let r = random(i - fuzzFactor, i + fuzzFactor);
  return r;
}

function polygonPoints(radius, numberOfPoints, { x = 0, y = 0, ao = 0 } = {}) {
  var angle = TWO_PI / numberOfPoints;
  const results = [];
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a + ao) * radius;
    var sy = y + sin(a + ao) * radius;
    results.push({ x: sx, y: sy });
  }
  return results;
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
function qpColor(name, def) {
  return qp(name, def, v => {
    if (v) {
      return "#" + v;
    }
    return v;
  });
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

function ca(c, a) {
  const result = color(c);
  if (a !== undefined) {
    result.setAlpha(a);
  }
  return result;
}

function randomColorFromPallete() {
  let x = randomFromArray(palette);
  x = x.levels;
  let r = color(x[0], x[1], x[2]);
  return r;
}

function randomFromArray(arr) {
  const i = Math.floor(random(0, arr.length));
  return arr[i];
}
