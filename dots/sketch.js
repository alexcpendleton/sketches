// inspiration http://www.tylerlhobbs.com/static/img/st-a-800.jpg

const dotRadius = 3;
let dotColor = {};
let densityStep = 10;
let dotFuzz = 0.8;
let xFuzz = 7;
let yFuzz = 4;
const sq = 20;
function setup() {
  dotColor = color(0, 0, 0);
  bgColor = color(255, 255, 255);

  createCanvas(screen.width, screen.height);
  background(bgColor);
  noLoop();
}

function draw() {
  let rows = 5,
    x = 0,
    y = 0;
  for (let i = 0; i < rows; i++) {
    let step = rows * densityStep;
    y = sq;
    x = sq;
    const space = { x, y };
    y = height / (i + 1);
    x = width + 1;
    bounds = { x, y };
    doit(space, bounds);
  }
}
function doit(space, bounds) {
  console.log(space, bounds);
  //return;
  // every n across and n down draw a dot
  let coords = [];

  for (let i = 0; i < bounds.y; i = i + space.y) {
    for (let j = 0; j < bounds.x; j = j + space.x) {
      drawADot({ x: j, y: i });
      if (drawn > 2000) {
        // panic, probably in an infinite loop
        console.log("AHHHH", j, i);
        return;
      }
      drawn++;
    }
  }
}
let drawn = 0;
function drawADot(near) {
  fill(dotColor);
  const radius = fuzz(dotRadius, dotFuzz);
  const x = fuzz(near.x, xFuzz);
  const y = fuzz(near.y, yFuzz);
  ellipse(x, y, radius, radius);
}
function fuzz(i, fuzzFactor) {
  let r = randomGaussian(i - fuzzFactor, i + fuzzFactor);
  return r;
}

/*
every n pixels right draw a dot until you get to the end of the canvas
move that line `n` pixels down
*/
