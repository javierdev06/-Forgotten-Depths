import * as THREE from 'three'
import { scene } from '../core/renderer.js'

// Textura de roca generada proceduralmente
const canvas = document.createElement('canvas')
canvas.width = 256
canvas.height = 256
const ctx = canvas.getContext('2d')

ctx.fillStyle = '#3a3028'
ctx.fillRect(0, 0, 256, 256)

for (let i = 0; i < 2000; i++) {
  const x = Math.random() * 256
  const y = Math.random() * 256
  const r = Math.random() * 3
  const brightness = Math.floor(Math.random() * 40 + 30)
  ctx.fillStyle = `rgb(${brightness}, ${brightness - 5}, ${brightness - 10})`
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

const stoneTexture = new THREE.CanvasTexture(canvas)
stoneTexture.wrapS = stoneTexture.wrapT = THREE.RepeatWrapping
stoneTexture.repeat.set(4, 4)

// Materiales
const floorMat = new THREE.MeshStandardMaterial({ 
  map: stoneTexture,
  roughness: 1,
  metalness: 0
})

const rockMat = new THREE.MeshStandardMaterial({ 
  color: 0x6b4c2a,
  roughness: 1,
  metalness: 0
})

// Suelo
const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 60), floorMat)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// Techo irregular
function createCeilingChunk(x, z, scale) {
  const geo = new THREE.DodecahedronGeometry(scale)
  const mesh = new THREE.Mesh(geo, rockMat)
  mesh.position.set(x, 5.5 + Math.random() * 0.5, z)
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
  mesh.castShadow = true
  scene.add(mesh)
}

for (let z = 2; z > -50; z -= 2) {
  for (let x = -5; x <= 5; x += 2.5) {
    createCeilingChunk(x + (Math.random() - 0.5), z, Math.random() * 1.2 + 0.8)
  }
}

// Paredes orgánicas
function createWallCluster(baseX, z, side) {
  const numBlocks = Math.floor(Math.random() * 3) + 3
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
    mesh.receiveShadow = true
    scene.add(mesh)
  }
}

for (let z = 2; z > -50; z -= 2.5) {
  createWallCluster(-5, z, 1)
  createWallCluster(5, z, -1)
}

// Rocas en el suelo
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

// Estalactitas
function createStalactite(x, z, height) {
  const geo = new THREE.ConeGeometry(0.2, height, 6)
  const mesh = new THREE.Mesh(geo, rockMat)
  mesh.position.set(x, 6 - height / 2, z)
  mesh.rotation.x = Math.PI
  mesh.castShadow = true
  scene.add(mesh)
}

// Estalagmitas
function createStalagmite(x, z, height) {
  const geo = new THREE.ConeGeometry(0.15, height, 6)
  const mesh = new THREE.Mesh(geo, rockMat)
  mesh.position.set(x, height / 2, z)
  mesh.castShadow = true
  scene.add(mesh)
}

for (let z = -2; z > -45; z -= 3) {
  createStalactite((Math.random() - 0.5) * 7, z, Math.random() * 2 + 1)
  if (Math.random() > 0.5) createStalagmite((Math.random() - 0.5) * 7, z, Math.random() * 1.5 + 0.5)
}

// Cristales
function createCrystal(x, y, z, color) {
  const geo = new THREE.ConeGeometry(0.1, Math.random() * 0.8 + 0.4, 5)
  const mat = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.5,
    roughness: 0.1,
    metalness: 0.8
  })
  const crystal = new THREE.Mesh(geo, mat)
  crystal.position.set(x, y, z)
  crystal.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5)
  scene.add(crystal)

  const light = new THREE.PointLight(color, 0.8, 4)
  light.position.set(x, y, z)
  scene.add(light)
}

createCrystal(-4, 0.5, -12, 0x4444ff)
createCrystal(3, 0.5, -20, 0x44ffaa)
createCrystal(-3, 0.5, -30, 0x8844ff)
createCrystal(4, 1, -18, 0x44ffaa)
createCrystal(-2, 0.5, -25, 0x4444ff)