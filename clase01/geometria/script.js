console.log(THREE)//mensaje a la consola


//escena
const scene = new THREE.Scene();//es el contendeor principal

//camara

const fov=75;
const aspectRatio = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    near,
    far
)
camera.position.z =2;



//renderer

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//geometria del cubo

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 0x00FFBF,//color del cubo
    wireframe: true//solo para ver las aristas del cubo
})
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.lookAt(cube.position);

//render
renderer.render(scene, camera);

function animate (){
    console.log('animando...')
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;//hace al cubo rotar sobre su eje
    renderer.render(scene,camera);
}
animate();