let mid = {};

const rows = 14;
const cols = 40;
const results = [];
const shapeSize = 100;
let colors = {};

function setup() {
  createCanvas(screen.width, screen.height);
  colors.bg = color("#d4dee9");
  colors.shapeA = color("#e9d062");
  colors.shapeB = color("#e55312"); //df422a
  //http://www.color-hex.com/color-palette/59461
  background(colors.bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
}
function draw() {
  //translate(mid.x / 2 + shapeSize / 2, shapeSize / 2);

  const made = make();
  made.forEach(t => {
    t.draw();
  });
  ellipse(0, 0, 10, 10);
}

function calcPoints(i, j) {
  let npoints = 3;
  let radius = shapeSize / 2;
  let points = [];
  let x = i;
  let y = j;
  let angle = TWO_PI / npoints;
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a - PI / 2) * radius;
    let sy = y + sin(a - PI / 2) * radius;
    points.push({ x: sx, y: sy, a: a });
  }
  return points;
}
function drawTri(colIndex, color) {
  let t = new Tri();
  let pts = calcPoints(0, 0);
  t.points = pts;
  if (color) {
    t.fill = color;
  }
  // t.points[0] = { x: 0, y: 0 };
  // t.points[1] = { x: shapeSize, y: 0 };
  // t.points[2] = { x: shapeSize * 0, y: shapeSize };
  //console.log();
  let tr = pts[0];
  //translate(tr.x + shapeSize * 0.25, tr.y);
  t.draw();

  //ellipse(0, 0, 5, 5);
  //text(colIndex.toString(), 0, -10);
  return pts;
}
function make() {
  console.log("cols", cols);
  let nextY = 0;
  let oddX = 0;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    push();
    const x = rowIndex % 2 == 0 ? 0 : oddX;
    translate(x, nextY * rowIndex * 3);
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      let d = drawTri(colIndex, chooseShapeColor(rowIndex, colIndex));
      translate(d[1].x, d[1].y * -1); //d[1].y);
      push();
      rotate(radians(180));
      d = drawTri(colIndex, chooseShapeColor(rowIndex, colIndex + 2));
      pop();
      translate(d[1].x, d[1].y); //d[1].y);
      nextY = d[1].y;
      if (oddX == 0) {
        oddX = -1 * d[1].x;
      }
      if (colIndex == cols - 1) {
        console.log(rowIndex, d);
      }
    }
    console.log("nextY", nextY);
    pop();
  }

  return results;
}
function randomIn(arr) {
  const i = Math.floor(random(0, arr.length));
  return arr[i];
}
function chooseShapeColor(row, s) {
  const options = [
    color("#40e0d0"),
    color("#f6f0ff"),
    color("#944dd3"),
    color("#733fd7"),
    color("#302384"),
    color("#1c0c4e")
  ];
  return randomIn(options);

  if (row % 2 == 0) {
    return s % 2 == 0 ? colors.shapeA : colors.shapeB;
  }
  return s % 2 == 0 ? colors.shapeB : colors.shapeA;

  // 0,1 0,2 0,5 0,6  0,9 0,10
  if (row % 2 == 0) {
    if ([1, 2, 5, 6, 9, 10].indexOf(s) != -1) {
      return colors.shapeB;
    }
    return colors.shapeA;
  }
  if ([0, 3, 4, 7, 8, 11, 12].indexOf(s) != -1) {
    return colors.shapeB;
  }
  return colors.shapeA;
}

function Tri() {
  this.points = [];
  this.fill = color("#fff");
  this.draw = () => {
    strokeWeight(1);
    stroke(0, 0, 0, 64);

    fill(this.fill);
    triangle(
      this.points[0].x,
      this.points[0].y,
      this.points[1].x,
      this.points[1].y,
      this.points[2].x,
      this.points[2].y
    );
  };
  return this;
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
