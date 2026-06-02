import * as THREE from 'three'
import { scene } from '../core/renderer.js'

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

// Crea un segmento de tubo como cueva sólida
function createTunnel(x, z, width, length, height) {
  // Tubo interior (BackSide para ver desde adentro)
  const geo = new THREE.CylinderGeometry(width / 2, width / 2, length, 16, 1, true)
    const mesh = new THREE.Mesh(geo, rockMat)
    mesh.rotation.x = Math.PI / 2
    mesh.position.set(x, height / 2, z) 
  scene.add(mesh)

  // Suelo
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, length),
    floorMat
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(x, 0.01, z)
  floor.receiveShadow = true
  scene.add(floor)

  // Rocas decorativas en las paredes
  for (let i = 0; i < 8; i++) {
    const geo = new THREE.DodecahedronGeometry(Math.random() * 0.8 + 0.4)
    const rock = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      roughness: 1,
      metalness: 0
    }))
    rock.position.set(
      x + (Math.random() - 0.5) * width * 0.7,
      Math.random() * 1.5,
      z + (Math.random() - 0.5) * length * 0.8
    )
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    rock.castShadow = true
    scene.add(rock)
  }
}

// ZONA 1 - Campamento abandonado
createTunnel(0, 0, 10, 20, 6)

// ZONA 2 - Túneles iniciales
createTunnel(-5, -25, 8, 20, 5)

// ZONA 3 - Galería colapsada
createTunnel(-12, -50, 14, 25, 7)

// ZONA 4 - Cámara inundada
createTunnel(-20, -75, 12, 20, 6)

// ZONA 5 - Campamento principal
createTunnel(-25, -100, 14, 20, 7)

// Conectores
createTunnel(-2.5, -12, 9, 10, 5.5)
createTunnel(-8.5, -37, 11, 10, 6)
createTunnel(-16, -62, 13, 10, 6.5)
createTunnel(-22.5, -87, 13, 10, 6.5)