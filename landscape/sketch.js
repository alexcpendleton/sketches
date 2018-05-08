let mid = {};

function setup() {
  //960,720;
  createCanvas(700, 700);
  const bg = color("#E98A15");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
}
function draw() {
  drawSky();
  let h = drawGround();
  drawTrees(h);
}
function drawSky() {}
function drawGround() {
  stroke("#012622");
  fill("#69385C");
  const h = height - 200;
  rect(0, h, width, h);
  return { h, w: width };
}
let treeBuffer = 50;
let treeWidth = 100;
function drawTrees({ h, w }) {
  let numberOfTrees = w / (treeWidth + treeBuffer);
  for (let i = 0; i < numberOfTrees; i++) {
    let x = (treeBuffer + treeWidth) * i + treeBuffer;
    let y = h;
    drawOneTree({ x, y });
  }
}
function drawOneTree({ x, y }) {
  stroke("#012622");
  fill("#003B36");
  ellipse(x, y, treeWidth, treeWidth);
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
