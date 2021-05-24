import * as THREE from 'three';
//import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
let renderer;

//const controls = new OrbitControls( camera, renderer.domElement ); //  !  without THREE.

const clock  = new THREE.Clock( true );	
let time;	// for animate

let light = new THREE.PointLight(0xffffff);
light.position.set(10, 5, 0);
scene.add(light);

let light2 = new THREE.PointLight(0xffffff);
light2.position.set(-10, 5, 0);
scene.add(light2);

let light3 = new THREE.PointLight(0xffffff);
light3.position.set(10, 50, 10);
scene.add(light3);

let spot = new THREE.PointLight(0xffffff);
light.position.set(0, 0, 10);
spot.intensity = 0.5;
scene.add(spot);

const lightAmb = new THREE.AmbientLight(0xffffff);
lightAmb.intensity = 1;
scene.add(lightAmb);

const coin = new THREE.Object3D();

const mtlLoader = new MTLLoader( );  //  !  without THREE.

const textureLoader = new THREE.TextureLoader();

var textureEquirec = textureLoader.load('assets/parched_canal.png');
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
textureEquirec.encoding = THREE.sRGBEncoding;
scene.background = textureEquirec;


var goldmaterial = new THREE.MeshStandardMaterial({
	color: 0xFFCE5B,
	envMap: textureEquirec,
	metalness: 0.96,
	roughness: 0.2,
	flatShading: false
});
var facematerial = new THREE.MeshPhongMaterial({
	map: new THREE.TextureLoader().load('assets/models/hallacoin50000.png'),
	normalMap: new THREE.TextureLoader().load('assets/models/Normal.png'),
	envMap: new THREE.TextureLoader().load('assets/parched_canal.png'),
	shininess: 100,
	reflectivity: 0.5,
	flatShading: false
});
var sidematerial = new THREE.MeshPhongMaterial({
	color: 0xD0B727,
	normalMap: new THREE.TextureLoader().load('assets/models/Normal.png'),
	envMap: new THREE.TextureLoader().load('assets/models/hallacoin50000.png'),
	shininess: 100,
	reflectivity: 0.1,
	flatShading: false
});

mtlLoader.load(
 'assets/models/hallacoin_aarni.mtl',

  function (materials) {
	materials.preload();
	const loader = new GLTFLoader();
	//loader.setMaterials( materials );
	loader.load(

	 'assets/models/hallacoin_aarni.glb',
		// called when resource is loaded
		function ( gltf ) {
			//scene.add( gltf.scene );
			const mesh = gltf.scene.children[ 0 ];
			mesh.material = goldmaterial;
			coin.add(mesh);
			//scene.add( mesh );
		},
		// called when loading is in progresses
		function ( xhr ) {

			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		},
		// called when loading has errors
		function ( error ) {

			console.log( 'An error happened: ', error);

		}
	);
 }
);

scene.add(coin);
console.log(coin);

camera.position.z = 5;

const animate = () => {
  requestAnimationFrame(animate);
//  cube.rotation.x += 0.01;
//  cube.rotation.y += 0.01;
  coin.rotation.y -= 0.01;
  renderer.render(scene, camera);
};

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  resizeCanvasToDisplaySize();
};

export const createScene = (el) => {
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el, alpha: true });
  resize();
  animate();
}
function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // update any render target sizes here
  }
}
window.addEventListener('resize', resize);
console.log(scene);
