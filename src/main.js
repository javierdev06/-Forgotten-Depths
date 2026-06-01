import * as THREE from 'three'

// Escena base
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

// Cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 2, 5)

// Renderer
const canvas = document.getElementById('game-canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// Luz básica
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

// Game loop
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})