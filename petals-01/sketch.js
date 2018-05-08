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
  colors.macaroniAndCheese = color("#FFAF87");
  colors.salmon = color("#FF8E72");
  colors.pastelRed = color("#ED6A5E");
  colors.eucalyptus = color("#4CE0B3");
  colors.myrtleGreen = color("#377771");
  shadowPosition = { x: 0, y: 0 };
}
var rotation = 0;
var shadowPosition = {};
function draw() {
  const bg = color("#C6B3FC");
  background(bg);
  let c = {};

  noStroke();
  //push();
  // blendMode(BURN);
  // shadowPosition.x = shadowPosition.x + 1;
  // translate(shadowPosition.x, shadowPosition.y);
  // rotate(radians(45));
  // c = color("#232528");

  // fill(c);
  // rect(0, 0, 900, 100);
  // pop();

  translate(mid.x, mid.y);
  scale(0.9);

  push();
  rotate(radians(-1 * rotation));
  c = color(colors.pastelRed);
  c.setAlpha(120);
  fill(c);
  for (var i = 0; i < 10; i++) {
    ellipse(0, 305, 60, 80);
    rotate(PI / 5);
  }
  pop();

  push();
  blendMode(MULTIPLY);
  rotate(radians(rotation));
  c = color("#009FFD");
  c.setAlpha(20);
  fill(c);
  for (var i = 0; i < 10; i++) {
    ellipse(0, 0, 500, 50);
    rotate(PI / 10);
  }
  pop();

  push();
  c = color(color("#FFEE00"));
  //c = color("#fff");
  c.setAlpha(20);
  fill(c);
  rotate(PI * 0.0333);
  for (var i = 0; i < 10; i++) {
    ellipse(0, 0, 500, 50);
    rotate(PI / 10);
  }
  pop();
  rotation += 0.5;
  if (rotation > 360) {
    rotation = 0;
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
