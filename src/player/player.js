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

const speed = 0.15

export function updatePlayer() {
  if (keys['KeyW']) camera.position.z -= speed
  if (keys['KeyS']) camera.position.z += speed
  if (keys['KeyA']) camera.position.x -= speed
  if (keys['KeyD']) camera.position.x += speed

  // Linterna sigue la cámara
  flashlight.position.copy(camera.position)
  flashlight.target.position.set(
    camera.position.x,
    camera.position.y - 1,
    camera.position.z - 5
  )
  flashlight.target.updateMatrixWorld()
}