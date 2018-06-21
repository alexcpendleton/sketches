let mid = {};

let bgColor = ()=> qpColor("bg", "000");
let size = qp("size", 600);
let buffer = qp("buffer", 30);
let palette = ["#a999f1", "#94c978", "#ffffff", "#cc8874", "#8fdfcb"];
let amount = qp("amount", 800);
let sd = qp("sd", 50);
let rm = qp("rm", "random");
let hatchLow = qp("hatchLow", 30);
let hatchHigh = qp("hatchHigh", 100);
let sqRadius = qp("sqr", 100);
//let palette = ["#d5dae6", "#262c2b", "#b44e26", "#8d0d05", "#4654b6"];
function setup() {
  //960,720;
  createCanvas(size, size);
  background(bgColor());
  mid = {
    x: size / 2,
    y: size / 2
  };
  noLoop();
  setupSeed();
}

function draw() {
  //translate(buffer, buffer);
  for(let i = 0; i < amount; i++) {
    push();
    const b = (size - buffer) - sqRadius;
    if(rm==="randomGaussian") {
      translate(randomGaussian(225, sd), randomGaussian(225, sd));
    } else {
      translate(random(buffer, b), random(buffer, b));
    }
    const hs = new HatchSquare();
    //rotate(radians(random(-15, 45)));
    hs.hatch.number = Math.floor(random(hatchLow, hatchHigh));
    hs.hatch.prep = () => {
      strokeWeight(random(0.25, 0.75));
      stroke(ca(randomColorFromPallete(), random(20, 60)));
      noFill();
    };
    hs.draw();
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

class HatchSquare {
  constructor(args={}) {
    Object.assign(this, {
      square: {
        radius: sqRadius,
        x:0, y:0,
        prep: () => {
          strokeWeight(0);
          stroke("#fff");
          noFill();
        },
      },
      hatch:{
        angle: 45,
        number: 40,
        prep: () => {
          strokeWeight(1);
          stroke("red");
          noFill();
        }
      }
    }, args);
  }
  draw() {
    const sq = this.square;
    const hatch = this.hatch;
    // for(let i = 0; i < (hatch.number / 4); i++) {
    //   const space = 10;
    //   const tx = i * space;
    //   const ty = 0;
    //   const bx = sq.radius;
    //   const by = sq.radius - tx;
    //   hatch.prep();
    //   line(tx, ty, bx, by);
    //   line(-tx, ty, -bx, by)
    // }
    const space = sq.radius / hatch.number;
    hatch.prep();
    for (let i = 0; i < hatch.number; i++) {
      const ly = i * space;
      const lx = 0;
      line(lx, ly, lx+sq.radius, ly);
    }

    sq.prep();
    rect(sq.x, sq.y, sq.radius, sq.radius);
  }
}

function randomFromArray(arr) {
  const i = Math.floor(random(0, arr.length));
  return arr[i];
}
function randomColorFromPallete() {
  let x = randomFromArray(palette);
  return color(x);
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
function qpColor(name, def) {
  return qp(name, def, (v)=> {
    if(v) {
      return "#"+v;
    }
    return v;
  })
}