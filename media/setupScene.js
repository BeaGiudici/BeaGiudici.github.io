document.querySelectorAll(".threejs-container").forEach(container => {
  // Get the correct canvas
  const canvas = container.querySelector("#threejs-canvas")

  // Set up basic Three.js Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // Ensure renderer is inside the canvas
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  canvas.appendChild(renderer.domElement);

  // Scene background color
  scene.background = new THREE.Color(0xf1f1f1); // Set background to creme

  // Store scene, camera, and renderer inside the container element
  container.scene = scene;
  container.camera = camera;
  container.renderer = renderer;

  // Get the button elements by ID
  const blackBtn = container.querySelector('#blackb');
  const whiteBtn = container.querySelector('#whiteb');
  const labelContainer = container.querySelector('#slider-labels')

  // Set the background color of the scene
  if (blackBtn && whiteBtn) {
    console.log('getting buttons');
    blackBtn.addEventListener('click', () => {
        scene.background = new THREE.Color(0x333333);
        const labels = labelContainer.querySelectorAll("span");
        labels.forEach(label => {
          label.style.color = 0xf1f1f1
        });
    });

    whiteBtn.addEventListener('click', () => {
        scene.background = new THREE.Color(0xf1f1f1);
        const labels = labelContainer.querySelectorAll("span");
        labels.forEach(label => {
          label.style.color = 0x333333
        });
    });
  }

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
  camera.position.set(-21,-21,-21)

  // Initialize OrbitControls (allows for dragging, rotating, and zooming)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  controls.enableZoom = true;
  controls.enablePan = true;

  // Allow full 360-degree rotation
  controls.minPolarAngle = -Infinity;  
  controls.maxPolarAngle = Infinity;  
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;
  controls.enableDamping = true; // Smooth movement
  controls.dampingFactor = 0.05;

  // Ensure controls update on animation loop
  function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
  }
  animate();

  // Handle window resizing (maintain rendering size on resize)
  window.addEventListener('resize', () => {
    const width = container.querySelector("#threejs-canvas").clientWidth;
    const height = container.querySelector("#threejs-canvas").clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
});