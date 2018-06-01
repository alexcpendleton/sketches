let mid = {};
let dish;
let lines = [];
let lines2 = [];
let lines3 = [];
let lines4 = [];
let numberOfPoints = 800;
let nwCutoff = 0;
//https://lh3.googleusercontent.com/-ubAq4W0Zsqk/Wveb4ggSHII/AAAAAAAAVX4/rTcox6LuXVIHxywqhlXhSaoEAyIWJ6-mQCL0BGAYYCw/h467/2018-05-12.png
function setup() {
  //960,720;
  createCanvas(700, 700);
  const bg = ca("#fff");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();

  dish = new Dish({
    radius: 300,
    numberOfPoints
  });
  nwCutoff = dish.radius / 2;
  let linePoints = dish.points.filter(i => i.x < 0 && i.y < nwCutoff);
  lines = linePoints.map(i => {
    const xabs = Math.abs(i.x);
    return new ColonyLine({
      startingPosition: createVector(i.x, i.y),
      length: random(xabs * 0.85, xabs * 1.5),
      fillColor: ca("#2AF3F2", randomInt(40, 220))
    });
  });

  let linePoints2 = dish.points.filter(i => i.x > 0 && i.y > nwCutoff * -1.05);
  lines2.push(
    ...linePoints2.map(i => {
      const xabs = Math.abs(i.x);
      return new ColonyLine({
        growthDirection: "-x",
        startingPosition: createVector(i.x, i.y),
        length: random(xabs * 0.75, xabs * 1.5),
        fillColor: ca("#9d3bc6", randomInt(20, 120))
      });
    })
  );
  lines3.push(
    ...linePoints2.map(i => {
      const xabs = Math.abs(i.x);
      return new ColonyLine({
        growthDirection: "-x",
        startingPosition: createVector(i.x, i.y),
        length: random(xabs * 0.75, xabs * 1.5),
        fillColor: ca("#2A0D37", randomInt(50, 100))
      });
    })
  );

  lines4.push(
    ...linePoints2.map(i => {
      const xabs = Math.abs(i.x);
      return new ColonyLine({
        growthDirection: "-x",
        startingPosition: createVector(i.x, i.y),
        length: random(xabs * 0.75, xabs * 1.5),
        fillColor: ca("#D71457", randomInt(10, 80))
      });
    })
  );
}
function draw() {
  translate(mid.x, mid.y);

  push();
  rotate(radians(45));
  lines.forEach(i => i.draw());
  pop();

  push();
  translate(10, 0);
  rotate(radians(25));
  lines2.forEach(i => {
    if (i.startingPosition.y > 25) {
      i.draw();
    }
  });
  pop();

  push();
  rotate(radians(180));
  //lines3.forEach(i => i.draw());
  pop();

  push();
  translate(50, 25);
  rotate(radians(-240));
  lines4.forEach(i => i.draw());
  pop();
  // draw a circle to be the petri dish
  if (!dish.drawn) {
    dish.fillColor = ca("#fff", 0);
    dish.draw();
  }
  // find the points along the top left corner of the circle
  // for each of those points, draw a line of colonies in green
  // each colony should be of a similar, but random-like size
  // each line should decrease in density about 60% of the way
  //    through the circle, with the colonies getting slightly
  //    larger and further apart before tapering off
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

let calog = false;
function ca(c, a) {
  const result = color(c);
  if (a !== undefined) {
    result.setAlpha(a);
  }
  if (!calog) {
    console.log(result);
    calog = true;
  }

  return result;
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
class Colony {
  constructor({ position } = {}) {
    this.position = position || createVector(0, 0);
    this.strokeWeight = 0;
    this.strokeColor = color("#000");
    this.fillColor = ca(color("green"), 240);
    this.radius = 4;
  }
  draw() {
    strokeWeight(this.strokeWeight);
    stroke(this.strokeColor);
    fill(this.fillColor);
    ellipse(this.position.x, this.position.y, this.radius);
  }
}
function randomInt(a = 0, b = 1) {
  return Math.floor(random(a, b));
}
class ColonyLine {
  constructor({
    startingPosition,
    length,
    growthDirection,
    radiusFunc,
    bufferFunc,
    fillColor
  }) {
    this.startingPosition = startingPosition;
    this.length = length;
    this.growthDirection = growthDirection || "x";
    this.bufferFunc = bufferFunc || (() => randomInt(2, 8));
    this.radiusFunc = radiusFunc || (() => randomInt(2, 3));
    this.fillColor = fillColor;
  }
  makeColonies() {
    let colonyLength = 0;
    const results = [];
    while (colonyLength < this.length) {
      const made = new Colony();
      made.radius = this.radiusFunc();
      made.buffer = this.bufferFunc();
      if (this.fillColor) {
        made.fillColor = this.fillColor;
      } else {
        made.fillColor.setAlpha(random(128, 255));
      }
      const addSize = made.radius + made.buffer;
      made.position = this.startingPosition.copy();
      const growth = colonyLength + made.radius + Math.floor(made.buffer / 2);
      if (this.growthDirection == "x") {
        made.position.x += growth;
      } else if (this.growthDirection == "-y") {
        made.position.y -= growth;
      } else if (this.growthDirection == "-x") {
        made.position.x -= growth;
      }
      colonyLength += addSize;
      results.push(made);
    }
    return results;
  }
  draw() {
    if (!this.colonies) {
      this.colonies = this.makeColonies();
    }
    this.colonies.forEach(c => {
      c.draw();
    });
  }
}

class Dish {
  constructor({ radius, numberOfPoints }) {
    this.position = createVector(0, 0);
    this.radius = radius;
    this.numberOfPoints = numberOfPoints;
    this.strokeWeight = 10;
    this.strokeColor = color("#000");
    this.fillColor = color("#fff");
    this.points = this.calculatePoints(this.numberOfPoints);
    this.drawn = false;
  }
  calculatePoints(n) {
    return polygonPoints(this.radius, n, {
      ...this.position
    });
  }
  draw() {
    strokeWeight(this.strokeWeight);
    stroke(this.strokeColor);
    fill(this.fillColor);
    //this.drawPoints();
    //this.drawCircle();
    this.drawn = true;
  }
  drawPoints() {
    this.points.forEach(i => {
      ellipse(i.x, i.y, 5, 5);
    });
    ellipse(0, 0, 5);
  }
  drawCircle() {
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }
}
