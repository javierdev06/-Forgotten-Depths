import * as THREE from 'three'
import { scene } from '../core/renderer.js'

// Materiales
const floorMat = new THREE.MeshLambertMaterial({ color: 0x2a1f0f })
const wallMat = new THREE.MeshLambertMaterial({ color: 0x1a1208 })
const rockMat = new THREE.MeshLambertMaterial({ color: 0x3a3028 })

// Suelo
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 50), floorMat)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// Pared izquierda
const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(50, 6), wallMat)
wallLeft.position.set(-5, 3, 0)
wallLeft.rotation.y = Math.PI / 2
scene.add(wallLeft)

// Pared derecha
const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(50, 6), wallMat)
wallRight.position.set(5, 3, 0)
wallRight.rotation.y = -Math.PI / 2
scene.add(wallRight)

// Techo
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, 50), wallMat)
ceiling.position.set(0, 6, 0)
ceiling.rotation.x = Math.PI / 2
scene.add(ceiling)

// Rocas
function createRock(x, y, z, scale) {
  const geo = new THREE.DodecahedronGeometry(scale)
  const rock = new THREE.Mesh(geo, rockMat)
  rock.position.set(x, y, z)
  rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
  rock.castShadow = true
  scene.add(rock)
}

createRock(-3, 0.3, -5, 0.4)
createRock(3, 0.5, -10, 0.6)
createRock(-2, 0.2, -15, 0.3)
createRock(4, 0.4, -20, 0.5)
createRock(-4, 0.3, -8, 0.4)
createRock(2, 0.6, -18, 0.7)
createRock(-3, 0.3, -25, 0.5)
createRock(3, 0.4, -12, 0.3)