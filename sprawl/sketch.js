let mid = {};
let palette = [];
let bg;
let clusters = [];
function setup() {
  createCanvas(600, 600);
  bg = qpColor("bg", "122f3d");
  document.body.style.backgroundColor = "#122f3d";
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  setupSeed();

  let maxDraws = Math.floor(mid.x) * 50;
  let distanceFactor = 100;
  clusters.push(
    new Cluster({
      position: { x: distanceFactor, y: distanceFactor },
      maxDraws,
      fillColor: ca("#be3e2b", 64) // bluish
    })
  );
  clusters.push(
    new Cluster({
      position: { x: 0, y: distanceFactor * 0.75 * -1 }, // bottom
      maxDraws,
      fillColor: ca("#ed8a45", 64) // bluish
    })
  );
  clusters.push(
    new Cluster({
      position: { x: -distanceFactor, y: distanceFactor },
      maxDraws,
      fillColor: ca("#f6de6c", 42) // dark blue
    })
  );
  clusters.forEach(i => i.setup());
}

let rotation = 0;
let direction = 1;
function draw() {
  translate(mid.x, mid.y);
  rotate(rotation * direction);
  //ellipse(0, 0, 20, 20);
  clusters.forEach(s => {
    s.draw();
  });
  if (rotation > 10000) {
    rotation = 0;
    direction *= -1;
  }
  rotation += 100;
}

class Cluster {
  constructor(options) {
    Object.assign(
      this,
      {
        numberOfSprawlers: 100,
        position: { x: 0, y: 0 },
        fillColor: color("#000"),
        radius: 1.5,
        numberOfPoints: 10,
        sprawlers: [],
        maxDraws: 100,
        amountOfDraws: 0
      },
      options
    );
  }
  setup() {
    let { numberOfSprawlers, radius, numberOfPoints, fillColor } = {
      ...this
    };
    for (let i = 0; i < numberOfSprawlers; i++) {
      let degrees = (360 / numberOfSprawlers) * i;
      this.sprawlers.push(
        new Sprawler({
          degrees,
          radius,
          numberOfPoints,
          fillColor
        })
      );
    }
  }
  draw() {
    if (this.amountOfDraws >= this.maxDraws) {
      return;
    }
    push();
    translate(this.position.x, this.position.y);
    this.sprawlers.forEach(s => {
      s.draw();
      s.update();
    });
    this.amountOfDraws++;
    this.drawCenter();
    pop();
  }
  drawCenter() {
    return;
    fill(this.fillColor);
    ellipse(0, 0, 10, 10);
  }
}
class Sprawler {
  constructor(options) {
    Object.assign(
      this,
      {
        position: { x: 0, y: 0 },
        fillColor: color("#000"),
        radius: 10,
        degrees: 0,
        numberOfPoints: 50,
        lastChange: 1
      },
      options
    );
  }
  draw() {
    push();
    rotate(radians(this.degrees));
    noStroke();
    fill(this.fillColor);
    //rect(this.position.x, this.position.y, this.radius, this.radius);
    let points = polygonPoints(this.radius, this.numberOfPoints, {
      x: this.position.x,
      y: this.position.y
    });
    points = points.map(p => {
      return { x: fuzz(p.x, 1), y: fuzz(p.y, 1) };
      //return { x: fuzz(p.x, 1), y: fuzz(p.y, 1) };
    });
    drawPolygon(points);
    pop();
  }
  update() {
    let xChange = random(0, 1) > 0.5 ? -1 : 1;
    //let xChange = this.lastChange == 1 ? -1 : 1;
    //this.lastChange = xChange;
    this.position.x = this.position.x + xChange;
    this.position.y = this.position.y + 1;
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

function drawPolygon(points) {
  beginShape();
  points.forEach(p => {
    vertex(p.x, p.y);
  });
  endShape(CLOSE);
}
