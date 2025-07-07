import GlslCanvas from 'glslCanvas';

// Trippy fragment shader (GLSL) with mouse interactivity and background image
const FRAGMENT_SHADER = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform sampler2D u_tex0;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;
    float t = u_time * 0.3;
    float mouseWave = 0.0;
    if (u_mouse.x > 0.0 || u_mouse.y > 0.0) {
        mouseWave = sin(uv.x * 10.0 * (u_mouse.x / u_resolution.x + 0.2) + t) * 0.5 * (u_mouse.y / u_resolution.y);
    }
    float wave = sin(uv.x * 3.0 + t) + cos(uv.y * 3.0 - t) + mouseWave;
    float r = 0.5 + 0.5 * sin(t + uv.x + wave);
    float g = 0.5 + 0.5 * sin(t + uv.y + wave);
    float b = 0.5 + 0.5 * sin(t + uv.x + uv.y + wave);
    vec3 effect = vec3(r, g, b);
    // Sample the background image
    vec2 imgUV = gl_FragCoord.xy / u_resolution.xy;
    vec3 bg = texture2D(u_tex0, imgUV).rgb;
    // Blend effect with background image
    float blend = 0.5 + 0.5 * sin(t + wave);
    vec3 color = mix(bg, effect, blend * 0.5 + 0.5);
    gl_FragColor = vec4(color, 1.0);
}
`;

export function mountShaderBackground() {
  // Only mount once
  if (document.getElementById('shader-bg-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'shader-bg-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '0'; // Above background image, below all content
  canvas.style.pointerEvents = 'none';
  canvas.style.display = 'block';
  canvas.style.background = 'transparent';
  canvas.setAttribute('data-textures', '/images/room.jpeg');
  document.body.appendChild(canvas);

  // Set canvas size to match window
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Attach glslCanvas
  const sandbox = new GlslCanvas(canvas);
  sandbox.load(FRAGMENT_SHADER);

  // Mouse tracking for u_mouse uniform
  function handleMouseMove(e) {
    // Get mouse position relative to the viewport
    let x = e.clientX;
    let y = window.innerHeight - e.clientY; // Flip Y for shader convention
    sandbox.setMouse({ x, y });
  }
  window.addEventListener('mousemove', handleMouseMove);
}
