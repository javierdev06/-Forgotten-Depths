import * as THREE from 'three'
import { scene, camera } from '../core/renderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Linterna
const flashlight = new THREE.SpotLight(0xfff5cc, 50, 30, Math.PI * 0.3, 0.3, 1)
flashlight.castShadow = true
scene.add(flashlight)
scene.add(flashlight.target)

// Posición de Lucas
const lucasPos = new THREE.Vector3(0, 0.5, 0)

// Modelo de Lucas
let lucasModel = null
const loader = new GLTFLoader()
loader.load('/lucas.glb', (gltf) => {
  lucasModel = gltf.scene
  lucasModel.scale.set(0.8, 0.8, 0.8)
  lucasModel.castShadow = true
  scene.add(lucasModel)
  lucasModel.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.visible = true
      child.material = new THREE.MeshLambertMaterial({ color: 0xccaa88 })
    }
  })
})

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
  camera.getWorldDirection(direction)
  direction.y = 0
  direction.normalize()
  right.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize()

  if (keys['KeyW']) lucasPos.addScaledVector(direction, speed)
  if (keys['KeyS']) lucasPos.addScaledVector(direction, -speed)
  if (keys['KeyA']) lucasPos.addScaledVector(right, -speed)
  if (keys['KeyD']) lucasPos.addScaledVector(right, speed)

  if (lucasModel) {
    lucasModel.position.copy(lucasPos)
    lucasModel.rotation.y = euler.y + Math.PI
  }

  if (thirdPerson) {
    camera.position.set(
      lucasPos.x - direction.x * 2,
      lucasPos.y + 1,
      lucasPos.z - direction.z * 2
    )
    camera.lookAt(lucasPos.x, lucasPos.y + 0.5, lucasPos.z)
  } else {
    camera.position.set(lucasPos.x, lucasPos.y + 0.9, lucasPos.z)
  }

  flashlight.position.copy(camera.position)
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir)
  flashlight.target.position.copy(camera.position).addScaledVector(dir, 10)
  flashlight.target.updateMatrixWorld()
}