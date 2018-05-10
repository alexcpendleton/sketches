let mid = {};
let anchor = {};

function setup() {
  //960,720;
  createCanvas(screen.width, screen.height);
  const bg = color("#fff");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();
  anchor = { x: screen.width / 2, y: height };
  let numberOfHangydowns = 20;
  let space = screen.width / numberOfHangydowns;
  for (let i = 0; i < numberOfHangydowns; i++) {
    hangydowns.push(
      new Hangydown({
        x: i * space,
        y: 0,
        color: randomColorFromPallete()
      })
    );
  }

  // hangydowns.push(new Hangydown( { x: 50, y: 0 }));
  // hangydowns.push(new Hangydown({ x: 75, y: 0 }));
  // hangydowns.push(new Hangydown({ x: 100, y: 0 }));
  // hangydowns.push(new Hangydown({ x: 125, y: 0 }));
  // hangydowns.push(new Hangydown({ x: 150, y: 0 }));
}
//seed(228241);
let hangydowns = [];
function draw() {
  // create n hangydowns along the top
  stroke(10);
  hangydowns.forEach(h => {
    h.walk();
  });
}
function Hangydown({ x, y, color, size = 10 }) {
  const result = {};
  result.x = x;
  result.y = y;
  result.size = size;
  result.color = color;
  result.walk = function() {
    if (this.y > height) {
      return;
    }
    this.y = this.y + 1;
    //let r = random(0, 1);
    //let dist = Math.abs(anchor.x - this.x);

    // if (r < 0.1) {
    //   if (this.x < anchor.x) {
    //     this.x++;
    //   } else {
    //     this.x--;
    //   }
    // }

    // r = random(0, 1);
    // if (r < 0.5 && this.color.alpha > 0) {
    //   this.color.setAlpha(this.color.alpha - 1);
    // }
    let r = random(0, 1);
    let step = 1;
    if (r < 0.1) {
      this.y = this.y + 2 * step;
    } else if (r > 0.1 && r < 0.5) {
      this.y = this.y - step;
    } else if (r > 0.5 && r < 0.75) {
      this.x = this.x + step;
    } else {
      this.x = this.x - step;
    }

    r = random(0, 1);
    if (r < 0.005) {
      this.size -= 1;
    }
    if (this.size < 1) {
      this.size = 1;
    }
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
    //rect(this.x, this.y, this.size, this.size);
  };
  return result;
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
function randomColorFromPallete() {
  return color("#fff");
  let x = randomFromArray([
    color("#8DAA91"),
    color("#788475"),
    color("#5E5D5C"),
    color("#453643"),
    color("#28112B"),
    color("#967351")
  ]);
  let r = color(x);
  return r;
}
