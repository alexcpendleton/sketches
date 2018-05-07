let mid = {};
let colors = {};
function setup() {
  //960,720;
  createCanvas(700, 700);
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();
  colors.floralWhite = color("#FFF8F0");
  colors.darkOrange = color("#FF8811");
  colors.orangeYellow = color("#F4D06F");
  colors.moonstoneBlue = color("#73BFB8");
  colors.royalPurple = color("#392F5A");
  colors.fusciaPurple = color("#D83C7B");
  colors.rubyRed = color("#A31621");
  colors.paleAqua = color("#BFDBF7");
  colors.bg = color(colors.paleAqua);
  const bg = color(colors.bg);
  background(bg);
}
let rotation = 0;
function draw() {
  smooth(4);
  noStroke();
  const wipe = color(colors.bg);
  wipe.setAlpha(15);
  fill(wipe);
  rect(0, 0, width, height);

  let ringPoints = [];
  translate(mid.x, mid.y);

  stroke(color(0, 0, 0, 10));
  strokeWeight(1);

  push();
  rotate(radians(rotation * 1));
  fill(colors.darkOrange);
  beginShape();
  polygonPoints(50).forEach(i => vertex(i.x, i.y));
  endShape();
  pop();

  push();
  fill(colors.royalPurple);
  ringPoints = polygonPoints(220, { ao: HALF_PI });
  rotate(radians(-1 * rotation * 2));
  ringPoints.forEach(i => {
    push();
    translate(i.x, i.y);
    drawHex(20);
    pop();
  });
  pop();

  push();
  rotate(radians(-1 * rotation * 0.5));
  fill(colors.rubyRed);
  ringPoints = polygonPoints(142.5);
  ringPoints.forEach(i => {
    push();
    translate(i.x, i.y);
    drawHex(5);
    pop();
  });

  push();
  rotate(radians(-1 * rotation * 1.5));
  fill(colors.orangeYellow);
  ringPoints = polygonPoints(100, { ao: HALF_PI });
  ringPoints.forEach(i => {
    push();
    translate(i.x, i.y);
    drawHex(40);
    pop();
  });
  pop();

  push();
  rotate(radians(rotation));
  fill(colors.moonstoneBlue);
  ringPoints = polygonPoints(175);
  ringPoints.forEach(i => {
    push();
    translate(i.x, i.y);
    drawHex(25);
    pop();
  });

  push();
  rotate(radians(rotation * 0.1625));
  fill(colors.fusciaPurple);
  ringPoints = polygonPoints(250);
  ringPoints.forEach(i => {
    push();
    translate(i.x, i.y);
    drawHex(10);
    pop();
  });

  pop();
  rotation++;
  if (rotation > 360) {
    rotation = 0;
  }
}
function drawHex(radius) {
  beginShape();
  polygonPoints(radius).forEach(i => vertex(i.x, i.y));
  endShape();
}
function polygonPoints(radius, { x = 0, y = 0, npoints = 6, ao = 0 } = {}) {
  var angle = TWO_PI / npoints;
  const results = [];
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a + ao) * radius;
    var sy = y + sin(a + ao) * radius;
    results.push({ x: sx, y: sy });
  }
  return results;
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
