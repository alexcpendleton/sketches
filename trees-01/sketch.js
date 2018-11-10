let mid = {};
let palette = [];
let bg;
let dimensions;
let numberOfLayers;
let frontColor;
let backColor;
let averageTreeHeight;
let numberOfTreesPerLayer;
let averageTreeWidth;

function setup() {
  dimensions = { w: 562, h: 1218 };
  numberOfLayers = 1;
  frontColor = color("#000");
  backColor = color("#fff");
  averageTreeHeight = dimensions.h * 0.75;
  numberOfTreesPerLayer = 1; //10;
  averageTreeWidth = dimensions.w / numberOfTreesPerLayer;

  createCanvas(dimensions.w, dimensions.h);
  bg = qpColor("bg", "#fff");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
}

function draw() {
  const theTrees = [];
  // work from the bottom up
  translate(0, dimensions.h);

  for (let layerIndex = 0; layerIndex < numberOfLayers; layerIndex++) {
    let layerY = layerIndex * (averageTreeHeight / 2);
    for (let treeIndex = 0; treeIndex < numberOfTreesPerLayer; treeIndex++) {
      const treeX = treeIndex * averageTreeWidth;
      const treeBottomPosition = { x: treeX, y: layerY };
      var currentTree = new Tree({
        basePosition: treeBottomPosition
      });
      currentTree.draw();
    }
  }
}

class Tree {
  constructor(options) {
    Object.assign(
      this,
      {
        basePosition: { x: 0, y: 0 },
        baseColor: frontColor,
        averageBranchWidth: 1,
        height: averageTreeHeight,
        branchSpacing: 1,
        branchLengthMax: averageTreeHeight * 0.25
      },
      options
    );
  }
  draw() {
    this.drawTrunk();
    let maxBranches = 5; //this.height / this.averageBranchWidth;
    debugger;
    for (let i = 0; i < maxBranches; i++) {
      const y = this.basePosition.y + i * this.averageBranchWidth;
      const x = this.basePosition.x;

      if (i % 10 === 0) {
        // textSize(6);
        // text(`b${i}`, x, y);
        // console.log(`b${i}`, x, y);
        debugger;
      }
      // draw left branch
      //this.drawBranch({ x, y, i, xMod: 1 });
      // draw right branch
      this.drawBranch({ x, y, i, xMod: -1 });
    }
  }
  drawTrunk() {
    stroke(this.baseColor);
    let { x, y } = { ...this.basePosition };
    rect(x, y, 10, this.height * -1);
  }
  drawBranch({ x, y, i, xMod }) {
    stroke(this.baseColor);
    fill(this.baseColor);
    // xMod should be -1 for left, 1 for right
    // The length should decrease further up the tree
    const branchLength = this.branchLengthMax; // - i;
    const branchHeight = this.averageBranchWidth;

    const actualX = xMod === -1 ? x - branchLength : x;
    rect(actualX, y, branchLength, branchHeight);

    //line(x, y, x2, y);
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
function qpColor(name, def) {
  return qp(name, def, v => {
    if (v) {
      return "#" + v;
    }
    return v;
  });
}

function mouseReleased() {
  return;
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
