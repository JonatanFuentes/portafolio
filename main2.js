import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function initModel(containerId, modelPath) {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Crear la escena, la cámara y el renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000); // Ajusta el FOV
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Crear y agregar luces
    const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
    spotLight.position.set(25, 25, 25);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);

    // Crear y agregar el suelo
 // Crear y agregar el suelo circular
 const radius = 2; // Radio del suelo circular
 const groundGeometry = new THREE.CircleGeometry(radius, 25); // 32 segmentos para un suelo más suave
 const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
 const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
 groundMesh.rotation.x = -Math.PI / 2; // lados
 groundMesh.position.y = -1.3; // arriba abajo

 scene.add(groundMesh);

    // Configurar controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.minDistance = 2;  // Ajusta según el tamaño de tu modelo
    controls.maxDistance = 10; // Ajusta según el tamaño de tu modelo
    controls.minPolarAngle = 0; // Ángulo mínimo para rotar hacia abajo
    controls.maxPolarAngle = Math.PI / 2; // Ángulo máximo para rotar hacia arriba
    controls.autoRotate = false;
    controls.target.set(0, 1, 0);
    controls.update();

    // Cargar el modelo
    const loader = new GLTFLoader().setPath('millennium_falcon/');
    loader.load(modelPath, (gltf) => {
        console.log('loading model');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = false; // Desactivar la recepción de sombras
            }
        });

        mesh.position.set(6.8, -1.5, -3);
        mesh.scale.set(25, 25, 25); // Ajusta la escala del modelo si es necesario
        scene.add(mesh);

        // Ajustar la cámara para que el modelo sea visible
        const boundingBox = new THREE.Box3().setFromObject(mesh);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        camera.position.copy(center).add(new THREE.Vector3(5, 1, 6));
        camera.lookAt(center);

        animate();
    }, (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    }, (error) => {
        console.error(error);
    });

    // Animación
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Actualiza los controles en cada frame
        renderer.render(scene, camera);
    }

    // Ajustar el tamaño del renderer al tamaño del contenedor
    function resizeRenderer() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resizeRenderer);
}

window.addEventListener('load', () => {
    initModel('model2', 'py.glb');
});
