import * as THREE from 'three'

// Escena
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)
scene.fog = new THREE.FogExp2(0x000000, 0.08)

// Cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 2, 0)
camera.lookAt(0, 2, -10)

// Renderer
const canvas = document.getElementById('game-canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

// Luz ambiente muy tenue
const ambientLight = new THREE.AmbientLight(0x111111, 1)
scene.add(ambientLight)

// Linterna
const flashlight = new THREE.SpotLight(0xfff5cc, 50, 30, Math.PI * 0.3, 0.3, 1)
flashlight.castShadow = true
scene.add(flashlight)
scene.add(flashlight.target)

// Suelo
const floorGeo = new THREE.PlaneGeometry(10, 50)
const floorMat = new THREE.MeshLambertMaterial({ color: 0x2a1f0f })
const floor = new THREE.Mesh(floorGeo, floorMat)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// Paredes
const wallMat = new THREE.MeshLambertMaterial({ color: 0x1a1208 })

const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(50, 6), wallMat)
wallLeft.position.set(-5, 3, 0)
wallLeft.rotation.y = Math.PI / 2
scene.add(wallLeft)

const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(50, 6), wallMat)
wallRight.position.set(5, 3, 0)
wallRight.rotation.y = -Math.PI / 2
scene.add(wallRight)

// Techo
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, 50), wallMat)
ceiling.position.set(0, 6, 0)
ceiling.rotation.x = Math.PI / 2
scene.add(ceiling)

// Movimiento
const keys = {}
window.addEventListener('keydown', (e) => keys[e.code] = true)
window.addEventListener('keyup', (e) => keys[e.code] = false)

const speed = 0.05

function handleMovement() {
    if (keys['KeyW']) camera.position.z -= speed * 3
    if (keys['KeyS']) camera.position.z += speed * 3
    if (keys['KeyA']) camera.position.x -= speed
    if (keys['KeyD']) camera.position.x += speed
}

// Game loop
function animate() {
  requestAnimationFrame(animate)
  handleMovement()

  flashlight.position.copy(camera.position)
  flashlight.target.position.set(
    camera.position.x,
    camera.position.y - 1,
    camera.position.z - 5
  )
  flashlight.target.updateMatrixWorld()

  renderer.render(scene, camera)
}

animate()

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})