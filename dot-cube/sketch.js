let mid = {};

function setup() {
  //960,720;
  createCanvas(600, 600, WEBGL);
  const bg = color("#000");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
  translate(mid.x, mid.y);
  fill(color("white"));
  ellipse(0, 0, 100);
}
const dotRadius = 3;
const container = {
  w: 100,
  h: 100
};
function draw() {
  noStroke();
  const guideSize = 10;

  const drawSquare = i => {
    fill(getColorForIndex(i));
    //rect(0, 0, container.w, container.h);
    drawSide();
  };
  rotateX(degrees(180));
  rotateY(degrees(180));
  push();
  drawSquare(0);
  pop();

  push();
  rotateX(degrees(90));
  drawSquare(1);
  translate();
  pop();

  return;

  const drawGuidePoint = (degrees, i) => {
    fill(getColorForIndex(i));
    const x = container.w * cos(radians(degrees));
    const y = container.h * sin(radians(degrees));
    fill(getColorForIndex(i));
    ellipse(x, y, guideSize);
  };
  translate(mid.x, mid.y);
  drawGuidePoint(0, 0);
  drawGuidePoint(90, 1);
  drawGuidePoint(45, 2);
  drawGuidePoint(-45, 3);

  return;
  //rectMode(CENTER);

  push();
  fill(getColorForIndex());
  drawSide();
  pop();

  push();
  //shearY(radians(45));
  //shearX(radians(45));
  fill(getColorForIndex(1));
  drawSide();
  pop();
  return;
  push();
  shearX(PI);
  shearY(PI);
  fill(getColorForIndex(2));
  drawSide();
  pop();
}
function drawSide() {
  const sampler = poissonDiscSampler(container.w, container.h, dotRadius);
  while ((sample = sampler())) {
    ellipse(sample[0], sample[1], dotRadius);
  }
}
function drawPoints() {}
function getColorForIndex(i) {
  let options = [
    color("red"),
    color("orange"),
    color("yellow"),
    color("green"),
    color("blue"),
    color("purple")
  ];
  return options[i];
}
function drawSquare({ x, y, size }) {}
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

("use strict");
// https://github.com/beaugunderson/poisson-disc-sampler
function poissonDiscSampler(width, height, radius, rng) {
  var k = 30; // maximum number of samples before rejection
  var radius2 = radius * radius;
  var R = 3 * radius2;
  var cellSize = radius * Math.SQRT1_2;

  var gridWidth = Math.ceil(width / cellSize);
  var gridHeight = Math.ceil(height / cellSize);

  var grid = new Array(gridWidth * gridHeight);

  var queue = [];
  var queueSize = 0;

  var sampleSize = 0;

  rng = rng || random;

  function far(x, y) {
    var i = (x / cellSize) | 0;
    var j = (y / cellSize) | 0;

    var i0 = Math.max(i - 2, 0);
    var j0 = Math.max(j - 2, 0);
    var i1 = Math.min(i + 3, gridWidth);
    var j1 = Math.min(j + 3, gridHeight);

    for (j = j0; j < j1; ++j) {
      var o = j * gridWidth;

      for (i = i0; i < i1; ++i) {
        var s;

        if ((s = grid[o + i])) {
          var dx = s[0] - x,
            dy = s[1] - y;

          if (dx * dx + dy * dy < radius2) {
            return false;
          }
        }
      }
    }

    return true;
  }

  function sample(x, y) {
    var s = [x, y];

    queue.push(s);

    grid[gridWidth * ((y / cellSize) | 0) + ((x / cellSize) | 0)] = s;

    sampleSize++;
    queueSize++;

    return s;
  }

  return function() {
    if (!sampleSize) {
      return sample(rng() * width, rng() * height);
    }

    // Pick a random existing sample and remove it from the queue.
    while (queueSize) {
      var i = (rng() * queueSize) | 0;
      var s = queue[i];

      // Make a new candidate between [radius, 2 * radius] from the existing
      // sample.
      for (var j = 0; j < k; ++j) {
        var a = 2 * Math.PI * rng();
        var r = Math.sqrt(rng() * R + radius2);
        var x = s[0] + r * Math.cos(a);
        var y = s[1] + r * Math.sin(a);

        // Reject candidates that are outside the allowed extent,
        // or closer than 2 * radius to any existing sample.
        if (x >= 0 && x < width && y >= 0 && y < height && far(x, y)) {
          return sample(x, y);
        }
      }

      queue[i] = queue[--queueSize];
      queue.length = queueSize;
    }
  };
}
