import * as THREE from 'three';
import GUI from 'lil-gui';
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';



/**
 * Base
 */

// Debug
const gui = new GUI()
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
 * particles
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('./particle.png')

const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)

for (let i =0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 50
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)



const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size= 0.02
particlesMaterial.sizeAttenuation= true
particlesMaterial.color = new THREE.Color('#9ffaff')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.NormalBlending
    //points 
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

/**
 * objects
 */

var loader = new GLTFLoader()
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
screen.castShadow = true;
screen.receiveShadow = true;
keyboard.castShadow = true;
keyboard.receiveShadow = true;
plane.receiveShadow = true;




// gsap
let isOpen = false

let curve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4, 4, 15),
    new THREE.Vector3(0, 7.5, 11),

]);
let curve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 7.5, 11),
    new THREE.Vector3(5, 5, 12),
    new THREE.Vector3(5, 2, -7),
    
]);
let curve3 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(5, 2, -7),
    new THREE.Vector3(-7, 5, -6),
    new THREE.Vector3(-3, 2, 2),
]);

let curve4 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 2, 2),
    new THREE.Vector3(5, 2, 5),
    new THREE.Vector3(0, 3, 10),
]);
let curve5 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 3, 10),
    new THREE.Vector3(0, 3, 7),
    new THREE.Vector3(0, 2.3, -2.3),
]);

let curveScreen = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 3, 1),
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
        { trigger: "#spacer6", duration: 2},
    ];


    triggers.forEach(({ trigger, duration, curve ,curveScreen, rotateScreen}) => {
        ScrollTrigger.create({
            trigger,
            start: "top top",
            end: "bottom top",
            scrub: 5,
            duration,
            onUpdate: self => {
                if (trigger === "#spacer1" ) {
                    isOpen = false;
                }
                else{
                    isOpen = true;
                }
                camera.lookAt(new THREE.Vector3(-0.05, 2.5, -2));
                camera.position.copy(curve.getPoint(self.progress));
                screen.position.copy(curveScreen.getPoint(self.progress));
                // camera.rotation.copy(new THREE.Euler().setFromVector3(rotate.getPoint(self.progress)));
                screen.rotation.copy(new THREE.Euler().setFromVector3(rotateScreen.getPoint(self.progress)));
                camera.lookAt(new THREE.Vector3(-0.05, 2.5, -2));

                console.log(self.progress);
                if(trigger === "#spacer6" && self.progress === 1){
                    window.location.href = "graphiste.html";
                }
            //     if (!isOpen && screen !== null) {
            //                     screen.rotation.x = Math.PI * 2.15 - (self.progress * Math.PI * 0.8) - 0.2;
            //                                 screen.position.y = (3 - (self.progress*1))**2;
            //                                 screen.position.z = 6 - (self.progress * 7.35);
            //                 }
            //                 else {}
            //     if (!isOpen  && keyboard !== null) {
            //                                 keyboard.position.y = (3.215 - (self.progress * 2.57))**2;
            //                                 pointLight.position.y =(4.25 - (self.progress * 4.3));
            //                             }
            //                             else{}
            // },
    }});});

scene.add(ordi);
});       

/**
 * ligths
 */

const pointLight = new THREE.PointLight(0x41ff31, 0.25)
pointLight.position.set(-3.05, 0.15, 0.25)
scene.add(pointLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
dirLight.position.set(1.45, 0.7, -1.5)

const pointLight2 = new THREE.PointLight(0x89CFEF, 3)

pointLight2.position.set(2, 2, 2)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0x800080, 2.5)
pointLight3.position.set(-2, 2, 2)
scene.add(pointLight3)

// const recLight = new THREE.RectAreaLight(0xa5c6f8, 2, 6, 3.58)
// recLight.position.set(0, 0.68, 1.9)
// recLight.rotation.x = Math.PI * 1.45

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
camera.position.y = 4
camera.position.z = 15
camera.lookAt(new THREE.Vector3(-0.05, 2.5, -2));
scene.add(camera)

//post processing
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)
composer.addPass(new UnrealBloomPass(new THREE.Vector2(sizes.width, sizes.height), 0.5, 0.7, 0.7))




// //test if camera is in the right position
// if (camera.position.y >= -4 && camera.position.y <= 4 && 
//     camera.position.z >= -4 && camera.position.z <= 4 && 
//     camera.position.x >= -4 && camera.position.x <= 4) {
//         console.log("ok");

//     window.location.href = "graphiste.html";
// }


/**
 * gui&helpers
 */
const helpers = new THREE.Group()
scene.add(helpers)

// const axesHelper = new THREE.AxesHelper(5)
// helpers.add(axesHelper)

gui.add(dirLight, 'intensity').min(0).max(10).step(0.001).name('directional light intensity')


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

