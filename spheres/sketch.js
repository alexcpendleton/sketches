let mid = {};

let maxshapes = 20;
let shapeSize = 50;
let shapeLifespan = 400;
let shapes = [];
let numberOfShapes = 10;
let shapeOffset = 300;
function setup() {
  //960,720;
  createCanvas(700, 700, WEBGL);
  mid = {
    x: 350,
    y: 350
  };
  //noLoop();
  setupSeed();
  // create ten spheres
  //smooth(2);
  for (let i = 0; i < numberOfShapes; i++) {
    // rotate each one n*10 degrees offset so it's like they're spinning
    let angleModifier = i % 2 == 0 ? 1 : -1;
    let made = nextshape(shapeSize + shapeOffset * i);
    made.rotation.z.speed = 0.1;
    made.rotation.z.angle = i * shapeOffset * angleModifier;
    made.rotation.x.speed = 0.1;
    made.rotation.x.angle = i * shapeOffset * angleModifier;
    made.rotation.y.speed = 0.1;
    made.rotation.y.angle = i * shapeOffset * angleModifier;
    made.growth = 0.25;
    //made.size =
    //made.rotation.y.speed = 0.001;
    //made.rotation.y.angle = i * shapeOffset;
    made.stroke.weight = 0.5;
    made.stroke.color.setAlpha(58);
    made.detailX = 16;
    made.detailY = 16;
    shapes.push(made);
  }
  console.table(shapes);
}
let colori = 0;
function nextshape(size) {
  const c = pickNextColor(colori);
  colori++;
  const result = new GrowyShape({
    stroke: {
      weight: 2,
      color: c
    },
    size: size,
    growth: 5,
    age: 0,
    rotation: {
      x: {
        speed: 0,
        angle: 0
      },
      y: {
        speed: 0,
        angle: 0
      },
      z: {
        speed: 0,
        angle: 0
      }
    }
  });
  return result;
}
function draw() {
  const bg = color("#000");
  background(bg);

  //translate(mid.x / 4, mid.y / 4);
  //let shapeResetSize = width * 1.25;
  shapes.forEach(i => {
    i.draw();
    i.grow();
    if (i.age >= shapeLifespan) {
      //i.reset();
    }
  });
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

class GrowyShape {
  constructor(opts) {
    Object.assign(this, opts);
  }
  draw() {
    push();
    noFill();
    rotateX(radians(this.rotation.x.angle));
    rotateY(radians(this.rotation.y.angle));
    rotateZ(radians(this.rotation.z.angle));
    strokeWeight(this.stroke.weight);
    stroke(this.stroke.color);
    //box(this.size);
    sphere(this.size, this.detailX, this.detailY);
    //torus(this.size);
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
  }
}

function pickNextColor(index) {
  let options = ["#0ea3bd", "#eac435", "#e40066", "#03cea4", "#fb4d3d"];
  let i = index;
  if (i >= options.length) {
    i = i % options.length;
  }
  return color(options[i]);
}
