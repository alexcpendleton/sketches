let mid = {};
let sides = 6;
let shapeRadius = 50;

function setup() {
  createCanvas(screen.width, screen.height);
  //background(bgColor);
  //colorMode(HSB, 100);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
}

let frameCount = 0;
let amountDrawn = 0;

function draw() {
  randomSeed(2734);
  // start with tiling polygons within the bounds of the canvas
  // fill it up
  // each one with a random color fill
  let shapeDiameter = shapeRadius * 2;
  const padding = {
    x: shapeRadius,
    y: shapeDiameter * 2
  };

  let beep = 1;
  const step = {
    x: shapeRadius,
    y: shapeRadius / 4
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
  maxShapes.x = ceil((width + padding.x) / shapeRadius);
  maxShapes.y = ceil((height + padding.y) / shapeRadius);
  maxShapes.y = 10;
  maxShapes.x = 5;

  let buffer = {
    x: shapeRadius * 2,
    y: shapeRadius * 2
  }
  translate(buffer.x, buffer.y)

  for (let i = 0; i < maxShapes.x; i++) {
    //let j = 0;
    for (let j = 0; j < maxShapes.y; j++) {
      let isEvenRow = i % 2 == 0;
      let fillColor = isEvenRow ? color(255, 0, 0) : color(0, 255, 255);
      fill(fillColor);
      let x = i * (shapeRadius * 2);
      let y = j * (shapeRadius * 2);
      if (!isEvenRow) {
        x = x + (shapeRadius * .25);
        y = y + (shapeRadius)
      }
      //x = x + buffer.x;
      //y = y + buffer.y;
      console.log({
        i,
        j,
        x,
        y,
        shapeRadius
      })
      polygon(x, y, shapeRadius, 6);
      // let offset = {
      //   x: 0,
      //   y: 0
      // };
      // let c = color(255, 0, 0);
      // if (beep % 2 == 0) {
      //   offset.x = shapeRadius * i * 3;
      //   offset.y = shapeRadius * j; // 1.75;
      // } else {
      //   offset.x = shapeRadius * i * 1.5;
      //   offset.y = shapeRadius * j; // 1.75;
      //   c = color(0, 255, 255);
      // }
      //offset.y += 100;
      //offset.x += shapeRadius;
      //offset.x += i*shapeRadius
      //offset.y = offset.y * 2;
      // beep++;
      // fill(c);
      //polygon(offset.x, offset.y, shapeRadius, sides);
      if (amountDrawn > 1000) {
        console.error("AHHHHHH");
        return;
      }
    }
  }

  //frameCount++;
}

function randomColor() {
  return color(random(255), random(255), random(255));
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    // if (a < 3) {
    //   stroke(color(255, 0, 0));
    // } else {
    //   endShape(CLOSE);
    //   stroke(color(0, 0, 0));
    // }
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  rectMode(CENTER);
  noFill();

  rect(x, y, radius * 2, radius * 2);
}
