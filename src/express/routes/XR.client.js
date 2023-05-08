/* IMPORTS */

// Three.js for starting the 3d canvas view
// Built by mrdoob, at https://www.npmjs.com/package/three
import * as THREE from 'three';
// For loading GLTF files (for displaying)
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
// For loading EXR files (for background and luminosity)
import { EXRLoader } from 'three/addons/loaders/EXRLoader';
// For basic controls orbiting around the model
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ARButton } from "three/addons/webxr/ARButton";
// Postprocessing to allow filters and processing of the canvas
// Built by mrdoob and vanruesc at https://www.npmjs.com/package/postprocessing
import * as POSTPROCESSING from "postprocessing"
// realism-effects to enable Motion Blur
// made by 0beqz at https://github.com/0beqz/realism-effects
import { MotionBlurEffect, VelocityDepthNormalPass } from "realism-effects"

// class ARButton {
//     inAR = false;
//     XRsession;
//     sessionInit;
//     button;
//     currentSession;
// 	renderer;

//     constructor(renderer, domEl) {
// 		console.log("creating button")
//         this.button = document.createElement('button');
// 		this.renderer = renderer;
//         domEl.appendChild(this.button)

// 		this.sessionInit = {};

//         // this.button.style.display = '';

//         this.button.style.cursor = 'pointer';
//         this.button.style.left = 'calc(50% - 50px)';
//         this.button.style.width = '100px';

//         this.button.textContent = 'START AR';

//         if (navigator.xr != null) {
//             this.XRsession = navigator.xr;

//             this.button.id = 'ARButton';
//             // this.button.style.display = 'none';

//             this.stylizeElement(this.button);

//             navigator.xr.isSessionSupported('immersive-ar').then((supported) => {

//                 supported ? this.showStartAR() : this.showARNotSupported();

//             }).catch(console.error);

//         } else {

//             const message = document.createElement('a');

//             if (window.isSecureContext === false) {

//                 message.href = document.location.href.replace(/^http:/, 'https:');
//                 message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

//             } else {

//                 message.href = 'https://immersiveweb.dev/';
//                 message.innerHTML = 'WEBXR NOT AVAILABLE';

//             }

//             message.style.left = 'calc(50% - 90px)';
//             message.style.width = '180px';
//             message.style.textDecoration = 'none';

//             this.stylizeElement(message);
//         }

//         this.button.onmouseenter = () => {

//             this.button.style.opacity = '1.0';

//         };

//         this.button.onmouseleave = () => {

//             this.button.style.opacity = '0.5';

//         };

//         this.button.onclick = () => {

//             if (this.currentSession == null) {

//                 this.XRsession.requestSession('immersive-ar', this.sessionInit).then(this.onSessionStarted);
//                 this.inAR = true;

//             } else {

//                 this.currentSession.end();
//                 this.inAR = false;
//             }

//         };
//     }

// 	async onSessionStarted(session) {

// 		session.addEventListener('end', this.onSessionEnded);

// 		this.renderer.xr.setReferenceSpaceType('local');

// 		await this.renderer.xr.setSession(session);

// 		this.button.textContent = 'STOP AR';
// 		this.sessionInit.domOverlay.root.style.display = '';

// 		this.currentSession = session;
// 		this.inAR = true;

// 	}

// 	onSessionEnded( /*event*/) {

// 		this.currentSession.removeEventListener('end', this.onSessionEnded);

// 		this.button.textContent = 'START AR';
// 		this.sessionInit.domOverlay.root.style.display = 'none';

// 		this.currentSession = null;
// 		this.inAR = false;

// 	}

//     showStartAR( /*device*/) {

//         if (this.sessionInit?.domOverlay === undefined) {

//             const overlay = document.createElement('div');
//             overlay.style.display = 'none';
//             document.body.appendChild(overlay);

//             const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//             svg.setAttribute('width', "38");
//             svg.setAttribute('height', "38");
//             svg.style.position = 'absolute';
//             svg.style.right = '20px';
//             svg.style.top = '20px';
//             svg.addEventListener('click', () => {

//                 this.currentSession.end();
//                 this.inAR = false;

