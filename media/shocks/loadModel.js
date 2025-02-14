const loader = new THREE.GLTFLoader();
const meshes = {};
let currentModel = null;  // Store currently loaded model

const timeSteps = [
    "w12_5_sb1.gltf",
    "w12_5_sb2.gltf",
];

const slider = document.getElementById("timeSlider");
slider.max = timeSteps.length - 1;

// Function to load model
function loadModel(index) {
    const modelFilename = timeSteps[index];

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
        currentModel = gltf.scene;
        scene.add(currentModel);
        console.log(`Loaded ${modelFilename}`);

        // Scale and position adjustments
        currentModel.scale.set(1.9e-13, 1.9e-13, 1.9e-13);
        currentModel.position.set(0, 0, 0);

        // Handle mesh properties
        currentModel.traverse((node) => {
            if (node.isMesh) {
                meshes[node.name] = node;
                node.material.transparent = true;
                node.material.opacity = node.name === "mesh0" ? 1.0 : 0.3;
                node.material.depthWrite = false; // Fix transparency issues
                node.material.needsUpdate = true;
            }
        });
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
