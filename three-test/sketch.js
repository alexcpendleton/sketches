var scene = new THREE.Scene();
var innards = { w: 300, h: 300 };
var camera = new THREE.PerspectiveCamera(75, innards.w / innards.h, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
//renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(innards.w, innards.h);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
var geo = new THREE.EdgesGeometry(geometry);
var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 4 });
var wireframe = new THREE.LineSegments(geo, mat);
wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
cube.add(wireframe);
//scene.add(cube);

PrismGeometry = function(vertices, height) {
  var Shape = new THREE.Shape();

  (function f(ctx) {
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  })(Shape);

  var settings = {};
  settings.depth = height;
  settings.bevelEnabled = true;
  THREE.ExtrudeGeometry.call(this, Shape, settings);
};

PrismGeometry.prototype = Object.create(THREE.ExtrudeGeometry.prototype);

camera.position.z = 50;
var madeShapes = makeShapes(10);
function animate() {
  requestAnimationFrame(animate);
  madeShapes.forEach(i => {
    //i.rotation.x += 0.01;
    //i.rotation.y += 0.01;
  });
  renderer.render(scene, camera);
}

function makeShapes(howMany) {
  var results = [];
  for (let i = 0; i < howMany; i++) {
    var offset = {
      x: -10 + i,
      y: 0 + i
    };
    var A = new THREE.Vector2(0 + offset.x, 0 + offset.y);
    var B = new THREE.Vector2(2 + offset.x, 2 + offset.y);
    var C = new THREE.Vector2(3 + offset.x, 3 + offset.y);

    var height = 4;
    var prismGeometry = new PrismGeometry([A, B, C], height);
    //var geometry = new THREE.BoxGeometry(1, 1, 1);
    var prismMaterial = new THREE.LineBasicMaterial({
      color: Math.random() * 0xffffff
    });

    var prism1 = new THREE.Mesh(prismGeometry, prismMaterial);
    //prism1.rotation.x = -Math.PI;
    prism1.position.z = i * height;
    console.log(prism1);
    results.push(prism1);
    scene.add(prism1);
  }
  return results;
}
animate();
