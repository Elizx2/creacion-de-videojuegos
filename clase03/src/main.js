//
//importar modelo 3d

import './style.css';
import * as THREE from 'three';
// ¡IMPORTANTE! Importamos el cargador de modelos GLTF
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 1. ESCENA
const scene = new THREE.Scene();

// 2. CÁMARA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Elevamos un poco la cámara para ver mejor el modelo

// 3. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// RELOJ PARA EL DELTA TIME
const clock = new THREE.Clock();

// Variable global para guardar nuestro modelo una vez que cargue
let miModelo3D = null;

// ==========================================
// 4. CARGADOR DE MODELOS 3D (GLTF / GLB)
// ==========================================
const loader = new GLTFLoader();

// Cargamos el archivo (deben cambiar esta ruta por la de su modelo)
loader.load(
    '/models/animal-bunny.glb',
    (gltf) => {
        // Esta función se ejecuta cuando el modelo termina de cargarse con éxito
        miModelo3D = gltf.scene;
       
        // Opcional: Escalar el modelo si viene muy grande o muy chico del programa 3D
        miModelo3D.scale.set(1, 1, 1);
       
        // Añadimos el modelo a nuestra escena de Three.js
        scene.add(miModelo3D);
        console.log("¡Modelo 3D cargado con éxito!");
        animate();
    },
    (xhr) => {
        // Opcional: Esto muestra el progreso de la descarga en la consola
        console.log((xhr.loaded / xhr.total * 100) + '% cargado');
    },
    (error) => {
        // Esto nos avisa si hay un error con la ruta o el archivo
        console.error('Hubo un error al cargar el modelo:', error);
    }

);

// LUCES (Los modelos importados necesitan buena luz para que se aprecien sus texturas)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Diccionario para registrar qué teclas están presionadas
const keys = {

w: false,
a: false,
s: false,
d: false,
shift: false

};

// 5. BUCLE DE ANIMACIÓN (Game Loop)



function animate() {
requestAnimationFrame(animate);
console.log(miModelo3D.position.x);

// 1. CALCULAR VELOCIDAD (Si presiona Shift, corre al doble de velocidad)
let currentSpeed = 0.05;
if (keys.shift) {
currentSpeed = 0.12; // Velocidad de Sprint
}

// --- MECÁNICA DE MOVIMIENTO ---

if (keys.w) miModelo3D.position.z += currentSpeed; // Arriba
if (keys.s) miModelo3D.position.z -= currentSpeed; // Abajo
if (keys.a) miModelo3D.position.x -= currentSpeed; // Izquierda
if (keys.d) miModelo3D.position.x += currentSpeed; // Derecha

// --- LIMITAR LA POSICIÓN (Lógica de colisión con el borde) ---
// Límite Derecha (X positivo)
if (miModelo3D.position.x > 5) {
miModelo3D.position.x = 5;
}
// Límite Izquierda (X negativo)
else if (miModelo3D.position.x < -5) {
miModelo3D.position.x = -5;
}

// Límite Arriba (Y positivo)
if (miModelo3D.position.y > 3) {
miModelo3D.position.y = 3;
}
// Límite Abajo (Y negativo)
else if (miModelo3D.position.y < -3) {
miModelo3D.position.y = -3;
}

// Mantener una leve rotación para que se siga viendo en 3D
if (keys.a )miModelo3D.rotation.x += 0.005;
if (keys.d) miModelo3D.rotation.y += 0.005;


 miModelo3D.rotation.y += 0.05 * currentSpeed;

renderer.render(scene, camera);
}



// 6. AJUSTE DE PANTALLA (Hacer el juego responsivo)
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});

// Detectar cuando se presiona la tecla
window.addEventListener('keydown', (event) => {
let key = event.key.toLowerCase();

// Si presionaron cualquier Shift, lo normalizamos a 'shift'
if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = true;
}
});

window.addEventListener('keyup', (event) => {
let key = event.key.toLowerCase();

if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = false;
}
});