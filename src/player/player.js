import * as THREE from 'three'
import { scene, camera } from '../core/renderer.js'

// Linterna
const flashlight = new THREE.SpotLight(0xfff5cc, 50, 30, Math.PI * 0.3, 0.3, 1)
flashlight.castShadow = true
scene.add(flashlight)
scene.add(flashlight.target)

// Modelo de Lucas
const lucasBody = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.3, 1.2, 4, 8),
  new THREE.MeshLambertMaterial({ color: 0x8B6914 })
)
lucasBody.castShadow = true
lucasBody.position.set(0, 0.9, 0)
scene.add(lucasBody)

// Teclado
const keys = {}
window.addEventListener('keydown', (e) => keys[e.code] = true)
window.addEventListener('keyup', (e) => keys[e.code] = false)

// Mouse look
const euler = new THREE.Euler(0, 0, 0, 'YXZ')
let thirdPerson = false

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

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyV') thirdPerson = !thirdPerson
})

const speed = 0.15
const direction = new THREE.Vector3()
const right = new THREE.Vector3()

export function updatePlayer() {
  // Dirección relativa a la cámara
  camera.getWorldDirection(direction)
  direction.y = 0
  direction.normalize()
  right.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize()

  // Mover a Lucas
  if (keys['KeyW']) lucasBody.position.addScaledVector(direction, speed)
  if (keys['KeyS']) lucasBody.position.addScaledVector(direction, -speed)
  if (keys['KeyA']) lucasBody.position.addScaledVector(right, -speed)
  if (keys['KeyD']) lucasBody.position.addScaledVector(right, speed)

  lucasBody.rotation.y = euler.y + Math.PI

  // Cámara según modo
  if (thirdPerson) {
    camera.position.set(
      lucasBody.position.x - direction.x * 3,
      lucasBody.position.y + 1.5,
      lucasBody.position.z - direction.z * 3
    )
    camera.lookAt(
      lucasBody.position.x,
      lucasBody.position.y + 0.5,
      lucasBody.position.z
    )
  } else {
    camera.position.set(
      lucasBody.position.x,
      lucasBody.position.y + 0.9,
      lucasBody.position.z
    )
  }

  // Linterna
  flashlight.position.copy(camera.position)
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)
  flashlight.target.position.copy(camera.position).addScaledVector(dir, 10)
  flashlight.target.updateMatrixWorld()
}