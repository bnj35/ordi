import * as THREE from 'three';
// import GUI from 'lil-gui';
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { DotScreenPass } from 'three/examples/jsm/Addons.js';
import { Raycaster } from 'three';
import { Vector2 } from 'three';


// Cursor
const cursor = {
    x: 0,
};
window.addEventListener("mousemove", function (event) {
    cursor.x = event.clientX / sizes.width - 0.5;
});

/**
 * Base
 */

// Debug
// const gui = new GUI()
// let stats = Stats()
// document.body.appendChild(stats.dom)

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


/**
 * fog
 */
scene.fog = new THREE.Fog(0x040404, 20, 25)

/**
 * objects
 */
var loader = new GLTFLoader(loadingManager)
let room; 
loader.load( './room.glb', function ( gltf )
{
    room = gltf.scene;
    room.scale.set(0.5, 0.5, 0.5);
    room.position.y = 0.1;
    room.position.x = -1;
    room.rotation.y = Math.PI * 1.01;
    room.position.z = -0.1;


    const directionalLight = new THREE.DirectionalLight(0xffffff, 7)
directionalLight.position.set(camera.position.x, camera.position.y, camera.position.z)
directionalLight.target.position.set(room.position.x, room.position.y, room.position.z)
scene.add(directionalLight)

scene.add(room);


});       

/**
 * ligths
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

const rectLight1 = new THREE.RectAreaLight(0xffffff, 6, 10, 10)
rectLight1.width = 7
rectLight1.height = 5
rectLight1.position.set(-9, 7, -1)
rectLight1.rotation.set(5, 0, 0.3)
scene.add(rectLight1)

const rectLight2 = new THREE.RectAreaLight(0xffffff, 2, 10, 10)
rectLight2.position.set(0, 15, -20)
rectLight1.width = 7
rectLight1.height = 3
rectLight2.rotation.set(4.7, 0, 0)
scene.add(rectLight2)

const rectLight3 = new THREE.RectAreaLight(0xffffff, 10, 10, 10)
rectLight3.width = 7
rectLight3.height = 4
rectLight3.position.set(8, 7, 0)
rectLight3.rotation.set(5, 0, -0.5)
scene.add(rectLight3)


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
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 3
camera.position.z = 5
camera.lookAt(new THREE.Vector3(0, 3, 0));
scene.add(camera)

    //raycast
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    
    function onPointerMove( event ) {
    
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    }
    let intersected;
    let RayTitle = document.getElementById('info_ray_title');

    function test() {
        
        
        raycaster.setFromCamera( pointer, camera );
    
        if (scene.children[7]) {
            
            const intersects = raycaster.intersectObjects( [scene.children[7]] );
    
            if (intersects.length > 0) {
                if (intersected !== intersects[0].object.parent) {
                    // intersected = intersects[0].object.parent;
                    console.log(RayTitle);
                    RayTitle.innerHTML = intersects[0].object.parent.name;

                    document.body.style.cursor = "pointer";
                    if (intersects[0].object.parent.name == "class1") {
                        RayTitle.innerHTML = "School";
                        canvas.addEventListener('click', function(){
                            RayTitle.innerHTML = "Wait a moment";
                            window.location.href = "etudiant.html";
                        });
                    }
                    if (intersects[0].object.parent.name == "desk1") {
                        RayTitle.innerHTML = "Web and Developpemnt";
                        canvas.addEventListener('click', function(){
                            RayTitle.innerHTML = "Wait a moment";
                            window.location.href = "Dev.html";
                        });
                    }
                    if (intersects[0].object.parent.name == "basket1") {
                        RayTitle.innerHTML = "Graphism and Design";
                        canvas.addEventListener('click', function(){
                            RayTitle.innerHTML = "Wait a moment";
                            window.location.href = "graphiste.html";
                        });
                    }
                }
                else{
                    
                    intersected = null;
                    document.body.style.cursor = "auto";
                }
                    
            }
        }
    }
    
    window.addEventListener( 'pointermove', onPointerMove );
    // window.requestAnimationFrame(test);
//post processing
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)
composer.addPass(new DotScreenPass(new THREE.Vector2(2, 2), 0.5, 2))


    
/**
 * gui&helpers
 */
const helpers = new THREE.Group()
scene.add(helpers)



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    camera.rotation.y =  -((cursor.x) * Math.PI * 2)*0.1;

    // Update stats
    // stats.update()

    // Render
    renderer.render(scene, camera)
    composer.render()

    test();
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

