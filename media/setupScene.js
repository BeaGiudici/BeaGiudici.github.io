// Get the correct container
const container = document.getElementById("threejs-canvas");

// Set up basic Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Ensure renderer is inside the container
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Scene background color
scene.background = new THREE.Color(0xf1f1f1); // Set background to black

// Get the button elements by ID
const blackBtn = document.getElementById('blackb');
const whiteBtn = document.getElementById('whiteb');

// Set the background color of the scene
blackBtn.addEventListener('click', () => {
  scene.background = new THREE.Color(0x333333);
});

whiteBtn.addEventListener('click', () => {
  scene.background = new THREE.Color(0xf1f1f1);
});

// Add ambient light and a directional light to illuminate the scene
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft ambient light
ambientLight.intensity = 0.75; // Increase brightness
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);  // Strong directional light (like sunlight)
directionalLight.position.set(1,1,1).normalize();
directionalLight.intensity = 0.85; // Increase brightness
scene.add(directionalLight);

// add second directoinal light from opposite direction
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight2.position.set(-1, -1, -1).normalize();
directionalLight2.intensity = 0.85; // Increase brightness
scene.add(directionalLight2);

// add a hemisphere light (simulates sky-ground lighting)
//const hemiLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1.5);
//scene.add(hemiLight);

// Adjust camera position
camera.position.z = -25;

// Initialize OrbitControls (allows for dragging, rotating, and zooming)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Enable smoother controls
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false; // Set this to 'false' if you want to disable panning
  // controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

// Create an animation loop to render the scene and update it every frame
function animate() {
    requestAnimationFrame(animate);
     controls.update(); 
  renderer.render(scene, camera);
}

animate();

// Handle window resizing (maintain rendering size on resize)
window.addEventListener('resize', () => {
  const width = document.getElementById('threejs-canvas').clientWidth;
  const height = document.getElementById('threejs-canvas').clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});