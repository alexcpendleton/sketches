// inspiration https://ericjleffler.carbonmade.com/projects/5796889/14472409
let mid = {};
const shapeRadius = 40;
function setup() {
  //createCanvas(shapeRadius * 30, shapeRadius * 30);
  createCanvas(screen.width, screen.height);
  const bg = color("#fff");
  //background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
}
function draw() {
  let rows = height / shapeRadius;

  for (let i = 0; i < rows; i++) {
    let y = i * shapeRadius * 2;
    drawRow(y);
  }
}
function drawRow(y) {
  let cols = width / shapeRadius;
  for (let i = 0; i < cols; i++) {
    let x = i * shapeRadius * 2;

    let pos = { x: fuzz(x, 1, 0.8), y: fuzz(y, 1, 0.8) };
    let r = fuzz(shapeRadius, 1, 1);
    let p = makePolygon(pos.x, pos.y, r, 4);
    drawPolygon(p);
  }
}
function fuzz(i, amount, likelihood) {
  let shouldFuzz = random() > likelihood;
  if (!shouldFuzz) {
    return i;
  }
  let r = random(i - amount, i + amount);
  return r;
}

function nextShapeColor(x, y) {
  let options = [
    color("#531B12"),
    color("#775220"),
    color("#88857D"),
    color("#CDBB99"),
    color("#1A434E"),
    color("#0D305C")
  ];
  let index = random(options.length - 1);
  index = floor(index);
  if (options[index] === undefined) {
    return options[options.length - 1];
  }
  const a = random(225, 255);
  const i = options[index];

  return color(i.levels[0], i.levels[1], i.levels[2], a);
}

function randomColor() {
  return color(random(255), random(255), random(255));
}
function makePolygon(x, y, radius, npoints) {
  let points = [];
  /*
  let angle = 360 / npoints;
  console.log(degrees(angle));
  for (let a = 0; a < 360; a += angle) {
    console.log(degrees(a));
    let a2 = radians(a + 45);
    let sx = x + sin(a2) * radius;
    let sy = y + cos(a2) * radius;
    points.push({ x: sx, y: sy, a: a });
  }
  */
  noStroke();

  let angle = TWO_PI / npoints;
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + (cos(a) - sin(a)) * radius;
    let sy = y + (cos(a) + sin(a)) * radius;
    points.push({ x: sx, y: sy, a: a });
  }
  let fillColor = nextShapeColor(x, y);
  return { points, radius, x, y, fillColor };
}
function drawPolygon(poly) {
  fill(poly.fillColor);
  push();

  beginShape();
  for (let i = 0; i < poly.points.length; i++) {
    const pt = poly.points[i];
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
  noFill();
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
