let mid = {};
let palette = [];
let bg;
let blobls = [];
function setup() {
  //960,720;
  createCanvas(600, 600);
  bg = qpColor("bg", "#fff");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();
  blobls = [];

  let postion = {};

  // red, bottom
  position = { x: mid.x, y: mid.y * 1.15 };
  blobls.push(
    new Blobl(
      position,
      polygonPoints(mid.x * 0.25, 10000, { x: position.x, y: position.y }),
      ca("red", 1)
    )
  );
  position = { x: mid.x * 1.15, y: mid.y * 0.85 };
  blobls.push(
    new Blobl(
      position,
      polygonPoints(mid.x * 0.25, 10000, { x: position.x, y: position.y }),
      ca("#C9E557", 1)
    )
  );
  position = { x: mid.x * 0.85, y: mid.y * 0.85 };
  blobls.push(
    new Blobl(
      position,
      polygonPoints(mid.x * 0.25, 10000, { x: position.x, y: position.y }),
      ca("#57E2E5", 1)
    )
  );
}
let amountOfDraws = 0;
function draw() {
  blendMode(EXCLUSION);
  if (amountOfDraws == 34) {
    console.log(amountOfDraws);
    return;
  }
  //translate(mid.x, mid.y);
  blobls.forEach(b => {
    b.draw();
    b.update();
  });
  amountOfDraws++;
}

class Blobl {
  constructor(position, points, fillColor) {
    this.position = position || { x: 0, y: 0 };
    this.points = points;
    this.fuzzFactor = 0.5;
    this.amountOfDraws = 0;
    this.fillColor = fillColor || ca("red", 10);
    this.preDraw = () => {
      noStroke();
      fill(this.fillColor);
    };
    this.postDraw = () => {};
  }
  draw() {
    this.preDraw();
    beginShape();
    this.points.forEach(p => {
      vertex(p.x, p.y);
    });
    endShape(CLOSE);
    this.amountOfDraws++;
    this.postDraw();
  }
  update() {
    this.points = this.points.map(p => {
      const factor = this.fuzzFactor;
      const x = fuzz(p.x, factor);
      const y = fuzz(p.y, factor);
      return { x, y };
    });
  }
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

function fuzz(i, fuzzFactor) {
  let r = random(i - fuzzFactor, i + fuzzFactor);
  return r;
}
