import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const loader = new GLTFLoader();


// CONFIGURACIÓN DE LA ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Niebla
scene.fog = new THREE.Fog(
    0x87ceeb,
    30,
    120
);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LUCES
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.0
);

scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(
    0xffffff,
    1.5
);

dirLight.position.set(
    20,
    30,
    10
);

scene.add(dirLight);

//EDIFICIOS
const edificios = [];
const modelosEdificios = [];

const rutasEdificios = [
    '/models/building-c.glb',
    '/models/building-o.glb',
    '/models/building-q.glb',
    '/models/building-p.glb'
];

rutasEdificios.forEach((ruta) => {

    loader.load(

        ruta,

        (gltf) => {

            modelosEdificios.push(
                gltf.scene
            );

            console.log(
                'Edificio cargado:',
                ruta
            );

            if (
                modelosEdificios.length ===
                rutasEdificios.length
            ) {

                crearCiudad();

            }

        },

        undefined,

        (error) => {

            console.error(
                error
            );

        }

    );
    

});

function crearCiudad() {

     if (modelosEdificios.length === 0) return;

    for (let i = 0; i < 50; i++)
    
    {

        const modeloBase =
            modelosEdificios[
                Math.floor(
                    Math.random() *
                    modelosEdificios.length
                )
            ];

        const edificio =
            modeloBase.clone(true);

        edificio.scale.set(
            5,
            8,
            7
        );

        edificio.position.set(

        Math.random() > 0.5
        ? -12 - Math.random() * 4
        : 12 + Math.random() * 4,

        -1,

        -i * 25

        );

        scene.add(
            edificio
        );

        edificios.push(
            edificio
        );

    }

}



// VARIABLES
let buenas = 0;
let malas = 0;
let velocidadObstaculo = 0.15;
const buenasTxt = document.getElementById('buenas-txt');
const malasTxt = document.getElementById('malas-txt');



// SUELO
const textureLoader = new THREE.TextureLoader();

const texturaSuelo = textureLoader.load('/models/carretera.jpg');

texturaSuelo.wrapS = THREE.RepeatWrapping;
texturaSuelo.wrapT = THREE.RepeatWrapping;

// Cuántas veces se repite la textura
texturaSuelo.repeat.set(4, 20);

const sueloGeo = new THREE.PlaneGeometry(10, 200);

const sueloMat = new THREE.MeshStandardMaterial({
    map: texturaSuelo
});

const suelo = new THREE.Mesh(sueloGeo, sueloMat);

suelo.rotation.x = -Math.PI / 2;
suelo.position.y = 0;

scene.add(suelo);

// BANQUETA IZQUIERDA

const banquetaGeo = new THREE.BoxGeometry(
    20,   // ancho
    -4,  // altura
    2000  // largo
);

const banquetaMat =
    new THREE.MeshStandardMaterial({
        color: 0x4c8c4a
    });

const banquetaIzquierda =
    new THREE.Mesh(
        banquetaGeo,
        banquetaMat
    );

banquetaIzquierda.position.set(
    -12,
    -0.25,
    -500
);

scene.add(
    banquetaIzquierda
);

// BANQUETA DERECHA

const banquetaDerecha =
    banquetaIzquierda.clone();

banquetaDerecha.position.x = 12;

scene.add(
    banquetaDerecha
);

/* const sueloGeo = new THREE.PlaneGeometry(10, 50);
const sueloMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const suelo = new THREE.Mesh(sueloGeo, sueloMat);
suelo.rotation.x = -Math.PI / 2;
scene.add(suelo);
 */
// JUGADOR
let jugador;

loader.load(
     '/models/delivery.glb',
     

    (gltf) => {

        jugador = gltf.scene;

        // Posición inicial
        jugador.position.set(0, 0, 5);

        // Tamaño del modelo
        jugador.scale.set(1, 1, 1);

        // Rotación opcional
        jugador.rotation.y = Math.PI;

        scene.add(jugador);

        console.log('Jugador cargado');
    },
    undefined,
    (error) => {
        console.error('Error cargando jugador:', error);
    }
);


