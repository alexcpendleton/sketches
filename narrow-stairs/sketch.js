let mid = {};
let palette = [];
let bounds = { width: 500, height: 500 };
function setup() {
  //960,720;
  //https://lh4.ggpht.com/-_8gS_kksUfrAw1N7R42_ioG8dtvh_jt07S2qbnpnV6Gz1gTF136F1IpGPW6frr8noJuxqOkaw=s1024-c-e100-rwu-v1
  createCanvas(bounds.width, bounds.height);
  const bg = color("#fff");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
  /*
  it looks like a collage. There are vertical bands of 
  narrow(ish) rectangles cut from a few different images.
  The left-most third seems to be mostly from a greenish-brown
  image, mixed with a bluish image. The middle third seems to
  be mostly that bluish one, fading into mostly reddish on the
  right-most third. 
  */
}

function draw() {
  debugger;
  const numberOfVerticalBands = 100;
  const averageBandWidth = Math.ceil(bounds.width / numberOfVerticalBands);
  noStroke();
  for (let i = 0; i < numberOfVerticalBands; i++) {
    const bandWidth = averageBandWidth;
    const x = bandWidth * i;
    // draw rectangles between 1/10th and 1/5th the height of the image
    // until the last y extends beyond the height
    let y = 0;
    let minRectHeight = bounds.height / 10;
    let maxRectHeight = bounds.height / 18;

    while (y < bounds.height) {
      const rectColor = pickColorByX(x);
      const rectHeight = Math.ceil(random(minRectHeight, maxRectHeight));
      fill(rectColor);
      rect(x, y, bandWidth, rectHeight);
      y = y + rectHeight;
    }
  }
}

function pickColorByX(x) {
  const left = color("#436A50");
  const middle = color("#6B95A0");
  const right = color("#5D1A1A");
  const wildcard = color("#ECDFD1");
  if (random(0, 1) < 0.12) {
    return wildcard;
  }
  // todo: I'm sure there's a mathier way to do this
  const mapped = map(x, 0, bounds.width, 0, 1);
  if (mapped < 0.05) {
    return left;
  }
  if (mapped < 0.2) {
    return random(0, 1) < 0.7 ? left : middle;
  }
  if (mapped < 0.5) {
    return random(0, 1) < 0.5 ? left : middle;
  }
  if (mapped < 0.85) {
    return random(0, 1) < 0.8 ? middle : right;
  }
  return right;
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

function qp(name, def, customParser) {
  let value = new URL(document.location).searchParams.get(name);
  if (value === null || value === undefined || value === "") {
    value = def;
  }
  if (customParser) {
    value = customParser(value);
  } else {
    if (!isNaN(value)) {
      value = parseFloat(value);
    }
  }
  console.log("qp", name, value, def);
  return value;
}

function mouseReleased() {
  if (mouseReleased.isCurrentlyPaused) {
    console.log("resumed");
    mouseReleased.isCurrentlyPaused = false;
    return loop();
  }
  mouseReleased.isCurrentlyPaused = true;
  noLoop();
  console.log("paused");
}

function ca(c, a) {
  const result = color(c);
  if (a !== undefined) {
    result.setAlpha(a);
  }
  return result;
}

function randomColorFromPallete() {
  let x = randomFromArray(palette);
  x = x.levels;
  let r = color(x[0], x[1], x[2]);
  return r;
}

function randomFromArray(arr) {
  const i = Math.floor(random(0, arr.length));
  return arr[i];
}
