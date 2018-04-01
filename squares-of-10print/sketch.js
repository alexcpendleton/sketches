
let spacing = 20;
let threshold = 500;

function setup() {
  let s = 400;
  createCanvas(s, s);
  threshold = s + 1;
  background(0);
  noLoop();
  noFill();
}

function strokeLineColor() {
  stroke(255);
}

let debugIndex = 0;
let debugColors = [()=>stroke(255, 0, 0), ()=>stroke(0, 255, 0), ]//()=>stroke(0, 0, 255)]
function strokeNextDebugColor() {
  if(debugIndex >= debugColors.length) {
    debugIndex = 0;
  }
  debugIndex = 0;
  debugColors[debugIndex]();
  debugIndex++;
}

function draw() {
  strokeLineColor();
  let debug = true;
  stacked(()=> {
    draw10print(100, 100, 1, debug);
  });
  stacked(()=> {
    translate(100, 0);
    draw10print(50, 50, 0, debug);
  });
  stacked(()=> {
    translate(100, 50)
    draw10print(50, 50, .5, debug);
  });
  return;
  /*
  translate(0, 160);
  draw10print(60, 60);
  translate(60, 200);
  draw10print(60, 60);
  */
}
function stacked(cb) {
  pushStack();
  cb();
  popStack();
}
function draw10print(maxWidth, maxHeight, weight=0.5, debug=true) {
  if(debug) {
    //strokeNextDebugColor();
    stroke(0, 0, 255);
    rect(0, 0, maxWidth, maxHeight)
    strokeLineColor();
  }
  let x = 0;
  let y = 0;
  var done = false;
  function drawBlock() {
    console.log("drawing block @", x, y)
    if (random(1) < weight) {
      line(x, y, x + spacing, y + spacing);
    } else {
      line(x, y + spacing, x + spacing, y);
    }
    if(false) {
      console.log("drawBlock debug")
      strokeNextDebugColor()
      rect(x, y, x+spacing, y+spacing);
      strokeLineColor();
      console.log("x, y", x, y);
    }
  }
  function moveToNextBlock() {
    console.log("moving to next block");
    x = x + spacing;

  }
  function drawRows() {
    drawBlock();
    moveToNextBlock();
    if (x >= maxWidth) {
      console.log("moving to next line");
      x = 0;
      y = y + spacing;
      if(y>=maxHeight) {
        console.log("done");
        done = true;
        return;
      }
    }
  }
  while(!done) {
    console.log("y+spacing", y+spacing, maxHeight)
    drawRows();
  }
}