//             });
//             overlay.appendChild(svg);

//             const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//             path.setAttribute('d', 'M 12,12 L 28,28 M 28,12 12,28');
//             path.setAttribute('stroke', '#fff');
//             path.setAttribute('stroke-width', "2");
//             svg.appendChild(path);

//             if (this.sessionInit?.optionalFeatures === undefined) {

//                 this.sessionInit.optionalFeatures = [];

//             }

//             this.sessionInit.optionalFeatures.push('dom-overlay');
//             this.sessionInit.domOverlay = { root: overlay };

//         }
//     }

//     disableButton() {

//         this.button.style.display = '';

//         this.button.style.cursor = 'auto';
//         this.button.style.left = 'calc(50% - 75px)';
//         this.button.style.width = '150px';

//         this.button.onmouseenter = null;
//         this.button.onmouseleave = null;

//         this.button.onclick = null;

//     }

//     showARNotSupported() {

//         this.disableButton();

//         this.button.textContent = 'AR NOT SUPPORTED';

//     }

//     showARNotAllowed(exception) {

//         this.disableButton();

//         console.warn('Exception when trying to call xr.isSessionSupported', exception);

//         this.button.textContent = 'AR NOT ALLOWED';

//     }

//     stylizeElement(element) {

//         element.style.position = 'absolute';
//         element.style.bottom = '20px';
//         element.style.padding = '12px 6px';
//         element.style.border = '1px solid #fff';
//         element.style.borderRadius = '4px';
//         element.style.background = 'rgba(0,0,0,0.1)';
//         element.style.color = '#fff';
//         element.style.font = 'normal 13px sans-serif';
//         element.style.textAlign = 'center';
//         element.style.opacity = '0.5';
//         element.style.outline = 'none';
//         element.style.zIndex = '999';

//     }

// }


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

export async function browserHasXR() {
	return window.navigator.xr && navigator.xr.isSessionSupported(
		"immersive-ar",
	);
}

const XR = await browserHasXR();
console.log(XR)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
let domEl = document.getElementById("drop_zone")
domEl?.appendChild(renderer.domElement);
let ARB;
if (XR) {
	renderer.xr.enabled = true;
	console.log("creating ARB")
	// ARB = new ARButton(renderer, domEl);
	let button = ARButton.createButton(renderer)
	button.style.scale = 5;
	button.style.bottom = "100px";
	domEl?.appendChild(button)
}
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true

if (!XR) {
	const composer = new POSTPROCESSING.EffectComposer(renderer)

	// EFFECTS
	const renderPass = new POSTPROCESSING.RenderPass(scene, camera)
	composer.addPass(renderPass)
	const velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera)
	composer.addPass(velocityDepthNormalPass)

	const motionBlurEffect = new MotionBlurEffect(velocityDepthNormalPass)
	const effectPass = new POSTPROCESSING.EffectPass(camera, motionBlurEffect)
	composer.addPass(effectPass)

	composer.setSize(window.innerWidth, window.innerHeight);

	const pmremGenerator = new THREE.PMREMGenerator(renderer);
	pmremGenerator.compileEquirectangularShader();
}
/* BACKGROUND */

ext.then((texture) => {
	texture.mapping = THREE.EquirectangularReflectionMapping;
	scene.environment = texture;
	if (XR) {
		// scene.backgroundIntensity = 0;
		scene.background = null;
	} else {
		scene.background = texture;
	}

	texture.dispose();
}
);

/* SCENE CONTROLS */

// if (!XR) {
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.update();
// }

/* ANIMATION */

function resizeRendererToDisplaySize(renderer, camera) {
	const canvas = renderer.domElement;
	const width = window.innerWidth;
	const height = window.innerHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height);
		if (!XR) {
			composer.setSize(width, height);
		}
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}
	return needResize;
}

function animation(time) {
	if (!XR) {
		resizeRendererToDisplaySize(renderer, camera)
	}

	if (XR) {
		renderer.setClearColor(0x000000, 0)
		renderer.render(scene, camera);
	} else {
		composer.render();
	}

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
					needsUpdate: true
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
