let mid = {};
let size = qp("size", 600);
let bg = () => {
  if (this.val) {
    return this.val;
  }
  return (this.val = qpColor("bg", "000"));
};
let lineColor = qpColor("lineColor", "fff");
let pinwheel = null;
function setup() {
  createCanvas(size, size);
  mid = {
    x: size / 2,
    y: size / 2
  };
  //noLoop();
  setupSeed();
  pinwheel = new Pinwheel({ numberOfSpokes: 11, speed: 0.1 });
}

function draw() {
  background(bg());
  translate(mid.x, mid.y);
  pinwheel.draw();
}

class Pinwheel {
  constructor(
    { numberOfSpokes, speed }
  ) {
    this.numberOfSpokes = numberOfSpokes;
    this.incr = 0;
    this.speed = speed;
  }

  draw() {
    const angle = 360 / this.numberOfSpokes;
    push();
    for (let i = 0; i < 1; i += angle) {
      rotate(angle);
      this.lineAndCurve();
    }
    pop();
  }
  lineAndCurve() {
    // draw a straight line down the middle
    {
      const h = 250;
      stroke(color("#fff"));
      strokeWeight(5);
      const halfHeight = h / 2;
      line(0, -halfHeight, 0, halfHeight);
    }
    {
      // draw one that is all like wavy
      const h = 250;
      stroke(color("green"));
      strokeWeight(2.5);
      noFill();
      const halfHeight = h / 2;
      const quarterHeight = h / 4;
      let x = -quarterHeight;
      let y = 0;
      //ellipse(x, y, 10, 10);
      let startAngle = this.incr;
      if (startAngle >= height * 0.325) {
        this.incr = 0;
      }
      this.incr += this.speed;
      let radius = this.incr;
      // push();
      // rotate(radians(90));
      // arc(x, y, radius, startAngle, PI, PI);
      // pop();

      // push();
      // rotate(radians(-90));
      // arc(x, y, radius, startAngle, PI, PI);
      // pop();
      const points = [];
      const period = height;
      const xspacing = 50;
      const dx = (TWO_PI / period) * xspacing;
      const numberOfPoints = Math.floor(period / xspacing);
      const amplitude = 100;
      
      for (let i = 0; i < numberOfPoints; i++) {
        const pt = {x:0, y:0};
        pt.y = dx*i;
        pt.x = sin(pt.y)*amplitude;
        ellipse(pt.x, pt.y, 10, 10);
      }
    }
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

function qpColor(name, def) {
  return qp(name, def, v => {
    if (v) {
      return "#" + v;
    }
    return v;
  });
}
