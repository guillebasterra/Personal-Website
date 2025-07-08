// main.js
import './cursorTrail.js';
import './webgl.js';
import * as THREE from 'three';

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById('three-container').appendChild(renderer.domElement);

camera.position.z = 10;

// —————— SPHERE + WIREFRAME ——————
const radius        = 1;
const widthSegs     = 32;
const heightSegs    = 32;

// a solid green sphere
const sphereGeo     = new THREE.SphereGeometry(radius, widthSegs, heightSegs);
const sphereMat     = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sphere        = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

// a black wireframe on top
const wireGeo       = new THREE.WireframeGeometry(sphereGeo);
const wireMat       = new THREE.LineBasicMaterial({ color: 0x000000 });
const wireframe     = new THREE.LineSegments(wireGeo, wireMat);
scene.add(wireframe);

// —————— MOUSE TRACKING SETUP ——————
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', e => {
  mouse.x = ( e.clientX / window.innerWidth  ) * 2 - 1;
  mouse.y = -( e.clientY / window.innerHeight ) * 2 + 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// —————— ANIMATION LOOP ——————
function animate() {
  // 1) point in NDC at mid-depth:
  const ndcPos = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  
  // 2) unproject to world space:
  ndcPos.unproject(camera);
  
  // 3) compute direction from camera:
  const dir = ndcPos.sub(camera.position).normalize();
  
  // 4) find a target the same distance from camera as our sphere:
  const distance = camera.position.distanceTo(sphere.position);
  const target   = camera.position.clone().add(dir.multiplyScalar(distance));
  
  // 5) orient both sphere and its wireframe:
  sphere.lookAt(target);
  wireframe.lookAt(target);
  
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
