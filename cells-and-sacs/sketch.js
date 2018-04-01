// inspiration: https://youtu.be/jN99Kx_ghC8?t=17
let sacs = [];
let midpoint = {x:0, y:0};
function setup() {
  let s = 400;
  createCanvas(s, s);
  background(0, 0, 0);
  const m = s/2;
  midpoint = {x:m, y:m};
  sacs = createSacs();
}
function draw() {
  sacs.forEach(i=>i.draw());
}
function createSacs() {
  return [makeSac()];
}
function packCellsWithin(container) {
  const desiredRadius = 10;
  const existingCells = container.existingCells || [];
  let addingCells = true;
  while(addingCells) {
    // pick a spot within the container 
    const position = container.findPositionWithinArea({buffer:desiredRadius});
    // ensure that no other cells overlap it
    existingCells.forEach(other=>{
      // Since we're drawing a circle we check the radius
      // of the other cell + radius of this cell, and if 
      // the distance between centerpoints is greater than that
      // we can draw it
      const distanceBetweenCells = dist(position, other.position);
      const radiusSum = desiredRadius + other.radius;
      if (distanceBetweenCells > radiusSum) {
        existingCells.push({
          position, radius: desiredRadius
        });
      } else {
        addingCells = false;
      }

      addingCells = false;
    });
    // draw if successful
    // otherwise, stop/return
  }
}
function circle({x,y},radius) {
  ellipse(x, y, radius);
}
function makeSac() {
  const bounds = {
    x:midpoint.x,
    y:midpoint.y
  };
  const radius = 100;
  const colors = {
    stroke:color(255, 0, 0),
    fill:color(0, 255, 0)
  };
  const draw = ()=>{
    stroke(colors.stroke);
    fill(colors.fill);
    circle(bounds, radius);
    if(cells) {
      cells.forEach(i=>{
        stroke(0,0,255);
        fill(0,0,255);
        circle(i.position, i.radius);
      })
    }
  };
  const findPositionWithinArea = (buffer) => {
    const r = ()=>random(0, radius - buffer);
    return {x:r(), y:r()};
  }
  const output = {
    bounds, radius, colors, findPositionWithinArea, draw, cells:[]
  };
  output.cells = packCellsWithin(output);
  return output;
}