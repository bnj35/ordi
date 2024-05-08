import * as THREE from 'three';
// import GUI from 'lil-gui';
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import { FilmPass } from 'three/examples/jsm/Addons.js';

document.addEventListener('DOMContentLoaded', function () {
    document.scrollingElement.scrollTo(0, 0);
}
);

/**
 * Base
 */

// Debug
// const gui = new GUI()
let stats = Stats()
document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector('canvas.webgl')
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Scene
const scene = new THREE.Scene()

//loader

const loadingManager = new THREE.LoadingManager( () => {
	
    const loadingScreen = document.getElementById( 'loading-screen' );
    loadingScreen.classList.add( 'fade-out' );
    
    // optional: remove loader from DOM via event listener
    loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
    
} );

function onTransitionEnd( event ) {

	event.target.remove();
	
}
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000)

//shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


// scene.add(plane)
/**
 * fog
 */
scene.fog = new THREE.Fog(0x040404, 15, 20)

/**
 * objects
 */
var loader = new GLTFLoader(loadingManager)
let ordi; 
loader.load( './ordi4.glb', function ( gltf )
{
    ordi = gltf.scene;
    ordi.scale.set(0.5, 0.5, 0.5);
    ordi.position.y = 0.01;
    ordi.position.z = -0.1
const plane = ordi.children[2];
const screen = ordi.children[1];
const keyboard = ordi.children[0];
screen.rotateX(6.2);
screen.position.y = 3.2;
screen.position.z = 2.6;
screen.castShadow = true;
screen.receiveShadow = true;
keyboard.castShadow = true;
keyboard.receiveShadow = true;
plane.receiveShadow = true;




// gsap
let isOpen = false

let curve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4, 2, 10),
    new THREE.Vector3(0, 3.5, 11),
    new THREE.Vector3(4, 1, 2),

]);
let curve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(4, 1, 2),
    new THREE.Vector3(-1, 2, 2),
    new THREE.Vector3(-7, 2, 2),
]);
let curve3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-7, 2, 2),
    new THREE.Vector3(-5, 2, -5),
    new THREE.Vector3(0, 2, -10),
    new THREE.Vector3(6, 2, -5),
    new THREE.Vector3(7, 2, 4),
]);

let curve4 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(7, 2, 4),
    new THREE.Vector3(4, 2, 7),
    new THREE.Vector3(0, 3, 10),
]);
let curve5 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 3, 10),
    new THREE.Vector3(0, 3, 7),
    new THREE.Vector3(0, 2.3, -1.805),
]);

let curveScreen = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 3.2, 2.5),
    new THREE.Vector3(0, 3.4, 0.5),
    new THREE.Vector3(0, 3.7, 0),
    new THREE.Vector3(0, 4.3, -0.3),
    new THREE.Vector3(0, 4.4, -1),
    new THREE.Vector3(0, 3.4, -2.8),
]);

let rotateScreen =   new THREE.CatmullRomCurve3([
    new THREE.Vector3(5.5, 0, 0),
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(4, 0, 0),
]);



        
    gsap.registerPlugin(ScrollTrigger);

    const triggers = [
        { trigger: "#spacer1", duration: 6, curve: curve1 ,curveScreen: curveScreen, rotateScreen: rotateScreen},
        { trigger: "#spacer2", duration: 5, curve: curve2 },
        { trigger: "#spacer3", duration: 5, curve: curve3 },
        { trigger: "#spacer4", duration: 5, curve: curve4 },
        { trigger: "#spacer5", duration: 3, curve: curve5},
        { trigger: "#spacer6", duration: 2,},
    ];


    triggers.forEach(({ trigger, duration, curve ,curveScreen, rotateScreen}) => {
        ScrollTrigger.create({
            trigger,
            start: "top top",
            end: "bottom top",
            scrub: 5,
            duration : duration,  
            onUpdate: self => {
                if (curve) {
                    camera.position.copy(curve.getPoint(self.progress));
                }
                if (curveScreen) {
                    screen.position.copy(curveScreen.getPoint(self.progress));
                }
                if (rotateScreen) {
                    screen.rotation.copy(new THREE.Euler().setFromVector3(rotateScreen.getPoint(self.progress)));
                }
                if (trigger === "#spacer1" ) {
                    isOpen = false;
                }
                else{
                    isOpen = true;
                }
                console.log(camera.position);
                camera.lookAt(new THREE.Vector3(-0.05, 2.3, -2.4)); 
                if (camera.position.x === 0 && camera.position.y === 2.3 && camera.position.z === -1.8049999999999997){
                    window.location.href = "room.html";
                }    
        }
    }
    )
}
);

scene.add(ordi);
});       

/**
 * ligths
 */
const ambientLight = new THREE.AmbientLight(0xffaaaa, 0.2)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 4)
dirLight.position.set(1.45, 0.7, -1.5)

const pointLight2 = new THREE.PointLight(0x89CFEF, 4)

pointLight2.position.set(2, 2, 2)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0x800080, 4)
pointLight3.position.set(-2, 2, 2)
scene.add(pointLight3)


scene.add(dirLight)






window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -4
camera.position.y = 2
camera.position.z = 10
camera.lookAt(new THREE.Vector3(-0.05, 2.5, -2));
scene.add(camera)

//post processing
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)
composer.addPass(new UnrealBloomPass(new THREE.Vector2(sizes.width, sizes.height), 0.5, 0.8, 0.7))
composer.addPass(new FilmPass(0.35, false))

/**
 * gui&helpers
 */
const helpers = new THREE.Group()

const polarGridHelper = new THREE.PolarGridHelper(10, 10)
polarGridHelper.position.y = 0.01
helpers.add(polarGridHelper)


scene.add(helpers)



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    // Update stats
    stats.update()

    // Render
    renderer.render(scene, camera)
    composer.render()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

