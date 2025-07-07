import * as THREE from 'three';

export function initSphereWithDot() {
  const container = document.getElementById('three-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Sphere
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshNormalMaterial({ wireframe: false });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  // Dot (small sphere)
  const dotGeometry = new THREE.SphereGeometry(0.05, 16, 16);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const dot = new THREE.Mesh(dotGeometry, dotMaterial);
  scene.add(dot);

  // Mouse movement
  function onMouseMove(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    const x = (event.clientX / width) * 2 - 1;
    const y = -(event.clientY / height) * 2 + 1;

    // Convert to spherical coordinates
    const phi = (1 - y) * Math.PI; // vertical
    const theta = (x + 1) * Math.PI; // horizontal

    // Place dot on sphere surface
    const radius = 1.01; // slightly above the sphere
    dot.position.x = radius * Math.sin(phi) * Math.cos(theta);
    dot.position.y = radius * Math.cos(phi);
    dot.position.z = radius * Math.sin(phi) * Math.sin(theta);
  }
  window.addEventListener('mousemove', onMouseMove);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}