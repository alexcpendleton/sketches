let mid = {};
let size = qp("size", 600);
let sideLength = qp("sideLength", 200);
let speed = qp("speed", .5);
let bg = () => {
  if(this.c) {
    return this.c;
  }
  this.c = qpColor("bg", "000");
  return this.c;
}
let lineColor = qpColor("lineColor", "fff");
let tri = undefined;

function setup() {
  createCanvas(size, size);
  mid = {
    x: size / 2,
    y: size / 2
  };
  //noLoop();
  setupSeed();
  tri = new TriSwirl();
}

function draw() {
  background(bg());
  translate(mid.x - (sideLength/2), mid.y - (sideLength/2));
  tri.draw();
  tri.update();
}

class TriSwirl {
  constructor({
    length = sideLength,
  } = {}) {
    const lh = length / 2;
    this.length = length;
    this.speed = speed;
    this.a = createVector(0, 0);
    this.ab = createVector(0, lh);
    this.b = createVector(0, length);
    this.bc = createVector(lh, lh);
    this.c = createVector(length, 0);
    this.ca = createVector(lh, 0);
    this.middle = createVector(length/3, length/3);
  }

  draw() {
    strokeWeight(1);
    stroke(this.nextLineColor());
    this.vecLine(this.a, this.ab);
    stroke(this.nextLineColor());
    this.drawText("ab", this.ab);
    this.vecLine(this.ab, this.b);
    stroke(this.nextLineColor());
    this.vecLine(this.b, this.bc);
    stroke(this.nextLineColor());
    this.drawText("bc", this.bc);
    this.vecLine(this.bc, this.c);
    stroke(this.nextLineColor());
    this.vecLine(this.c, this.ca);
    stroke(this.nextLineColor());
    this.drawText("ca", this.ca);
    this.vecLine(this.ca, this.a);
    console.table(this);

    stroke(this.nextLineColor());
    this.drawText("middle", this.middle);
    this.vecLine(this.middle, this.middle);
  }
  update() {
    if(this.ab.x < this.middle.x) {
      this.ab.x += this.step;
      this.ab.y -= this.step;
    }
    if(this.bc.x > this.middle.x && this.bc.y > this.middle.y) {
      this.bc.x -= this.step;
      this.bc.y -= this.step;
    }
    if (this.ca.y < this.middle.y) {
      this.ca.x -= this.step;
      this.ca.y += this.step;
    }
  }

  vecLine(from, to) {
    line(from.x, from.y, to.x, to.y);
    noFill();
    //ellipse(from.x, from.y, 20);
    ellipse(to.x, to.y, 20);
  }

  nextLineColor() {
    return color("#fff");
    return color(random(0, 255), random(0, 255), random(0, 255));
  }
  drawText(t, v) {
    text(t, v.x, v.y);
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

function qpColor(name, def) {
  return qp(name, def, (v) => {
    if (v) {
      return "#" + v;
    }
    return v;
  })
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
