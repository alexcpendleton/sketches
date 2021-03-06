// inspiration http://www.tylerlhobbs.com/static/img/st-a-800.jpg

const dotRadius = 1;
let densityStep = -10;
let dotFuzz = 0; // 1; //0.8;
let xFuzz = 7;
let yFuzz = 4;
const sq = 10;
function setup() {
  bgColor = color(255, 255, 255);

  createCanvas(400, 800);
  background(bgColor);
  noLoop();
  setupSeed();
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

function draw() {
  let rows = 5,
    x = 0,
    y = 0;
  for (let i = 0; i < rows; i++) {
    let step = rows * densityStep;
    y = sq;
    x = sq;
    let space = { x, y };
    y = height / (i + 1);
    x = width + 1;
    bounds = { x, y };
    let fillColor = chooseColorByRowIndex(i);
    fillColor.setAlpha(random(200, 250));
    doit({ space, bounds, fillColor });
  }
}
function chooseColorByRowIndex(rowIndex) {
  let c = color("#4A0087");
  c.setAlpha(128);
  return c;
  let colors = [
    color("#4A0087"),
    color("#41D3BD"),
    color("#DE6449"), //color("#6C00C4"),
    color("#41D3BD"), //color("#7B00E0"),
    color("#8C00FF")
  ];
  colors = [
    color("black"),
    color("green"),
    color("red"),
    color("yellow"),
    color("blue")
  ];
  c = colors[rowIndex];
  return color(c);
}
function chooseAlternateColorByRowIndex(rowIndex) {
  const colors = [
    color("#409997"),
    color("#409997"),
    color("#409997"),
    color("#409997"),
    color("#409997")
  ];
  return colors[rowIndex];
}
function doit({ space, bounds, fillColor }) {
  console.log(space, bounds);
  const sampler = poissonDiscSampler(bounds.x, bounds.y, dotRadius * 2, random);

  let counter = 0;
  while ((sample = sampler())) {
    //console.log('x, y:', sample[0], sample[1]);
    drawADot({ x: sample[0], y: sample[1], fillColor });
    counter++;
    if (counter > 20000) {
      console.log("AHHHH");
      return;
    }
  }
}

let drawn = 0;
function drawADot({ x, y, fillColor, numSides, rotation }) {
  noStroke();
  fill(fillColor);
  const radius = dotRadius; // fuzz(dotRadius, dotFuzz);
  numSides = numSides || Math.floor(random(5, 13));
  rotation = rotation || Math.floor(random(0, 360));
  push();
  translate(x, y);
  rotate(radians(rotation));
  polygon(0, 0, radius, numSides);
  pop();
}
function fuzz(i, fuzzFactor) {
  let r = randomGaussian(i - fuzzFactor, i + fuzzFactor);
  return r;
}
function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

/*
every n pixels right draw a dot until you get to the end of the canvas
move that line `n` pixels down
*/
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

  rng = rng || Math.random;

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
