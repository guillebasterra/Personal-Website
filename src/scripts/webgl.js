import * as THREE from 'three';

// ———— SETUP ————
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-container').appendChild(renderer.domElement);

camera.position.z = 5;


// ———— GEOMETRY & UNIFORMS ————
// Build a “rod” for each vertex normal of a subdivided icosahedron
const baseGeo    = new THREE.IcosahedronGeometry(1, 32);
const N          = baseGeo.attributes.position.count;

const positions  = new Float32Array(N * 2 * 3);
const normalsArr = new Float32Array(N * 2 * 3);
const offsets    = new Float32Array(N * 2);

for (let i = 0; i < N; i++) {
  // get the base normal (unit-length)
  const nx = baseGeo.attributes.normal.getX(i);
  const ny = baseGeo.attributes.normal.getY(i);
  const nz = baseGeo.attributes.normal.getZ(i);

  // write it twice in the positions array
  positions[6*i + 0] = nx;
  positions[6*i + 1] = ny;
  positions[6*i + 2] = nz;
  positions[6*i + 3] = nx;
  positions[6*i + 4] = ny;
  positions[6*i + 5] = nz;

  // also twice in the normals array
  normalsArr[6*i + 0] = nx;
  normalsArr[6*i + 1] = ny;
  normalsArr[6*i + 2] = nz;
  normalsArr[6*i + 3] = nx;
  normalsArr[6*i + 4] = ny;
  normalsArr[6*i + 5] = nz;

  // first vertex = base of rod, second = tip of rod
  offsets[2*i + 0] = 0.2;
  offsets[2*i + 1] = 0.5;
}

const rodsGeo = new THREE.BufferGeometry();
rodsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
rodsGeo.setAttribute('normal',   new THREE.BufferAttribute(normalsArr, 3));
rodsGeo.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 1));

// uniforms for time / mouse / noise
const uniforms = {
  uTime:          { value: 0.0 },
  uMouseDir:      { value: new THREE.Vector3() },
  uNoiseFreq:     { value: 1.0 },
  uMouseStrength: { value: 0.5 }
};

// ———— SHADERS ————
const vertexShader = `
// Ashima’s 3D Perlin noise (pnoise) implementation
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float pnoise(vec3 P, vec3 rep){
  vec3 Pi0 = mod(floor(P),rep), Pi1 = mod(Pi0+1.0,rep);
  Pi0 = mod289(Pi0); Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P), Pf1 = Pf0 - 1.0;
  vec4 ix = vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy = vec4(Pi0.y,Pi0.y,Pi1.y,Pi1.y);
  vec4 iz0 = vec4(Pi0.z), iz1 = vec4(Pi1.z);
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0*(1.0/7.0), gy0 = fract(floor(gx0)*(1.0/7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0)-0.5);
  gy0 -= sz0 * (step(0.0, gy0)-0.5);
  vec4 gx1 = ixy1*(1.0/7.0), gy1 = fract(floor(gx1)*(1.0/7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1)-0.5);
  gy1 -= sz1 * (step(0.0, gy1)-0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x), g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z), g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x), g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z), g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),
                                   dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),
                                   dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.y,Pf0.z));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.x,Pf1.y,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.x,Pf0.y,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.y,Pf1.z));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = Pf0*Pf0*Pf0*(Pf0*(Pf0*6.0-15.0)+10.0);
  vec4 n_z  = mix(vec4(n000,n100,n010,n110), vec4(n001,n101,n011,n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

uniform float uTime;
uniform vec3  uMouseDir;
uniform float uNoiseFreq;
uniform float uMouseStrength;

attribute float aOffset;
varying vec3 vNormal;

float turbulence(vec3 p){
  float t = 0.0, f = 1.0;
  for(int i = 0; i < 5; i++){
    t += abs(pnoise(p * f + uTime, vec3(10.0)) / f);
    f *= 2.0;
  }
  return t;
}

void main(){
  // preserve the normal for lighting
  vNormal = normal;

  // compute the noise value
  float low   = pnoise(position * uNoiseFreq + uTime * 0.5, vec3(10.0));
  float high  = turbulence(position * uNoiseFreq * 2.0);
  float baseN = low + high;

  // how aligned this rod is with the mouse direction
  float pull  = max(dot(normal, uMouseDir), 0.0) * uMouseStrength;

  // only grow in the mouse direction: noise * pull
  float disp  = baseN * pull;

  // build a rod by scaling the normal by base radius + disp * offset
  float baseR = 1.0;
  float r     = baseR + disp * aOffset;
  vec3 newPos = normal * r;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`;

const fragmentShader = `
varying vec3 vNormal;
void main(){
  float light = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
  gl_FragColor = vec4(vec3(1.0), 1.0);
}
`;

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
});

// build & add the ink‐rod line segments
const rods = new THREE.LineSegments(rodsGeo, material);
scene.add(rods);
rods.scale.set(2, 2, 2);

// ———— MOUSE TRACKING ————
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ———— ANIMATION LOOP ————
function animate(){
  // project mouse into world‐space direction
  const ndc = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  ndc.unproject(camera);
  const dir = ndc.sub(camera.position).normalize();
  uniforms.uMouseDir.value.copy(dir);

  // update time
  uniforms.uTime.value = performance.now() * 0.0008;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
