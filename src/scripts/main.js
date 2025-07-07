// main.js
// Entry point and glue code for the website

// Example: import and initialize features
import './cursorTrail.js';
import './webgl.js';
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // second arg is alpha (0 = transparent)
document.body.appendChild( renderer.domElement );

const container = document.getElementById('three-container');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.display = 'block';  // remove default inline-block whitespace
container.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 10;

function animate() {
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );


// No need for DOMContentLoaded or window event listeners in React
