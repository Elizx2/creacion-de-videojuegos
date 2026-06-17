console.log('THREE')

//escena
const scene = new THREE.Scene();//es el contendeor principal

//camara

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innderHeight,
    0.1,
    100
);
camera.position.set(3,3,5);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innderHeight);
renderer.shadowMap.enabled = true; //pon las sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap;//suavisa las sombras
document.body.appendChild(renderer.domElement);

