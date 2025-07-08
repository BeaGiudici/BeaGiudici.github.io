document.querySelectorAll(".threejs-container").forEach(container => {

  const loader = new THREE.GLTFLoader();
  const meshes = {};
  const scene = container.scene

  // Show loading text initially
  const loadingText = container.querySelector('#loading-text');
  loadingText.style.display = 'block';  // Ensure the text is visible before loading starts

  // Function to load model
  function loadModel(modelFilename) {

    // Load model
    loader.load(modelFilename, function(gltf) {
      loadingText.style.display = 'none';  // Hide the loading text once the model is loaded
      const model = gltf.scene; // The loaded GLTF scene
      scene.add(model); // Add the model to the scene
      const elementSettings = {
        mesh0: {opacity: 0.8}, 
        mesh1: {opacity: 0.8}, 
        mesh2: {opacity: 0.8}, 
        mesh3: {opacity: 0.8}, 
        //mesh4: {opacity: 0.8},
      };

      model.traverse((node) => {
        //console.log("Node:", node.name);
        if (node.isMesh && elementSettings[node.name]) {
          // Store the mesh for toggling later
          meshes[node.name] = node;

          // Apply initial material settings
          node.material.transparent = false;
          node.material.opacity = elementSettings[node.name].opacity;
          node.material.needsUpdate = true;
          node.material.side = THREE.DoubleSide; // o DoubleSide se vuoi
          //node.material.depthWrite = false; // Prevent depth writing

          // Use alphaMap if applicable
          if (node.material.map) {
            node.material.alphaMap = node.material.map;
          }
        }
      });
      console.log("Model loaded successfully!");
      // Optionally, if model scale or position is off, adjust:
      gltf.scene.scale.set(1e-15, 1e-15, 1e-15);  // Optional: adjust size of the model
      gltf.scene.position.set(0, 0, 0);  // Optional: position of the model

      // Optional: Add a helper to view the bounding box of the model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      //console.log("Model size:", size); // Log model dimensions
    
    }, undefined, function(error) {
      console.error("Error loading the model:", error); // Handle errors
    });
  }

  loadModel(window.modelFile)

  // Add interactive legend
  // Add event listeners for toggle buttons
  for (let i = 0; i <= 3; i++) { // Loop from 0 to 4 for mesh0 to mesh3
    const meshName = `mesh${i}`;
    const toggleButton = container.querySelector(`#toggle_${meshName}`); // Fetch button by ID

    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        if (meshes[meshName]) {
          const mesh = meshes[meshName];

          // Toggle visibility
          mesh.visible = !mesh.visible;

          // Update the opacity of the legend toggle to indicate visibility
          if (!mesh.visible) {
            toggleButton.style.opacity = '0.5'; // Fade out when hidden
          } else {
            toggleButton.style.opacity = '1'; // Show full color when visible
          }

          console.log(`${meshName} visibility: ${mesh.visible}`);
        }
      });
    }
  }
});