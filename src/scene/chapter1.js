import * as THREE from 'three'
import { scene } from '../core/renderer.js'

// Material base de roca
const textureLoader = new THREE.TextureLoader()

const colorMap = textureLoader.load('/rock029/Rock029_1K-JPG_Color.jpg')
const normalMap = textureLoader.load('/rock029/Rock029_1K-JPG_NormalGL.jpg')
const roughnessMap = textureLoader.load('/rock029/Rock029_1K-JPG_Roughness.jpg')

colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping
colorMap.repeat.set(2, 2)
normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
normalMap.repeat.set(2, 2)
roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping
roughnessMap.repeat.set(2, 2)

const rockMat = new THREE.MeshStandardMaterial({
  map: colorMap,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  roughness: 1,
  metalness: 0
})

// Función para crear un segmento de cueva en una posición
function createCaveSegment(offsetX, offsetZ, width, length, height) {
  // Suelo
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, length),
    new THREE.MeshStandardMaterial({ 
        map: colorMap,
        normalMap: normalMap,
        roughnessMap: roughnessMap,
        roughness: 1,
        metalness: 0
})
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(offsetX, 0, offsetZ)
  floor.receiveShadow = true
  scene.add(floor)

  // Paredes izquierda y derecha
  for (let z = offsetZ - length / 2; z < offsetZ + length / 2; z += 2.5) {
    createWallCluster(offsetX - width / 2, z, 1)
    createWallCluster(offsetX + width / 2, z, -1)
  }

  // Techo
  for (let z = offsetZ - length / 2; z < offsetZ + length / 2; z += 2) {
    for (let x = offsetX - width / 2; x <= offsetX + width / 2; x += 2.5) {
      createCeilingChunk(x + (Math.random() - 0.5), z, Math.random() * 1.2 + 0.8, height)
    }
  }
}

function createWallCluster(baseX, z, side) {
  const numBlocks = Math.floor(Math.random() * 3) + 2
  for (let i = 0; i < numBlocks; i++) {
    const geo = new THREE.DodecahedronGeometry(Math.random() * 1.2 + 0.8)
    const mesh = new THREE.Mesh(geo, rockMat)
    mesh.position.set(
      baseX + (Math.random() - 0.5) * 0.8 * side,
      Math.random() * 4,
      z + (Math.random() - 0.5) * 2
    )
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    mesh.castShadow = true
    scene.add(mesh)
  }
}

function createCeilingChunk(x, z, scale, height) {
  const geo = new THREE.DodecahedronGeometry(scale)
  const mesh = new THREE.Mesh(geo, rockMat)
  mesh.position.set(x, height - 0.5 + Math.random() * 0.5, z)
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
  mesh.castShadow = true
  scene.add(mesh)
}

// ZONA 1 - Campamento abandonado (inicio)
createCaveSegment(0, 0, 10, 20, 6)

// ZONA 2 - Túneles iniciales (más estrecho, baja)
createCaveSegment(-5, -25, 8, 20, 5)

// ZONA 3 - Galería colapsada (más ancha)
createCaveSegment(-12, -50, 14, 25, 7)

// ZONA 4 - Cámara inundada
createCaveSegment(-20, -75, 12, 20, 6)

// ZONA 5 - Campamento principal
createCaveSegment(-25, -100, 14, 20, 7)