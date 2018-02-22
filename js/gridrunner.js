var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.toneMapping = THREE.LinearToneMapping;
renderer.setClearColor(0x000000,0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.grid').appendChild(renderer.domElement);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

/* BLOOM */

var bloomStrength = 0.7;
var bloomRadius = 1;
var bloomThreshold = 0.2;

composer = new THREE.EffectComposer( renderer );
renderScene = new THREE.RenderPass(scene, camera, undefined, undefined, 1);

var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );

var copyShader = new THREE.ShaderPass(THREE.CopyShader);
copyShader.renderToScreen = true;

var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), bloomStrength, bloomRadius, bloomThreshold);

composer = new THREE.EffectComposer(renderer);

composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(effectFXAA);
composer.addPass(effectFXAA);

composer.addPass(bloomPass);
composer.addPass(copyShader);

/* GRID LOGIC */

var SIZE = 128

var grids = [create_grid(0, 0xff00ff), create_grid(1, 0xff00ff)]

camera.position.y = 1;
camera.position.z = 5;

camera.updateMatrix();
camera.updateMatrixWorld();
var frustum = new THREE.Frustum();
frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));



i = 0
var animate = function() {
  i++
  requestAnimationFrame(animate);

  grids.forEach((grid, index) => {
    if(grid) {
      grid.position.z = (grid.position.z + 0.05)

      if (!frustum.intersectsObject(grid)){
        grids.push(create_grid(index+3, 0xff00ff))
        scene.remove(grid)
        grids[index] = null
      };
    }

  });

  // renderer.render(scene, camera);
  renderer.clear();
  composer.render();
};

function create_grid(index, color) {
  var grid_template = new THREE.GridHelper(SIZE, SIZE, color, color);

  grid_template.position.z = (grids ? grids[grids.length-1].position.z - SIZE : -(SIZE * (index)))

  scene.add(grid_template)

  return grid_template
}

animate();
