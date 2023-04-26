/* IMPORTS */

// Three.js for starting the 3d canvas view
// Built by mrdoob, at https://www.npmjs.com/package/three
import * as THREE from 'three';
// For loading GLTF files (for displaying)
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';
// For loading EXR files (for background and luminosity)
import {EXRLoader} from 'three/addons/loaders/EXRLoader';
// For basic controls orbiting around the model
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
// Postprocessing to allow filters and processing of the canvas
// Built by mrdoob and vanruesc at https://www.npmjs.com/package/postprocessing
import * as POSTPROCESSING from "postprocessing"
// realism-effects to enable Motion Blur
// made by 0beqz at https://github.com/0beqz/realism-effects
import { MotionBlurEffect, VelocityDepthNormalPass } from "realism-effects"

/* INIT */
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();

/* LOADERS */
let gltfLoader = new GLTFLoader();
let exrLoader = new EXRLoader();

let [gltf, ext] = [
	gltfLoader.loadAsync('./obj'),
    exrLoader.loadAsync("./env"),
]

/* SCENE */

let gltfFile

gltf.then((gltf) => {
		gltfFile = gltf.scene;
		scene.add(gltfFile);
	});

/* RENDERER */

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
document.getElementById("drop_zone")?.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true

const composer = new POSTPROCESSING.EffectComposer(renderer)

// EFFECTS
const renderPass = new POSTPROCESSING.RenderPass( scene, camera )
composer.addPass( renderPass )
const velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera)
composer.addPass(velocityDepthNormalPass)

const motionBlurEffect = new MotionBlurEffect(velocityDepthNormalPass)
const effectPass = new POSTPROCESSING.EffectPass(camera, motionBlurEffect)
composer.addPass(effectPass)

composer.setSize(window.innerWidth, window.innerHeight);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

/* BACKGROUND */

ext.then((texture) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.environment = texture;
			scene.background = texture;

			texture.dispose();
		}
	);


/* SCENE CONTROLS */

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

/* ANIMATION */

function resizeRendererToDisplaySize(renderer, camera) {
	const canvas = renderer.domElement;
	const width = window.innerWidth;
	const height = window.innerHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height);
		composer.setSize(width, height);
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}
	return needResize;
}

function animation(time) {

	resizeRendererToDisplaySize(renderer, camera)

	
	// renderer.render(scene, camera);
	composer.render();

}

/* DRAG AND DROP HANDLERS */

window.dropHandler = function (event) {
	let backgroundExt = [".exr"]
	let glExt = [".glb", ".gltf"]

	event.preventDefault();
	let dt = Array.from(event.dataTransfer.items) ?? []
	dt = dt.filter((item) => item.kind == "file")

	let newBack = dt.find((item) => backgroundExt.filter((ext) => item.getAsFile().name.endsWith(ext)).length > 0)
	let newGl = dt.find((item) => glExt.filter((ext) => item.getAsFile().name.endsWith(ext)).length > 0)

	if (newGl) {
		scene.remove(gltfFile)
		newGl.getAsFile().arrayBuffer().then((AB) => {
			gltfLoader.parse(AB, "", (gl) => {
				gltfFile = gl.scene;
				scene.add(gltfFile);
			})
		})
	}

	if (newBack) {
		newBack.getAsFile().arrayBuffer().then((AB) => {
			let texData = exrLoader.parse(AB)

			// Manually parse new texture for webGl, since there is no buffer loader for EXR files
			const texture = new THREE.DataTexture();

			let usedKeys = ["encoding", "format", "type"]
			let imageKeys = ["width", "height", "data"]
			let texKeys = Object.entries(texData)
			Object.assign(texture,
				Object.fromEntries(texKeys.filter(([key, _]) => {
					return usedKeys.includes(key)
				})),
				{
					image: Object.fromEntries(texKeys.filter(([key, _]) => {
						return imageKeys.includes(key)
					})),
					magFilter: THREE.LinearFilter,
					minFilter: THREE.LinearFilter,
					needsUpdate:true
				}
			)
			
			texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.environment = texture;
			scene.background = texture;

			texture.dispose();
		})
	}
}

window.dragOverHandler = function (event) {
	event.preventDefault();
}
