// inspiration https://ericjleffler.carbonmade.com/projects/5796889/14472409
// image attribution: California Digital Newspaper Collection, Center for Bibliographic Studies and Research, University of California, Riverside, <http://cdnc.ucr.edu>

const shapeRadius = 45;
let bounds = {
  w: shapeRadius * 25,
  h: shapeRadius * 15,
  start: {
    x: shapeRadius * 2,
    y: shapeRadius * 2
  },
  imgMins: {
    x: 100,
    y: 100
  }
};
let imgLikelihood = 0.2;

let img;
let mid = {};
function preload() {
  setupImg();
}
function setup() {
  createCanvas(bounds.w, bounds.h);
  const bg = color("#fff");
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
}
function draw() {
  let rows = bounds.h / shapeRadius;

  for (let i = 0; i < rows; i++) {
    let y = i * shapeRadius * 2;
    drawRow(y);
  }
}
function drawRow(y) {
  let cols = bounds.w / shapeRadius;
  for (let i = 0; i < cols; i++) {
    let x = i * shapeRadius * 2;

    let pos = { x: fuzz(x, 1, 0.8), y: fuzz(y, 1, 0.8) };
    let r = fuzz(shapeRadius, 1, 1);
    let p = makePolygon(pos.x + bounds.start.x, pos.y + bounds.start.y, r, 4);

    drawPolygonOrImagePortion(p);
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
  const a = random(245, 255);
  const i = options[index];

  return color(i.levels[0], i.levels[1], i.levels[2], a);
}

function randomColor() {
  return color(random(255), random(255), random(255));
}
function makePolygon(x, y, radius, npoints) {
  let points = [];
  let angle = TWO_PI / npoints;
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + (cos(a) - sin(a)) * radius;
    let sy = y + (cos(a) + sin(a)) * radius;
    points.push({ x: sx, y: sy, a: a });
  }
  let fillColor = nextShapeColor(x, y);
  return { points, radius, x, y, fillColor };
}
function drawPolygonOrImagePortion(poly) {
  noStroke();
  let likelihood = imgLikelihood;
  if (random() < likelihood) {
    const w = shapeRadius * 2;
    const x = poly.x - shapeRadius;
    const y = poly.y - shapeRadius;
    drawImagePortion({ img, x, y, w, h: w });
    return;
  }
  drawPolygon(poly);
}
function drawImagePortion({ img, x, y, w, h }) {
  let ix = floor(random(img.width));
  if (ix < bounds.imgMins.x) {
    ix += bounds.imgMins.x;
  }
  let iy = floor(random(img.height));
  if (iy < bounds.imgMins.y) {
    iy += bounds.imgMins.y;
  }
  image(img, x, y, w, h, ix, iy, w, h);
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
  pop();
  noFill();
}

function setupSeed() {
  const fromLocation = new URL(document.location).searchParams.get("seed");
  if (fromLocation) {
    window.seed = parseFloat(fromLocation);
  } else {
    window.seed = ceil(random(0, 1000000));
  }
  console.log("window.seed", window.seed);
  randomSeed(window.seed);
}

function setupImg() {
  img = loadImage("0197.jpg");
}
