let mid = {};
let bg;
let planet;
let rings = [];
let palette = [];
function setup() {
  //960,720;
  createCanvas(screen.width, screen.height, WEBGL);
  bg = color("#000");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  palette = [
    color("#f76c6c"),
    color("#e84855"),
    color("#a8d0e6"),
    color("#ededed"),
    color("#19213d")
  ];
  setupSeed();

  planet = new Planet();
  planet.radius = 100;
  planet.strokeWeight = 1;
  planet.strokeColor = ca("A390E4");
  planet.fillColor = ca("#A390E4");
  planet.rotationY = 0;
  planet.rotationSpeed = -0.00005;

  let lastY = 0;
  while (lastY < 1.5) {
    let sat = makeRandomSatellite(lastY);
    lastY = sat.rotationY;
    rings.push(sat);
  }
  lastY = 0;
  while (lastY < 1.5) {
    let sat = makeRandomSatellite(lastY);
    lastY = sat.rotationY;
    sat.y = sat.y - 20;
    sat.x = sat.x - 10;
    rings.push(sat);
  }
  lastY = 0;
  while (lastY < 1.5) {
    let sat = makeRandomSatellite(lastY);
    lastY = sat.rotationY;
    sat.y = sat.y - 20;
    sat.x = sat.x + 10;
    rings.push(sat);
  }
}

function makeRandomSatellite(rotationYSeed = 0) {
  const sat = new Satellite();
  sat.strokeWeight = 1;
  sat.strokeColor = ca(randomColorFromPallete(), 240);
  (sat.fillColor = sat.strokeColor), (sat.startDegrees = 0);
  sat.y = 0;
  sat.x = 120;
  sat.width = 4;
  sat.height = 4;
  sat.depth = 12;
  sat.rotationY = rotationYSeed + 0.015;
  sat.rotationSpeed = 0.00005;
  console.log(sat.rotationY);
  return sat;
}

function draw() {
  background(bg);
  rotateX(degrees(45));
  rotateY(degrees(25));
  rotateZ(degrees(45));
  //translate(mid.x, mid.y);
  drawPlanet();
  drawRings();
}

function drawPlanet() {
  planet.draw();
  planet.rotationY += planet.rotationSpeed;
  if (planet.rotationY == 360) {
    planet.rotationY = 0;
  }
}
function drawRings() {
  rings.forEach(satellite => {
    satellite.draw();
    satellite.rotationY += satellite.rotationSpeed;
    if (satellite.rotationY == 360) {
      satellite.rotationY = 0;
    }
  });
}

class Planet {
  draw() {
    push();
    rotateY(degrees(this.rotationY));
    fill(this.fillColor);
    strokeWeight(this.strokeWeight);
    stroke(this.strokeColor);
    sphere(this.radius);
    pop();
  }
}
class Ring {}
class Satellite {
  draw() {
    push();
    fill(this.fillColor);
    strokeWeight(this.strokeWeight);
    stroke(this.strokeColor);
    rotateY(degrees(this.rotationY));
    translate(this.x, this.y);
    box(this.width, this.height, this.depth, 0, 0);
    pop();
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