// OBSTÁCULOS
const modelosObstaculos = [];
let obstaculo;

const rutasObstaculos = [
    './models/tractor-police.glb',
    './models/truck.glb',
    './models/tractor-shovel.glb',
    './models/van.glb',
    './models/truck-flat.glb'
];

const totalModelos = rutasObstaculos.length;

rutasObstaculos.forEach((ruta) => {

    loader.load(
        ruta,

        (gltf) => {

            modelosObstaculos.push(gltf.scene);

            console.log(`Modelo cargado`);

            // Cuando todos los modelos estén listos,
            // crear el primer obstáculo
            if (
                modelosObstaculos.length === totalModelos &&
                !obstaculo
            ) {
                reiniciarObstaculo();
            }
        },

        undefined,

        (error) => {
            console.error(`Error cargando obstaculo `, error);
        }
    );

});

function reiniciarObstaculo() {

    // Si todavía no hay modelos cargados
    if (modelosObstaculos.length === 0) return;

    // Eliminar obstáculo anterior
    if (obstaculo) {
        scene.remove(obstaculo);
    }

    // Elegir modelo aleatorio
    const indice =
        Math.floor(Math.random() * modelosObstaculos.length);

    const modeloAleatorio =
        modelosObstaculos[indice];

    // Crear copia
    obstaculo = modeloAleatorio.clone(true);

    // Posición
    obstaculo.position.set(
        (Math.random() - 0.5) * 6,
        0,
        -20
    );

    // Escala
    obstaculo.scale.set(1, 1, 1);

    scene.add(obstaculo);
}

/* const obstaculoGeo = new THREE.SphereGeometry(0.5, 16, 16);
const obstaculoMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
const obstaculo = new THREE.Mesh(obstaculoGeo, obstaculoMat); */

/* function reiniciarObstaculo() {
obstaculo.position.z = -20;
obstaculo.position.x = (Math.random() - 0.5) * 6;
obstaculo.position.y = 0.5;
}
reiniciarObstaculo();
scene.add(obstaculo); */

// CONTROLES
const teclas = { Left: false, Right: false };

window.addEventListener('keydown', (e) => {
if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') teclas.Left = true;
if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') teclas.Right = true;
});

window.addEventListener('keyup', (e) => {
if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') teclas.Left = false;
if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') teclas.Right = false;
});

function animate() {
 requestAnimationFrame(animate);

if (!jugador || !obstaculo) {
        renderer.render(scene, camera);
        return;
    }

  // Mover textura del suelo
    texturaSuelo.offset.y+= 0.02;

if (teclas.Left && jugador.position.x > -3) jugador.position.x -= 0.1;
if (teclas.Right && jugador.position.x < 3) jugador.position.x += 0.1;

obstaculo.position.z += velocidadObstaculo;

if (obstaculo.position.z > jugador.position.z + 2) {
    buenas++;

    velocidadObstaculo += 0.005;

    if (buenasTxt) buenasTxt.innerText = buenas;
    reiniciarObstaculo();
}




// Colisión
const distancia = jugador.position.distanceTo(obstaculo.position);
if (distancia < 1.0) {
malas++;
if(malasTxt) malasTxt.innerText = malas;
reiniciarObstaculo();
}

if(malas >= 10){
    alert("Game Over");
    location.reload();
}

// Esquivado
if (obstaculo.position.z > jugador.position.z + 2) {
buenas++;
if(buenasTxt) buenasTxt.innerText = buenas;
reiniciarObstaculo();
}

edificios.forEach((edificio) => {

    edificio.position.z += velocidadObstaculo;

    if (edificio.position.z > 30) {

        edificio.position.z = -1000;

        edificio.position.x =
            Math.random() > 0.5
                ? -20 - Math.random() * 10
                : 20 + Math.random() * 10;
    }

});

renderer.render(scene, camera);
}

animate();