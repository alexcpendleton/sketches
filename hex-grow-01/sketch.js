let mid = {};

let maxGrowyShapes = 6;
let growyShapeFrequency = 120;
let growyShapeSize = 24;
let growyShapeLifespan = 120 * 6;
let growyShapes = [];
function setup() {
  //960,720;
  createCanvas(700, 700, WEBGL);
  mid = {
    x: 0,
    y: 0
  };
  setupSeed();
  sourcePoints = polygonPoints(growyShapeSize * 5, 6);
}
let colori = 0;
function nextGrowyShape(size) {
  const c = pickNextColor(colori);
  colori++;
  const result = new GrowyCube({
    stroke: {
      weight: 2,
      color: c
    },
    size: size,
    growth: 1,
    age: 0,
    rotation: {
      x: {
        speed: 0.5,
        angle: random(0, 360)
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
let sourcePoints = [];
let stopAdding = false;
function draw() {
  const bg = color("#000");
  background(bg);
  translate(mid.x, mid.y);
  if (growyShapes.length < maxGrowyShapes && frameCount % growyShapeFrequency == 0) {
    if (stopAdding) 
      return;
    const next = nextGrowyShape(growyShapeSize);
    growyShapes.push(next);
    if (growyShapes.length == maxGrowyShapes) {
      stopAdding = true;
    }
    console.log("add growyShape", growyShapes[growyShapes.length - 1]);
  }
  //translate(mid.x / 4, mid.y / 4); let growyShapeResetSize = width * 1.25;
  for (let i = 0; i < sourcePoints.length; i++) {
    let pts = sourcePoints[i];
    drawGrowyShapesAt(pts.x, pts.y);
  }
  drawGrowyShapesAt(0, 0, true);;
}

function drawGrowyShapesAt(x, y, grow = false) {
  push();
  translate(x, y);
  for (let i = growyShapes.length - 1; i >= 0; i--) {
    const currentShape = growyShapes[i];
    currentShape.draw();
    if (grow) {
      currentShape.grow();

      if (currentShape.age >= growyShapeLifespan) {
        //growyShapes.splice(i, 1);
        console.log("reset", currentShape, i);
        currentShape.reset();
      }
    }
  }
  pop();
}
let isCurrentlyPaused = false;
function mouseReleased() {
  if (isCurrentlyPaused) {
    isCurrentlyPaused = false;
    return loop();
  }
  isCurrentlyPaused = true;
  noLoop();
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
    results.push({x: sx, y: sy});
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
  let options = ["#0ea3bd", "#eac435", "#e40066", "#03cea4", "#fb4d3d"];
  let i = index;
  if (i >= options.length) {
    i = i % options.length;
  }
  return options[i];
}
