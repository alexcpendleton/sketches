let mid = {};
let bgColor = ()=> qpColor("bg", "E0777D");//color("#E0777D");
let mainRingColor = (a)=>ca(qpColor("m","E1DD8F"), a);
let canvasSize = 600;
let ring1 = {
  numPoints: 16,
  ringRadius: 130,
  circleRadius: 100,
  prep:()=> {
    strokeWeight(2.25);
    stroke("#E1DD8F")
    noFill();
  },
  points:[]
};
let ring2 = {
  numPoints: 16,
  ringRadius: 65,
  circleRadius: 50,
  prep:()=> {
    strokeWeight(1.5);
    stroke(mainRingColor(225));
    noFill();
  },
  points:[]
};
let ring3 = {
  numPoints: 16,
  ringRadius: 32.5,
  circleRadius: 25,
  prep:()=> {
    strokeWeight(1);
    stroke(mainRingColor(150));
    noFill();
  },
  points:[]
};
let ring4 = {
  numPoints: 16,
  ringRadius: 16.25,
  circleRadius: 12.5,
  prep:()=> {
    strokeWeight(.75);
    stroke(mainRingColor(100));
    noFill();
  },
  points:[]
}
let ring5 = {
  numPoints: 16,
  ringRadius: 8.125,
  circleRadius: 6.25,
  prep:()=> {
    strokeWeight(.5);
    stroke(mainRingColor(80));
    noFill();
  },
  points:[]
}
let rings = [ring1, ring2, ring3, ring4, ring5];
function setup() {
  //960,720;
  createCanvas(canvasSize, canvasSize);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
}

function draw() {
  background(bgColor());
  translate(mid.x, mid.y);
  if (rings) {
    rings.forEach(drawRings)
  }
}

function drawRings(rings) {
  if (rings.points.length === 0) {
    rings.points = polygonPoints(rings.ringRadius, rings.numPoints);
  }
  rings.prep();
  rings.points.forEach(i=> {
    ellipse(i.x, i.y, rings.circleRadius);
  });
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


function polygonPoints(radius, numberOfPoints, { x = 0, y = 0, ao = 0 } = {}) {
  var angle = TWO_PI / numberOfPoints;
  const results = [];
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a + ao) * radius;
    var sy = y + sin(a + ao) * radius;
    results.push(createVector(sx, sy));
  }
  return results;
}
function ca(c, a) {
  const result = color(c);
  if (a !== undefined) {
    result.setAlpha(a);
  }
  return result;
}
function qpColor(name, def) {
  return qp(name, def, (v)=> {
    if(v) {
      return "#"+v;
    }
    return v;
  })
}