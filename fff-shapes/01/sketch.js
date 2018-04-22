let mid = {};

const rows = 6;
const cols = rows;
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
  translate(mid.x / 2 + shapeSize / 2, shapeSize / 2);
  const made = make();
  made.forEach(t => {
    t.draw();
  });
  made.forEach(t => {
    return;
    if (t.s !== undefined) {
      fill(0);
      if (t.s % 2 == 0) {
        text(t.s, t.points[0].x + 10, t.points[0].y + 10);
      } else {
        text(t.s, t.points[0].x - 10, t.points[0].y - 10);
      }
    }
  });
}
function make() {
  // |/|/|/|/|
  // |/|/|/|/|
  // |/|/|/|/|
  // Draw a right triangle at 0,0;0,n;n,0
  // Draw a right triangle at n,n;n,0;0,n;
  const calcPoints = (i, j) => {
    return {
      tl: {
        x: i * shapeSize,
        y: j * shapeSize
      },
      tr: {
        x: i * shapeSize,
        y: j * shapeSize + shapeSize
      },
      bl: {
        x: i * shapeSize + shapeSize,
        y: j * shapeSize
      },
      br: {
        x: i * shapeSize + shapeSize,
        y: j * shapeSize + shapeSize
      }
    };
  };
  for (let j = 0; j < rows; j++) {
    let s = 0;
    for (let i = 0; i < cols; i++) {
      let t1 = new Tri();
      let t2 = new Tri();
      let pts = calcPoints(i, j);

      t1.points[0] = pts.tl;
      t1.points[1] = pts.tr;
      t1.points[2] = pts.bl;
      t1.fill = chooseShapeColor(j, s);
      t1.note = { n: "t1", i, j, pts };
      t1.s = s;
      t1.row = j;

      t2.points[0] = pts.br;
      t2.points[1] = pts.tr;
      t2.points[2] = pts.bl;
      s++;
      t2.fill = chooseShapeColor(j, s);
      t2.note = { n: "t2", i, j, pts };
      t2.s = s;
      t2.row = j;
      s++;
      results.push(t1);
      results.push(t2);
    }
    s++;
  }
  console.log(results);
  return results;
}
function chooseShapeColor(row, s) {
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
    stroke(0);
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
