import * as THREE from 'three'
import { scene } from '../core/renderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

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

export const chapter1Group = new THREE.Group()
chapter1Group.visible = false
scene.add(chapter1Group)

const segments = [
  { z: 20,   radius: 5, length: 25 },
  { z: 0,    radius: 5, length: 25 },
  { z: -20,  radius: 5, length: 25 },
  { z: -40,  radius: 5, length: 25 },
  { z: -60,  radius: 5, length: 25 },
  { z: -80,  radius: 5, length: 25 },
  { z: -100, radius: 5, length: 25 },
  { z: -120, radius: 5, length: 25 },
  { z: -140, radius: 5, length: 25 },
  { z: -160, radius: 5, length: 25 },
  { z: -180, radius: 5, length: 25 },
]

segments.forEach(seg => {
  const geo = new THREE.CylinderGeometry(seg.radius, seg.radius, seg.length, 16, 1, true)
  const mesh = new THREE.Mesh(geo, rockMat)
  mesh.rotation.x = Math.PI / 2
  mesh.position.set(0, seg.radius * 0.6, seg.z)
  chapter1Group.add(mesh)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(seg.radius * 1.8, seg.length),
    floorMat
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0.01, seg.z)
  chapter1Group.add(floor)

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
    chapter1Group.add(rock)
  }
})

// DERRUMBE
const fallingRocks = []

function createRockfall() {
  for (let i = 0; i < 60; i++) {
    const size = Math.random() * 1.5 + 0.5
    const geo = new THREE.DodecahedronGeometry(size)
    const rock = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      roughness: 1,
      metalness: 0
    }))
    const x = (Math.random() - 0.5) * 10
    const finalY = Math.random() * 5 + 1
    const z = 6 + Math.random() * 5
    rock.position.set(x, 20, z)
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    rock.castShadow = true
    chapter1Group.add(rock)
    fallingRocks.push({ mesh: rock, finalY, speed: Math.random() * 0.3 + 0.1, falling: true, delay: Math.random() * 2000 })
  }
}

export function updateRockfall(time) {
  fallingRocks.forEach(rock => {
    if (time < rock.delay) return
    if (!rock.falling) return
    rock.mesh.position.y -= rock.speed
    rock.mesh.rotation.x += 0.05
    rock.mesh.rotation.z += 0.03
    if (rock.mesh.position.y <= rock.finalY) {
      rock.mesh.position.y = rock.finalY
      rock.falling = false
    }
  })
}

createRockfall()

// CAMPAMENTO
function placeTent(x, z, rotY = 0) {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('/tent.glb', (gltf) => {
    const tent = gltf.scene
    tent.scale.set(0.2, 0.2, 0.2)
    tent.position.set(x, 0, z)
    tent.rotation.y = rotY
    tent.castShadow = true
    chapter1Group.add(tent)
  })
}

function placeBackpack(x, z, rotY = 0) {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('/backpack.glb', (gltf) => {
    const pack = gltf.scene
    pack.scale.set(0.8, 0.8, 0.8)
    pack.position.set(x, 0.3, z)
    pack.rotation.y = rotY
    pack.castShadow = true
    chapter1Group.add(pack)
  })
}

function createFirepit(x, z) {
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const geo = new THREE.DodecahedronGeometry(0.15)
    const stone = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: 0x555555 }))
    stone.position.set(x + Math.cos(angle) * 0.4, 0.1, z + Math.sin(angle) * 0.4)
    chapter1Group.add(stone)
  }
  const ashGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 8)
  const ash = new THREE.Mesh(ashGeo, new THREE.MeshLambertMaterial({ color: 0x333333 }))
  ash.position.set(x, 0.05, z)
  chapter1Group.add(ash)
}

function createLantern(x, y, z) {
  const geo = new THREE.BoxGeometry(0.15, 0.25, 0.15)
  const mat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
  const lantern = new THREE.Mesh(geo, mat)
  lantern.position.set(x, y, z)
  chapter1Group.add(lantern)
}

placeTent(-2, -5, 0.3)
placeTent(2.5, -8, -0.5)
placeTent(-3, -12, 0.8)
placeBackpack(-1, -8, 0.5)
placeBackpack(3, -4, 1.2)
placeBackpack(0.5, -10, 0)
createFirepit(0, -7)
createLantern(-1.5, 0.3, -5)
createLantern(2, 0.3, -9)

// NOTA
const noteGeo = new THREE.BoxGeometry(0.4, 0.02, 0.5)
const noteMat = new THREE.MeshLambertMaterial({ color: 0xf5e6c8 })
export const note = new THREE.Mesh(noteGeo, noteMat)
note.position.set(0, 0.1, -155)
note.rotation.y = Math.PI * 0.1
chapter1Group.add(note)

const noteLight = new THREE.PointLight(0xffaa00, 1, 3)
noteLight.position.set(0, 1, -155)
chapter1Group.add(noteLight)