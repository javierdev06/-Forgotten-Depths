import * as THREE from 'three'
import { scene, camera } from '../core/renderer.js'

// Linterna
const flashlight = new THREE.SpotLight(0xfff5cc, 50, 30, Math.PI * 0.3, 0.3, 1)
flashlight.castShadow = true
scene.add(flashlight)
scene.add(flashlight.target)

// Movimiento
const keys = {}
window.addEventListener('keydown', (e) => keys[e.code] = true)
window.addEventListener('keyup', (e) => keys[e.code] = false)

// Mouse look
const euler = new THREE.Euler(0, 0, 0, 'YXZ')

document.addEventListener('click', () => {
  document.body.requestPointerLock()
})

document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== document.body) return

  euler.y -= e.movementX * 0.002
  euler.x -= e.movementY * 0.002
  euler.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, euler.x))

  camera.quaternion.setFromEuler(euler)
})

const speed = 0.15

export function updatePlayer() {
  if (keys['KeyW']) camera.position.z -= speed
  if (keys['KeyS']) camera.position.z += speed
  if (keys['KeyA']) camera.position.x -= speed
  if (keys['KeyD']) camera.position.x += speed

  // Linterna sigue la cámara
  flashlight.position.copy(camera.position)
    const direction = new THREE.Vector3()
    camera.getWorldDirection(direction)
    flashlight.target.position.copy(camera.position).addScaledVector(direction, 10)
  flashlight.target.updateMatrixWorld()
}