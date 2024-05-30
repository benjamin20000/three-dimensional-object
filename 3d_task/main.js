import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


function initCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 150, 400);
    return camera;
}


function initLight(scene) {
    // light from right side
    const right_light = new THREE.DirectionalLight(0xffffff, 1); 
    right_light.position.set(200, 0, 0);
    right_light.castShadow = true;
    scene.add(right_light);

    // light from left side
    const left_light = new THREE.DirectionalLight(0xffffff, 1); 
    left_light.position.set(-200, 0, 0);
    left_light.castShadow = true;
    scene.add(left_light);

    // light from top
    const top_light = new THREE.DirectionalLight(0xffffff, 1); 
    top_light.position.set(0, 200, 0);
    top_light.castShadow = true;
    scene.add(top_light);

    // light from down
    const bottom_light = new THREE.DirectionalLight(0xffffff, 1); 
    bottom_light.position.set(0, -200, 0);
    bottom_light.castShadow = true;
    scene.add(bottom_light);
}


function initRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
}


function initControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    return controls;
}


function loadModel(scene) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(
        'models/Humvee.mtl',
        (materials) => {
            materials.preload();

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(
                'models/Humvee.obj',
                (object) => {
                    scene.add(object);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                },
                (error) => {
                    console.log('An error happened');
                }
            );
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log('An error happened');
        }
    );
}


function onWindowResize(camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render(renderer, scene, camera);
}


function render(renderer, scene, camera) {
    renderer.render(scene, camera);
}


function animate(renderer, scene, camera, controls) {
    requestAnimationFrame(() => animate(renderer, scene, camera, controls));
    controls.update();
    render(renderer, scene, camera);
}


function main() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(100,250,0);
    const camera = initCamera();
    const renderer = initRenderer();
    const controls = initControls(camera, renderer);

    initLight(scene);
    loadModel(scene);

    window.addEventListener('resize', () => onWindowResize(camera, renderer), false);
    animate(renderer, scene, camera, controls);
}

main();
