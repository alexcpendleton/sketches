let mid = {};
let lastGrowthSite = {};
let size = qp("size", 600);
let bg = () => qpColor("bg", "000");
let lineColor = qpColor("lineColor", "fff");


function setup() {
  //960,720;
  createCanvas(size, size);
  background(bg());
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();

  lastGrowthSite = {x:0, y:0 };
}

function draw() {
  translate(mid.x, mid.y);
  /*
  We have now described all the components of the fast growth
algorithm. To sum up, the algorithm is initialized as follows:
1) Insert a point charge at the origin,
2) Locate the candidate sites around the charge. On a
square 2D (3D) grid, these would be the eight (twentysix)
neighbors,
3) Calculate the potential at each candidate site according
to Eqn. 10.
An iteration of the algorithm is as follows:
1) Randomly select a growth site according to Eqn. 12.
2) Add a new point charge at the growth site.
3) Update the potential at all the candidate sites according
to Eqn. 11.
4) Add the new candidate sites surrounding the growth site.
5) Calculate the potential at new candidate sites using Eqn.
10.*/
  
  next();
}
function next() {
  const newGrowthSite = randomlySelectGrowthSite(lastGrowthSite);
  const candidates = locateCandidates(growthSite);
  const potentials = calculatePotential(candidates);
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
