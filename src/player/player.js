import * as THREE from 'three'
import { scene, camera } from '../core/renderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Linterna
const flashlight = new THREE.SpotLight(0xfff5cc, 50, 30, Math.PI * 0.3, 0.3, 1)
flashlight.castShadow = true
scene.add(flashlight)
scene.add(flashlight.target)

// Posición de Lucas
export const lucasPos = new THREE.Vector3(0, 1.2, 0)

// Cinemática de entrada
let introPlaying = true
let introTimer = 0
const introStartY = 15
lucasPos.set(0, introStartY, 5)

export let lucasModel = null
export let mixer = null
let idleAction = null
let walkAction = null

const loader = new GLTFLoader()
loader.load('/lucas.glb', (gltf) => {
  console.log('Lucas animaciones:', gltf.animations.length)
  gltf.animations.forEach((a, i) => console.log(i, a.name))
  lucasModel = gltf.scene
  lucasModel.scale.set(0.8, 0.8, 0.8)
  lucasModel.position.y = 0.3
  lucasModel.castShadow = true
  scene.add(lucasModel)

  lucasModel.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.visible = true
    }
  })

  mixer = new THREE.AnimationMixer(lucasModel)

  if (gltf.animations.length > 0) {
    idleAction = mixer.clipAction(gltf.animations[0])
    idleAction.play()
  }

  // Cargar walking después de que el mixer existe
  const walkLoader = new GLTFLoader()
  walkLoader.load('/walking.glb', (walkGltf) => {
  console.log('Walking animations:', walkGltf.animations.length)
  if (walkGltf.animations.length > 0) {
    walkAction = mixer.clipAction(walkGltf.animations[0])
    walkAction.loop = THREE.LoopRepeat
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
let isWalking = false
let isJumping = false
let jumpVelocity = 0
const gravity = -0.01
const jumpForce = 0.2
const groundLevel = 0.8

export function updatePlayer() {
    // Cinemática de caída inicial
    if (introPlaying) {
    introTimer += 0.016
    lucasPos.y -= 0.15
    if (lucasPos.y <= 1.2) {
        lucasPos.y = 1.2
        introPlaying = false
    }
    if (lucasModel) {
        lucasModel.position.copy(lucasPos)
    }
    camera.position.set(lucasPos.x - 3, lucasPos.y + 2, lucasPos.z + 3)
    camera.lookAt(lucasPos.x, lucasPos.y, lucasPos.z)
    return
    }


  camera.getWorldDirection(direction)
  direction.y = 0
  direction.normalize()
  right.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize()

  const isMoving = keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD']

  if (keys['KeyW']) lucasPos.addScaledVector(direction, speed)
  if (keys['KeyS']) lucasPos.addScaledVector(direction, -speed)
  if (keys['KeyA']) lucasPos.addScaledVector(right, -speed)
  if (keys['KeyD']) lucasPos.addScaledVector(right, speed)

  if (idleAction && walkAction) {
    if (isMoving && !isWalking) {
      isWalking = true
      idleAction.fadeOut(0.2)
      walkAction.reset().fadeIn(0.2).play()
    } else if (!isMoving && isWalking) {
      isWalking = false
      walkAction.fadeOut(0.2)
      idleAction.reset().fadeIn(0.2).play()
    }
  }
  // Salto
    if (keys['Space'] && !isJumping) {
    isJumping = true
    jumpVelocity = jumpForce
    }

    if (isJumping) {
    lucasPos.y += jumpVelocity
    jumpVelocity += gravity
    if (lucasPos.y <= groundLevel) {
        lucasPos.y = groundLevel
        isJumping = false
        jumpVelocity = 0
    }
    }

  if (lucasModel) {
  lucasModel.position.copy(lucasPos)
  lucasModel.rotation.y = euler.y + Math.PI
  lucasModel.visible = thirdPerson
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

  if (mixer) mixer.update(0.016)
}