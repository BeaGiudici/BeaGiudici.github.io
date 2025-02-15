const loader = new THREE.GLTFLoader();
const meshes = {};
let currentModel = null;  // Store currently loaded model
let meshVisibility = {};  // 🔹 Store mesh visibility states across model changes

const slider = document.getElementById("timeSlider");
slider.max = window.timeSteps.length - 1;

// Show loading text initially
const loadingText = document.getElementById('loading-text');
loadingText.style.display = 'block';  // Ensure the text is visible before loading starts

// Function to load model
function loadModel(index) {
    if (!window.timeSteps || index >= window.timeSteps.length) {
        console.error("Invalid timeSteps array or index out of range.");
        return;
    }

    const modelFilename = window.timeSteps[index];

    if (currentModel) {
        currentModel.traverse((node) => {
            if (node.isMesh) {
                meshVisibility[node.name] = node.visible; // Save visibility state
            }
        });
    }

    // Remove old model
    if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse((node) => {
            if (node.isMesh) {
                node.geometry.dispose();
                node.material.dispose();
            }
        });
    }

    // Load new model
    loader.load(modelFilename, function (gltf) {
        loadingText.style.display = 'none'; 
        currentModel = gltf.scene;
        scene.add(currentModel);
        console.log(`Loaded ${modelFilename}`);

        const elementSettings = {
            mesh0: {opacity: 1.0, transparent: false, depthWrite: true}, 
          mesh1: {opacity: 0.3, transparent: true, depthWrite: false}, 
          mesh2: {opacity: 0.4, transparent: true, depthWrite: false}, 
        };

        // Scale and position adjustments
        currentModel.scale.set(1.9e-13, 1.9e-13, 1.9e-13);
        currentModel.position.set(0, 0, 0);

        // Handle mesh properties
        currentModel.traverse((node) => {
            //console.log("Node:", node.name);
      if (node.isMesh && elementSettings[node.name]) {
        // Store the mesh for toggling later
        meshes[node.name] = node;

        // Apply initial material settings
        node.material.transparent = elementSettings[node.name].transparent;
        node.material.opacity = elementSettings[node.name].opacity;
        node.material.needsUpdate = true;
        node.material.depthWrite = elementSettings[node.name].depthWrite; // Prevent depth writing for shocks

        // Use alphaMap if applicable
        if (node.material.map) {
          node.material.alphaMap = node.material.map;
        }
        node.visible = meshVisibility[node.name] !== undefined ? meshVisibility[node.name] : true;
      }
        });
        // Update button status to reflect the previous one
        updateButtonStyles();
    }, undefined, function (error) {
        console.error("Error loading model:", error);
    });
}

// Load the first model initially
loadModel(0);

// Update model when slider changes
slider.addEventListener("input", (event) => {
    const index = parseInt(event.target.value);
    loadModel(index);
});

// Add interactive legend
// Add event listeners for toggle buttons
for (let i = 1; i <= 2; i++) { // Loop from 1 to 2 for mesh1 and mesh2
const meshName = `mesh${i}`;
const toggleButton = document.getElementById(`toggle_${meshName}`); // Fetch button by ID

    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
        if (meshes[meshName]) {
            const mesh = meshes[meshName];

            // Toggle visibility
            mesh.visible = !mesh.visible;
            meshVisibility[meshName] = mesh.visible; // Save state
            updateButtonStyles();
            console.log(`${meshName} visibility: ${mesh.visible}`);
        }
        });
    }
}

function updateButtonStyles() {
    for (let i = 1; i <= 2; i++) {
        const meshName = `mesh${i}`;
        const toggleButton = document.getElementById(`toggle_${meshName}`);
        if (toggleButton && meshVisibility[meshName] !== undefined) {
            toggleButton.style.opacity = meshVisibility[meshName] ? "1" : "0.5";
        }
    }
}