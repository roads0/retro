var camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var scene2 = new THREE.Scene();

var renderer2 = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
renderer2.autoClear = false;
renderer2.clear();
renderer2.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.tri').appendChild(renderer2.domElement);

window.addEventListener('resize', function () {
  camera2.aspect = window.innerWidth / window.innerHeight;
  camera2.updateProjectionMatrix();
  renderer2.setSize(window.innerWidth, window.innerHeight);
})

camera2.position.y = 1;
camera2.position.z = 5;

/* OBJECTS */

var rad_cone = new THREE.ConeGeometry(5, Number.MIN_VALUE, 3, 2);
var wire_cone = new THREE.WireframeGeometry(rad_cone);

var cone_mat = new THREE.LineBasicMaterial( {
  color: COLORSECONDARY,
  linewidth: 3,
  linecap: 'round', //ignored by WebGLrenderer2
  linejoin:  'round' //ignored by WebGLrenderer2
} );

var cone = new THREE.LineSegments(wire_cone, cone_mat);

cone.position.x = 0
cone.position.y = 8
cone.position.z = -12

scene2.add(cone);

var ii = 0
var trails = false

var animate2 = function() {
  ii++
  requestAnimationFrame(animate2);

  cone.rotation.x += 0.01;
  cone.rotation.y += 0.02;
  if(trails) {
    renderer2.autoClear = false
    if(ii%64==0) {
      renderer2.clear();
    }
    if(ii%16==0) {
      renderer2.render(scene2, camera2);
    }
  } else {
    renderer2.autoClear = true;
    renderer2.render(scene2, camera2);
  }
};

animate2();
