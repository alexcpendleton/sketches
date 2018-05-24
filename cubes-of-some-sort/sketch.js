let mid = {};

let cubies = [];
function setup() {
  //960,720;
  createCanvas(700, 700, WEBGL);
  mid = {
    x: 350,
    y: 350
  };
  //noLoop();
  setupSeed();

  /*
  cubies.push(makeCubie(20));
  cubies.push(makeCubie(40));
  cubies.push(makeCubie(60));
  cubies.push(makeCubie(80));
  cubies.push(makeCubie(100));
  */
}
let cubieFrequency = 100;
let colori = 0;
function nextCubie(size) {
  const c = pickNextColor(colori);
  colori++;
  const result = new GrowyCube({
    stroke: {
      weight: 10,
      color: c
    },
    size: size,
    growth: 5,
    rotation: {
      x: {
        speed: 0.5,
        angle: random(0, 360)
      },
      y: {
        speed: 0.5,
        angle: random(0, 360)
      }
    }
  });
  return result;
}
function draw() {
  const bg = color("#000");
  background(bg);
  let maxCubies = 12;
  if (cubies.length < maxCubies && frameCount % cubieFrequency == 0) {
    cubies.push(nextCubie(20));
    console.log("add cubie", cubies.length);
  }
  //translate(mid.x / 4, mid.y / 4);

  cubies.forEach(i => {
    i.draw();
    i.grow();
  });
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

class GrowyCube {
  constructor(opts) {
    Object.assign(this, opts);
  }
  draw() {
    push();
    noFill();
    rotateX(radians(this.rotation.x.angle));
    rotateY(radians(this.rotation.y.angle));
    strokeWeight(this.stroke.weight);
    stroke(this.stroke.color);
    box(this.size);
    pop();
  }
  grow() {
    this.size += this.growth;
    if (this.size > width * 2) {
      this.reset();
    }
    this.rotation.x.angle += this.rotation.x.speed;
    this.rotation.y.angle += this.rotation.y.speed;
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
  return options[i];
}
