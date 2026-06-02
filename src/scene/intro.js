import * as THREE from 'three'
import { scene, camera, renderer } from '../core/renderer.js'

const textureLoader = new THREE.TextureLoader()

// Cielo atardecer
scene.background = new THREE.Color(0xff7733)
scene.fog = new THREE.FogExp2(0xff9944, 0.02)

// Suelo exterior
const groundGeo = new THREE.PlaneGeometry(200, 200)
const groundMat = new THREE.MeshLambertMaterial({ color: 0x2d4a1e })
const ground = new THREE.Mesh(groundGeo, groundMat)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

// Montaña
function createMountain(x, z, scale) {
  const geo = new THREE.ConeGeometry(scale, scale * 1.5, 8)
  const mat = new THREE.MeshLambertMaterial({ color: 0x4a3728 })
  const mountain = new THREE.Mesh(geo, mat)
  mountain.position.set(x, scale * 0.75, z)
  mountain.castShadow = true
  scene.add(mountain)
}

createMountain(0, -30, 25)
createMountain(-20, -40, 15)
createMountain(20, -35, 18)

// Entrada de la cueva
function createCaveEntrance() {
  const archGeo = new THREE.TorusGeometry(4, 1.5, 8, 16, Math.PI)
  const archMat = new THREE.MeshLambertMaterial({ color: 0x3a2a10 })
  const arch = new THREE.Mesh(archGeo, archMat)
  arch.position.set(0, 4, -15)
  arch.rotation.z = Math.PI
  scene.add(arch)

  // Oscuridad interior
  const darkGeo = new THREE.CircleGeometry(3.5, 16)
  const darkMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const dark = new THREE.Mesh(darkGeo, darkMat)
  dark.position.set(0, 4, -14.9)
  scene.add(dark)
}

createCaveEntrance()

// Arboles
function createTree(x, z) {
  const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2, 6)
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x4a2f0a })
  const trunk = new THREE.Mesh(trunkGeo, trunkMat)
  trunk.position.set(x, 1, z)
  scene.add(trunk)

  const leavesGeo = new THREE.ConeGeometry(1.5, 3, 7)
  const leavesMat = new THREE.MeshLambertMaterial({ color: 0x1a4a1a })
  const leaves = new THREE.Mesh(leavesGeo, leavesMat)
  leaves.position.set(x, 3.5, z)
  scene.add(leaves)
}

for (let i = 0; i < 30; i++) {
  const x = (Math.random() - 0.5) * 80
  const z = (Math.random() - 0.5) * 40 - 10
  if (Math.abs(x) > 8 || z > -5) createTree(x, z)
}

// Luz del atardecer
const sunLight = new THREE.DirectionalLight(0xff7733, 1.5)
sunLight.position.set(-10, 20, 10)
sunLight.castShadow = true
scene.add(sunLight)

const ambientLight = new THREE.AmbientLight(0xff9944, 0.5)
scene.add(ambientLight)

// Vehículo abandonado
function createJeep(x, z) {
  const bodyGeo = new THREE.BoxGeometry(3, 1.2, 5)
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4a5a3a })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.set(x, 0.8, z)
  scene.add(body)

  const roofGeo = new THREE.BoxGeometry(2.5, 0.8, 2.5)
  const roof = new THREE.Mesh(roofGeo, bodyMat)
  roof.position.set(x, 1.8, z + 0.3)
  scene.add(roof)

  // Ruedas
  for (let wx of [-1.6, 1.6]) {
    for (let wz of [-1.5, 1.5]) {
      const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8)
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111111 })
      const wheel = new THREE.Mesh(wheelGeo, wheelMat)
      wheel.position.set(x + wx, 0.4, z + wz)
      wheel.rotation.z = Math.PI / 2
      scene.add(wheel)
    }
  }
}

createJeep(-6, -8)
createJeep(7, -10)

export { camera }