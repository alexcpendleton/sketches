let mid = {};
let sides = 6;
let baseRadius = 50;

function setup() {
  createCanvas(screen.width, screen.height);
  const bg = color("#000");
  //background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
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

let frameCount = 0;
let amountDrawn = 0;

function draw() {
  // start with tiling polygons within the bounds of the canvas
  // fill it up
  // each one with a random color fill
  let shapeDiameter = baseRadius * 2;
  const padding = {
    x: baseRadius,
    y: shapeDiameter * 2
  };

  let beep = 1;
  const step = {
    x: baseRadius,
    y: baseRadius / 4
  };

  let maxShapes = {
    x: 0,
    y: 0
  };

  // move to the right n*2 radius
  // move to the right n*1 radius
  // move down j*2 radius
  // draw one hex
  // \_/ \_/
  //on odd rows, do the same thing, but start at 1.25 radius right
  //    and 1 radius down
  // / \_/ \
  // \_/ \_/
  //   \_/
  // <-repeat
  maxShapes.x = ceil((width + padding.x) / baseRadius);
  maxShapes.y = ceil((height + padding.y) / baseRadius);
  //maxShapes.y = 10;
  //maxShapes.x = 10;

  let buffer = {
    x: 0, //baseRadius * 2,
    y: 0 //baseRadius * 2
  };
  translate(buffer.x, buffer.y);
  const toBeDrawn = [];
  for (let j = 0; j < maxShapes.y; j++) {
    for (let i = 0; i < maxShapes.x; i++) {
      let isEvenRow = j % 2 == 0;

      let fillColor = isEvenRow ? color(255, 0, 0) : color(0, 255, 255);
      fillColor = nextShapeColor(i, j);
      //fill(fillColor);
      //noStroke();
      let x = i * (baseRadius * 3);
      let y = j * (baseRadius * 1 * 0.875);
      if (!isEvenRow) {
        x = x + baseRadius * 1.5;
        y = y - baseRadius * 1.75;
      }

      const actualRadius = fuzz(baseRadius, baseRadius / 2);
      const sides = 6;
      const x2 = fuzz(x, 10);
      const y2 = fuzz(y, 10);
      const made = makePolygon(x2, y2, actualRadius, sides);
      made.fillColor = fillColor;
      toBeDrawn.push(made);
    }
  }
  drawPolygons(toBeDrawn);
}
function drawPolygons(toBeDrawn) {
  const copy = toBeDrawn.slice();
  shuffleArray(copy);
  for (let i = 0; i < copy.length; i++) {
    const element = copy[i];
    drawPolygon(element);
  }
}
function shuffleArray(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function nextShapeColor(x, y) {
  let options = [
    color("#ed8b00"),
    color("#ffdd40"),
    color("#ffdd40"),
    color("#ffdd40"),
    color("#fceaa3"),
    color("#fceaa3"),
    color("#fceaa3"),
    color("#f2f7fb")
  ];
  let index = random(options.length - 1);
  index = floor(index);
  if (options[index] === undefined) {
    return options[0];
  }
  const a = random(225, 255);
  const i = options[index];

  return color(i.levels[0], i.levels[1], i.levels[2], a);
}

function fuzz(i, fuzzFactor) {
  let r = random(i - fuzzFactor, i + fuzzFactor);
  return r;
}

function randomColor() {
  return color(random(255), random(255), random(255));
}
function makePolygon(x, y, radius, npoints) {
  let points = [];
  let angle = TWO_PI / npoints;
  for (let a = 0; a < TWO_PI; a += angle) {
    // if (a < 3) {
    //   stroke(color(255, 0, 0));
    // } else {
    //   endShape(CLOSE);
    //   stroke(color(0, 0, 0));
    // }
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    //vertex(sx, sy);
    points.push({ x: sx, y: sy, a: a });
  }
  return { points, radius, x, y };
}
function drawPolygon(poly) {
  fill(poly.fillColor);
  beginShape();
  for (let i = 0; i < poly.points.length; i++) {
    const pt = poly.points[i];
    strokeWeight(random(0, 0.25));
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
  noFill();
}
function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  rectMode(CENTER);
  noFill();
}
