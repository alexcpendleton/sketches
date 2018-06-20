let mid = {};
//?frequency=60&startingRadius=48&lifespan=1040&growthRate=1
// /http://localhost:3000/hex-grow-01/index.html?frequency=60&startingRadius=48&lifespan=440&growthRate=1
let maxShapes = qp("maxShapes", 5);
let frequency = qp("frequency", 60);
let startingRadius = qp("startingRadius", 48);
let lifespan = qp("lifespan", 1040);
let growthRate = qp("growthRate", 1);
let growyShapes = [];
let sourcePoints = [];
let stopAdding = false;
let capturer = {};
let record = qp("record", 0);
let format = qp("format", "webm");
let rotationSpeed = qp("rotationSpeed", 1);
let rotationAngle = qp("rotationAngle", 45);
let palette = []; // needs to be done in setup
let bg = null;

function setup() {
  //960,720;
  let w = 350,
    h = 350;
  createCanvas(w, h); //, WEBGL);
  mid = {
    x: w / 2,
    y: h / 2
  };
  setupSeed();

  sourcePoints = polygonPoints(startingRadius * 5, 6);
  strokeCap(ROUND)

  palette = qp("palette", null, (p) => {
    if (!p) return [];
    console.log("split p soup", p.split(","));
    return p.split(",").map(i => color("#" + i));
  });
  bg = qp("bg", color("#000"), (i) => color("#" + i));

  capturer = makeCapturer();
  capturer.start();
}

function makeCapturer() {
  if (record > 0) {
    return new CCapture({
      format: format,
      workersPath: "/"
    });
  }
  return {
    start: () => {},
    save: () => {},
    capture: () => {},
    stop: () => {}
  };
}
let colori = 0;

function nextGrowyShape(radius) {
  const c = pickNextColor(colori);
  colori++;
  const result = new GrowyCube({
    stroke: {
      weight: 6,
      color: c
    },
    size: radius,
    growth: growthRate,
    age: 0,
    rotation: {
      x: {
        speed: rotationSpeed,
        angle: rotationAngle,
      },
      y: {
        speed: 0.5,
        angle: random(0, 360)
      },
      z: {
        speed: 10,
        angle: random(0, 360)
      }
    }
  });
  return result;
}

function draw() {
  background(bg);
  translate(mid.x, mid.y);
  if (frameCount < 5) {
    console.log(frameCount, frameCount % frequency);;
  }
  const isNewShapeFrame = frameCount % frequency == 0;
  if (growyShapes.length < maxShapes && isNewShapeFrame) {
    if (stopAdding)
      return;
    const next = nextGrowyShape(startingRadius);
    growyShapes.push(next);
    if (growyShapes.length == maxShapes) {
      stopAdding = true;
    }
  }
  for (let i = 0; i < sourcePoints.length; i++) {
    let pts = sourcePoints[i];
    drawGrowyShapesAt(pts.x, pts.y, false, isNewShapeFrame);
  }
  drawGrowyShapesAt(0, 0, true, isNewShapeFrame);
  capturer.capture(canvas);
}

let hasLooped = false;

function drawGrowyShapesAt(x, y, grow = false, isNewShapeFrame = false) {
  push();
  translate(x, y);
  for (let i = growyShapes.length - 1; i >= 0; i--) {
    const currentShape = growyShapes[i];
    currentShape.draw();
    if (grow) {
      currentShape.grow();

      if (isNewShapeFrame && currentShape.age >= lifespan) {
        //growyShapes.splice(i, 1);
        console.log("reset", currentShape, i);
        if (!hasLooped) {
          capturer.stop();
          capturer.save();
          hasLooped = true;
        }

        currentShape.reset();
      }
    }
  }
  pop();
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

function setupSeed() {
  const fromLocation = new URL(document.location)
    .searchParams
    .get("seed");
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

function polygonPoints(radius, numberOfPoints, {
  x = 0,
  y = 0,
  ao = 0
} = {}) {
  var angle = TWO_PI / numberOfPoints;
  const results = [];
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a + ao) * radius;
    var sy = y + sin(a + ao) * radius;
    results.push({
      x: sx,
      y: sy
    });
  }
  return results;
}

function drawHex(radius, pos = {
  x: 0,
  y: 0
}) {
  push();
  translate(pos.x, pos.y);
  const points = polygonPoints(radius, 6);
  beginShape();
  points.forEach(i => vertex(i.x, i.y));
  endShape();
  pop();
}

class GrowyCube {
  constructor(opts) {
    Object.assign(this, opts);
  }
  draw() {
    push();
    noFill();
    //X(radians(this.rotation.x.angle)); rotateY(radians(this.rotation.y.angle));
    rotate(radians(this.rotation.x.angle));
    strokeWeight(this.stroke.weight);
    stroke(this.stroke.color);
    drawHex(this.size);
    //box(this.size); sphere(this.size, 10, 10);
    pop();
  }
  grow() {
    this.size += this.growth;
    this.rotation.x.angle += this.rotation.x.speed;
    this.rotation.y.angle += this.rotation.y.speed;
    this.rotation.z.angle += this.rotation.z.speed;
    this.age += 1;
  }
  reset() {
    this.size = 0;
    this.age = 0;
  }
}

function pickNextColor(index) {
  let options = palette || ["#0ea3bd", "#eac435", "#e40066", "#03cea4", "#fb4d3d"];
  let i = index;
  if (i >= options.length) {
    i = i % options.length;
  }
  return options[i];
}

function qp(name, def, customParser) {
  let value = new URL(document.location).searchParams.get(name);
  if (name == "palette") {
    console.log("qp", name, value, def);
  }
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
