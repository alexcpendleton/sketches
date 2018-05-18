let mid = {};
function ca(c, a) {
  const result = color(c);
  if (a !== undefined) {
    result.setAlpha(a);
  }
  return result;
}
function setup() {
  createCanvas(900, 700);
  const bg = color("#DCE2AA");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();

  let containerPoints = polygonPoints(300, 70);
  blobs = containerPoints
    .map(i => {
      return new Blob({
        x: i.x,
        y: i.y,
        radius: 15,
        weight: 2,
        fc: ca("#000", 228)
      });
    })
    .filter(i => random(0, 1) < 0.65);
  containerPoints = polygonPoints(200, 100);
  blobs.push(
    ...containerPoints
      .map(i => {
        return new Blob({
          x: i.x,
          y: i.y,
          radius: 12,
          weight: 1.5,
          fc: ca("#000", 200)
        });
      })
      .filter(i => random(0, 1) < 0.45)
  );
  containerPoints = polygonPoints(80, 80);
  blobs.push(
    ...containerPoints
      .map(i => {
        return new Blob({
          x: i.x,
          y: i.y,
          radius: 5,
          weight: 1,
          fc: ca("#000", 200)
        });
      })
      .filter(i => random(0, 1) < 0.25)
  );
}
let blobs = [];
function draw() {
  translate(mid.x, mid.y);
  const size = 10;
  //strokeWeight(3);
  fill("#ff");
  blobs.forEach(i => {
    i.draw();
    i.spawn();
  });
}

function Blob({
  x,
  y,
  radius,
  lifespan,
  weight = 2,
  fc = color("#fff"),
  sc = color("#000")
}) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.timesSpawned = 0;
  this.lifespan = lifespan || Math.floor(random(0, 20));
  this.weight = weight;
  this.fillColor = fc;
  this.strokeColor = sc;
  this.draw = () => {
    if (this.timesSpawned > this.lifespan) {
      return true;
    }
    console.log("draw", this.timesSpawned);
    strokeWeight(this.weight);
    stroke(this.strokeColor);
    fill(this.fillColor);
    ellipse(this.x, this.y, this.radius);
    //text(this.timesSpawned, this.x, this.y);
    return false;
  };
  this.spawn = () => {
    if (this.timesSpawned !== 0) {
      // pick a new X,Y somewhere along the radius
      // draw another circle there but slightly smaller
      const angle = radians(Math.floor(random(0, 360)));
      const sx = this.x + cos(angle) * radius;
      const sy = this.y + sin(angle) * radius;
      this.x = sx;
      this.y = sy;
      this.radius -= 1;
    }
    this.timesSpawned++;
  };
  return this;
}

function polygonPoints(radius, numberOfPoints, { x = 0, y = 0, ao = 0 } = {}) {
  var angle = TWO_PI / numberOfPoints;
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
