let mid = {};
let palette = [];
let bg;
let baseDarkColor;
let actualCanvasSize = {
  width: 500,
  height: 500
};
function setup() {
  //960,720;
  createCanvas(actualCanvasSize.width, actualCanvasSize.height);
  bg = qpColor("bg", "#E6D9B9");
  baseDarkColor = color("#3E352E");
  background(bg);
  //document.body.background.color = "#E6D9B9";
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
}

function draw() {
  noStroke();
  var amount = 10;
  var density = {
    x: actualCanvasSize.width / 10,
    y: actualCanvasSize.height / 10
  };
  const grid = gridPoints(
    actualCanvasSize.width,
    actualCanvasSize.height,
    density
  );
  console.log(grid);
  grid.forEach(gridPoint => {
    drawBlob(gridPoint);
  });
  grid.forEach(gridPoint => {
    drawGridPoint(gridPoint);
  });
}

let numberOfPointsRange = { min: 4, max: 4 };
let blobWidthRange = { min: 10, max: 12 };
let blobHeightRange = { min: 10, max: 12 };
function randomRange(range) {
  if (range.min === range.max) return range.min;
  return random(range.min, range.max);
}
function drawBlob(gridPoint) {
  //console.log("drawBlob", gridPoint);
  let { x, y } = gridPoint;
  const factor = 0;
  x = fuzz(x, factor);
  y = fuzz(y, factor);
  let numberOfPoints = randomRange(numberOfPointsRange);
  let w = randomRange(blobWidthRange);
  let h = randomRange(blobHeightRange);
  var points = makeFuzzyRectanglePoints(w, h, x, y, numberOfPoints);
  //stroke(color("red"));
  let alpha = chooseAlpha(y, actualCanvasSize.height) * 2;
  //fill(ca(baseDarkColor, alpha));
  fill(randomColor());
  beginShape();
  var i = 0;
  points.forEach(p => {
    //curveVertex(p.x, p.y);
    ellipse(p.x, p.y, 1, 1);
  });
  endShape(CLOSE);
  // points.forEach(p => {
  //   fill("red");
  //   text(i, p.x, p.y);
  //   i++;
  // });
}

function makeFuzzyRectanglePoints(w, h, x, y, numberOfPoints) {
  if (numberOfPoints < 4) {
    numberOfPoints = 4;
  }
  let top = [];
  let right = [];
  let bottom = [];
  let left = [];
  // for now divide the points evenly among the sides
  // but it'd probably be better to consider the size of the side
  let pointsPerSide = Math.ceil(numberOfPoints / 4);
  let padding = {
    w: Math.ceil(w / pointsPerSide),
    h: Math.ceil(h / pointsPerSide)
  };
  let factor = { w: 10, h: 10 };
  factor = { w: 0, h: 0 };
  for (let i = 0; i < pointsPerSide; i++) {
    top.push({
      x: x + fuzz(i * padding.w, factor.h),
      y: fuzz(y, factor.h)
    });
    right.push({
      x: x + fuzz(padding.w, factor.h),
      y: y + fuzz(i * padding.h, factor.w)
    });
    bottom.push({
      x: w + fuzz(i * padding.w, factor.h),
      y: fuzz(y, factor.h) + h
    });
    left.push({
      x: x + fuzz(padding.w, factor.h),
      y: y + fuzz(i * padding.h, factor.w)
    });
  }
  bottom.reverse();
  left.reverse();
  var results = [...top, ...right, ...bottom, ...left];
  debugger;
  console.table(results);
  return results;
}

function drawGridPoint(gridPoint) {
  fill("#fff");
  rect(gridPoint.x, gridPoint.y, 5, 5);
}

function gridPoints(w, h, padding = { x: 0, y: 0 }, padFirst = false) {
  const points = [];
  const start = padFirst ? padding : { x: 0, y: 0 };
  for (var y = start.y; y < h; y += padding.y) {
    for (var x = start.x; x < w; x += padding.x) {
      points.push({ x, y });
    }
  }
  return points;
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

function chooseAlpha(y, height) {
  // Darkest near the top, lighter at the bottom
  let m = map(y, 0, height, 0, 128);
  if (y < height / 3) {
    //m = 255;
  }
  if (Math.ceil(random(0, 100)) === 69) {
    m = 0;
  }
  return m;
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
      if (v.indexOf("#") > -1) {
        return v;
      }
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
function fuzz(i, fuzzFactor) {
  let r = random(i - fuzzFactor, i + fuzzFactor);
  return r;
}

function randomColor() {
  return color(random(255), random(255), random(255), random(255));
}
