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

// Segmentos de cueva: cada uno va hacia adelante en Z
const segments = [
  { z: 0,    radius: 5,  length: 25 },
  { z: -20,  radius: 4,  length: 25 },
  { z: -40,  radius: 4.5,length: 25 },
  { z: -60,  radius: 5,  length: 25 },
  { z: -80,  radius: 6,  length: 25 },
  { z: -100, radius: 5,  length: 25 },
  { z: -120, radius: 5,  length: 25 },
  { z: -140, radius: 4,  length: 25 },
  { z: -160, radius: 6,  length: 25 },
]

segments.forEach(seg => {
  // Tubo principal
  const geo = new THREE.CylinderGeometry(seg.radius, seg.radius, seg.length, 16, 1, true)
  const mesh = new THREE.Mesh(geo, rockMat)
  mesh.rotation.x = Math.PI / 2
  mesh.position.set(0, seg.radius * 0.6, seg.z)
  scene.add(mesh)

  // Suelo plano
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(seg.radius * 1.8, seg.length),
    floorMat
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0.01, seg.z)
  scene.add(floor)

  // Rocas decorativas
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

  // DERRUMBE - Entrada bloqueada detrás de Lucas
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

    // CAMPAMENTO ABANDONADO - Zona 1
    function createTent(x, z) {
    // Base de la tienda
    const geo = new THREE.ConeGeometry(1.5, 2, 4)
    const mat = new THREE.MeshLambertMaterial({ color: 0x4a6741 })
    const tent = new THREE.Mesh(geo, mat)
    tent.position.set(x, 1, z)
    tent.rotation.y = Math.PI / 4
    tent.castShadow = true
    scene.add(tent)
    }

    function createBackpack(x, z) {
    const geo = new THREE.BoxGeometry(0.4, 0.6, 0.3)
    const mat = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
    const pack = new THREE.Mesh(geo, mat)
    pack.position.set(x, 0.3, z)
    pack.rotation.y = Math.random() * Math.PI
    pack.castShadow = true
    scene.add(pack)
    }

    createTent(-2, -5)
    createTent(2, -8)
    createBackpack(-1, -6)
    createBackpack(3, -4)
    createBackpack(0, -10)
})