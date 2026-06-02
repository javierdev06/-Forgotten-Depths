import * as THREE from 'three'
import { scene } from '../core/renderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader()

// Cargar tienda
function placeTent(x, z, rotY = 0) {
  gltfLoader.load('/tent.glb', (gltf) => {
    const tent = gltf.scene
    tent.scale.set(0.2, 0.2, 0.2)
    tent.position.set(x, 0, z)
    tent.rotation.y = rotY
    tent.castShadow = true
    scene.add(tent)
  })
}

// Cargar mochila
function placeBackpack(x, z, rotY = 0) {
  gltfLoader.load('/backpack.glb', (gltf) => {
    const pack = gltf.scene
    pack.scale.set(0.8, 0.8, 0.8)
    pack.position.set(x, 0.3, z)
    pack.rotation.y = rotY
    pack.castShadow = true
    scene.add(pack)
  })
}

const textureLoader = new THREE.TextureLoader()

const colorMap = textureLoader.load('/rock029/Rock029_1K-JPG_Color.jpg')
const normalMap = textureLoader.load('/rock029/Rock029_1K-JPG_NormalGL.jpg')
const roughnessMap = textureLoader.load('/rock029/Rock029_1K-JPG_Roughness.jpg')

colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping
colorMap.repeat.set(3, 3)
normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
normalMap.repeat.set(3, 3)
roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping
roughnessMap.repeat.set(3, 3)

const rockMat = new THREE.MeshStandardMaterial({
  map: colorMap,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  roughness: 1,
  metalness: 0,
  side: THREE.BackSide
})

const floorMat = new THREE.MeshStandardMaterial({
  map: colorMap,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  roughness: 1,
  metalness: 0
})

const segments = [
  { z: 20,   radius: 5,  length: 25 },
  { z: 0,    radius: 5,  length: 25 },
  { z: -20,  radius: 5,  length: 25 },
  { z: -40,  radius: 5,  length: 25 },
  { z: -60,  radius: 5,  length: 25 },
  { z: -80,  radius: 5,  length: 25 },
  { z: -100, radius: 5,  length: 25 },
  { z: -120, radius: 5,  length: 25 },
  { z: -140, radius: 5,  length: 25 },
  { z: -160, radius: 5,  length: 25 },
  { z: -180, radius: 5,  length: 25 },
]

segments.forEach(seg => {
  const geo = new THREE.CylinderGeometry(seg.radius, seg.radius, seg.length, 16, 1, true)
  const mesh = new THREE.Mesh(geo, rockMat)
  mesh.rotation.x = Math.PI / 2
  mesh.position.set(0, seg.radius * 0.6, seg.z)
  scene.add(mesh)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(seg.radius * 1.8, seg.length),
    floorMat
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0.01, seg.z)
  scene.add(floor)

  for (let i = 0; i < 6; i++) {
    const rGeo = new THREE.DodecahedronGeometry(Math.random() * 0.6 + 0.3)
    const rock = new THREE.Mesh(rGeo, new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      roughness: 1,
      metalness: 0
    }))
    rock.position.set(
      (Math.random() - 0.5) * seg.radius * 1.5,
      Math.random() * 0.5,
      seg.z - Math.random() * seg.length
    )
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    scene.add(rock)
  }
})

// DERRUMBE
function createRockfall() {
  for (let i = 0; i < 20; i++) {
    const size = Math.random() * 1.5 + 0.5
    const geo = new THREE.DodecahedronGeometry(size)
    const rock = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      roughness: 1,
      metalness: 0
    }))
    rock.position.set(
      (Math.random() - 0.5) * 8,
      Math.random() * 3,
      8 + Math.random() * 3
    )
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    rock.castShadow = true
    scene.add(rock)
  }
}

createRockfall()

// CAMPAMENTO MEJORADO
function createTent(x, z, rotY = 0) {
  const group = new THREE.Group()

  // Base de la tienda
  const bodyGeo = new THREE.ConeGeometry(1.5, 2, 6)
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4a6741 })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = 1
  group.add(body)

  // Entrada de la tienda
  const doorGeo = new THREE.BoxGeometry(0.6, 0.8, 0.1)
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x2d3d28 })
  const door = new THREE.Mesh(doorGeo, doorMat)
  door.position.set(0, 0.4, 1.2)
  group.add(door)

  // Palo de la tienda
  const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6)
  const poleMat = new THREE.MeshLambertMaterial({ color: 0x8B6914 })
  const pole = new THREE.Mesh(poleGeo, poleMat)
  pole.position.y = 1.1
  group.add(pole)

  group.position.set(x, 0, z)
  group.rotation.y = rotY
  group.castShadow = true
  scene.add(group)
}

function createBackpack(x, z) {
  const group = new THREE.Group()

  // Cuerpo mochila
  const bodyGeo = new THREE.BoxGeometry(0.4, 0.55, 0.2)
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = 0.3
  group.add(body)

  // Bolsillo frontal
  const pocketGeo = new THREE.BoxGeometry(0.3, 0.25, 0.08)
  const pocket = new THREE.Mesh(pocketGeo, new THREE.MeshLambertMaterial({ color: 0x6B3410 }))
  pocket.position.set(0, 0.2, 0.14)
  group.add(pocket)

  group.position.set(x, 0, z)
  group.rotation.set(Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3)
  group.castShadow = true
  scene.add(group)
}

function createFirepit(x, z) {
  // Piedras del fogón
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const geo = new THREE.DodecahedronGeometry(0.15)
    const stone = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: 0x555555 }))
    stone.position.set(x + Math.cos(angle) * 0.4, 0.1, z + Math.sin(angle) * 0.4)
    scene.add(stone)
  }

  // Cenizas
  const ashGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 8)
  const ash = new THREE.Mesh(ashGeo, new THREE.MeshLambertMaterial({ color: 0x333333 }))
  ash.position.set(x, 0.05, z)
  scene.add(ash)
}

function createLantern(x, y, z) {
  const geo = new THREE.BoxGeometry(0.15, 0.25, 0.15)
  const mat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
  const lantern = new THREE.Mesh(geo, mat)
  lantern.position.set(x, y, z)
  scene.add(lantern)
}

placeTent(-2, -5, 0.3)
placeTent(2.5, -8, -0.5)
placeTent(-3, -12, 0.8)
placeBackpack(-1, -7, 0.5)
placeBackpack(3, -4, 1.2)
placeBackpack(0.5, -10, 0)
createFirepit(0, -7)
createLantern(-1.5, 0.3, -5)
createLantern(2, 0.3, -9)

// NOTA EN EL SUELO
const noteGeo = new THREE.BoxGeometry(0.4, 0.02, 0.5)
const noteMat = new THREE.MeshLambertMaterial({ color: 0xf5e6c8 })
export const note = new THREE.Mesh(noteGeo, noteMat)
note.position.set(0, 0.1, -155)
note.rotation.y = Math.PI * 0.1
scene.add(note)

const noteLight = new THREE.PointLight(0xffaa00, 1, 3)
noteLight.position.set(0, 1, -155)
scene.add(noteLight)