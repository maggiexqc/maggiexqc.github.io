import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let object = null;
// Initialize Three.js scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setClearColor(0x000000, 0); // transparent
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);

// Position the camera
camera.position.z = 23;
camera.position.y = 0;
camera.lookAt(new THREE.Vector3(0, -3, 0));

// Create directional lights
var frontLight = new THREE.DirectionalLight(0xffffff, 0.5); 
frontLight.position.set(0, 0, 10); 
scene.add(frontLight);

var backLight = new THREE.DirectionalLight(0xffffff, 0.5); 
backLight.position.set(0, 0, -10); 
scene.add(backLight);

var leftLight = new THREE.DirectionalLight(0xffffff, 0.5);
leftLight.position.set(-10, 0, 0);
scene.add(leftLight);

var rightLight = new THREE.DirectionalLight(0xffffff, 0.5);
rightLight.position.set(10, 0, 0);
scene.add(rightLight);

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load file
loader.load(
  'img/iphone.glb',
  function (glb) {
    object = glb.scene; 
    scene.add(glb.scene);
    object.rotation.y = 4.71239; 
    glb.scene.scale.set(2.5, 2.5, 2.5);
  },
  function (xhr) {  // called while the model is loading
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error happened while loading the model.', error);
  }
);

// rotate the object manually
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false; // Disable zoom if not needed
controls.enablePan = false;  // Disable panning
controls.autoRotate = false; // Disable automatic orbiting
controls.enableRotate = true; // Ensure rotation is enabled
controls.minPolarAngle = Math.PI / 2; // object does not move vertically
controls.maxPolarAngle = Math.PI / 2; 

let maxRotation = Math.PI; 
let currentRotation = 0.0; 
let rotationSpeed = 0.05; 

// Bobbing animation
let bobSpeed = 0.03; 
let bobHeight = 1; 
let bobTime = 0; 

// Set up resizing for renderer and camera
function onWindowResize() {
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Render the scene again
  renderer.render(scene, camera);
}

// Add an event listener for window resize
window.addEventListener('resize', onWindowResize, false);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (object && currentRotation < maxRotation) {
        object.rotation.y -= rotationSpeed;
        currentRotation += rotationSpeed; 
    }
    if (object) {
        object.position.y = Math.sin(bobTime) * bobHeight;
        bobTime += bobSpeed;
    }

    renderer.render(scene, camera);
}
animate();

// Change page into home.html if user scrolls down or clicks on the page
document.addEventListener('DOMContentLoaded', function() {
  let lastScrollTop = 0;
  const threshold = 30; // Threshold for determining significant scroll

  // Scroll event for desktop users
  window.addEventListener('scroll', function() {
      let currentScroll = window.scrollY;

      // Check if user scrolled down
      if (currentScroll > lastScrollTop) {
          document.querySelector('.content').classList.add('slide-up');
          setTimeout(() => {
              window.location.href = 'home.html'; 
          }, 200); 
      }

      lastScrollTop = currentScroll;
  }, { passive: true });

  // Touch start event to detect initial touch point for mobile
  window.addEventListener('touchstart', function(event) {
      lastScrollTop = window.scrollY;
  });

  // Touch move event to detect scrolling on mobile
  window.addEventListener('touchmove', function(event) {
      let currentTouchY = event.touches[0].clientY;
      let deltaY = lastTouchY - currentTouchY;

      // Check if the user scrolls down significantly
      if (deltaY > threshold) {
          document.querySelector('.content').classList.add('slide-up');
          setTimeout(() => {
              window.location.href = 'home.html'; 
          }, 200);
      }

      lastTouchY = currentTouchY;
  }, { passive: true });
});
