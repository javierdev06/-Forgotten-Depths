import * as THREE from 'three'
import { scene } from '../core/renderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export const introGroup = new THREE.Group()
scene.add(introGroup)

const gltfLoader = new GLTFLoader()
export let professorMixer = null

gltfLoader.load('/professor.glb', (gltf) => {
  console.log('profesor cargado')
  const professor = gltf.scene
  professor.scale.set(1, 1, 1)
  professor.position.set(2, 0, -0.5)
  professor.rotation.y = -1
  introGroup.add(professor)

  if (gltf.animations.length > 0) {
    professorMixer = new THREE.AnimationMixer(professor)
    const idle = professorMixer.clipAction(gltf.animations[0])
    idle.play()
  }
}, undefined, (error) => {
  console.error('error cargando profesor:', error)
})

// ── CIELO ATARDECER NARANJA/AMARILLO ──
const skyGeo = new THREE.SphereGeometry(400, 32, 32)
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    topColor:    { value: new THREE.Color(0x1a2a6c) },
    midColor:    { value: new THREE.Color(0xe8821a) },
    bottomColor: { value: new THREE.Color(0xffd060) },
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 midColor;
    uniform vec3 bottomColor;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize(vWorldPosition).y;
      vec3 color;
      if (h > 0.1) {
        color = mix(midColor, topColor, pow(h - 0.1, 0.4));
      } else {
        color = mix(bottomColor, midColor, pow((h + 1.0) * 0.9, 0.6));
      }
      gl_FragColor = vec4(color, 1.0);
    }
  `
})
const sky = new THREE.Mesh(skyGeo, skyMat)
scene.add(sky)

// ── SOL CAYENDO ──
const sunGeo = new THREE.SphereGeometry(5, 16, 16)
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffe066 })
const sun = new THREE.Mesh(sunGeo, sunMat)
sun.position.set(-55, 12, -200)
scene.add(sun)

// Halo del sol
const haloGeo = new THREE.SphereGeometry(9, 16, 16)
const haloMat = new THREE.MeshBasicMaterial({
  color: 0xffaa33,
  transparent: true,
  opacity: 0.18
})
const halo = new THREE.Mesh(haloGeo, haloMat)
halo.position.copy(sun.position)
scene.add(halo)

// Niebla cálida naranja suave
scene.fog = new THREE.FogExp2(0xdd8833, 0.010)

// ── SUELO ──
const groundGeo = new THREE.PlaneGeometry(200, 200, 30, 30)
const groundMat = new THREE.MeshLambertMaterial({ color: 0x2a3d15 })

const pos = groundGeo.attributes.position
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i)
  const z = pos.getY(i)
  const y = Math.sin(x * 0.2) * 0.4 + Math.cos(z * 0.15) * 0.3
  pos.setZ(i, y)
}
groundGeo.computeVertexNormals()

const ground = new THREE.Mesh(groundGeo, groundMat)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
introGroup.add(ground)

// ── MONTAÑAS ──
function createMountain(x, z, scale) {
  const geo = new THREE.ConeGeometry(scale, scale * 1.5, 8)
  const mat = new THREE.MeshLambertMaterial({ color: 0x4a3828 })
  const mountain = new THREE.Mesh(geo, mat)
  mountain.position.set(x, scale * 0.75, z)
  mountain.castShadow = true
  introGroup.add(mountain)

  const geo2 = new THREE.ConeGeometry(scale * 0.6, scale * 0.8, 8)
  const mat2 = new THREE.MeshLambertMaterial({ color: 0x332518 })
  const peak = new THREE.Mesh(geo2, mat2)
  peak.position.set(x, scale * 1.3, z)
  introGroup.add(peak)
}

createMountain(0, -30, 25)
createMountain(-20, -40, 15)
createMountain(20, -35, 18)
createMountain(-40, -50, 20)
createMountain(35, -45, 12)

// ── ENTRADA DE LA CUEVA ──
function createCaveEntrance() {
  const rockMat = new THREE.MeshLambertMaterial({ color: 0x3a2e1a })

  const rockLGeo = new THREE.BoxGeometry(4, 10, 3)
  const rockL = new THREE.Mesh(rockLGeo, rockMat)
  rockL.position.set(-4.5, 5, -15)
  introGroup.add(rockL)

  const rockR = new THREE.Mesh(rockLGeo, rockMat)
  rockR.position.set(4.5, 5, -15)
  introGroup.add(rockR)

  const topGeo = new THREE.BoxGeometry(11, 3, 3)
  const top = new THREE.Mesh(topGeo, rockMat)
  top.position.set(0, 10.5, -15)
  introGroup.add(top)

  const darkGeo = new THREE.PlaneGeometry(7, 9)
  const darkMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const dark = new THREE.Mesh(darkGeo, darkMat)
  dark.position.set(0, 5, -14.4)
  introGroup.add(dark)

  // Luz cálida saliendo de la cueva
  const caveGlow = new THREE.PointLight(0xff6600, 2, 14)
  caveGlow.position.set(0, 3, -13)
  introGroup.add(caveGlow)
}

createCaveEntrance()

// ── ÁRBOLES ──
function createTree(x, z) {
  const h = 0.8 + Math.random() * 0.6

  const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 2.5 * h, 6)
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3a2008 })
  const trunk = new THREE.Mesh(trunkGeo, trunkMat)
  trunk.position.set(x, 1.25 * h, z)
  introGroup.add(trunk)

  const colors = [0x1a3d10, 0x1f4d12, 0x153008]
  const sizes  = [2.2, 1.6, 1.0]
  const yOff   = [2.2, 3.5, 4.6]

  for (let i = 0; i < 3; i++) {
    const leavesGeo = new THREE.ConeGeometry(sizes[i] * h, 2.2 * h, 7)
    const leavesMat = new THREE.MeshLambertMaterial({ color: colors[i] })
    const leaves = new THREE.Mesh(leavesGeo, leavesMat)
    leaves.position.set(x, yOff[i] * h, z)
    introGroup.add(leaves)
  }
}

for (let i = 0; i < 40; i++) {
  const x = (Math.random() - 0.5) * 100
  const z = (Math.random() - 0.5) * 50 - 10
  if (Math.abs(x) > 10 || z > -5) createTree(x, z)
}

// ── ILUMINACIÓN ──
const sunLight = new THREE.DirectionalLight(0xffcc66, 2.0)
sunLight.position.set(-55, 12, -100)
sunLight.castShadow = true
introGroup.add(sunLight)

const skyLight = new THREE.DirectionalLight(0x6688bb, 0.3)
skyLight.position.set(10, 30, 10)
introGroup.add(skyLight)

const ambientLight = new THREE.AmbientLight(0xffaa44, 0.5)
introGroup.add(ambientLight)

// ── JEEPS ──
function createJeep(x, z) {
  const bodyGeo = new THREE.BoxGeometry(3, 1.2, 5)
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4a5a3a })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.set(x, 0.8, z)
  introGroup.add(body)

  const roofGeo = new THREE.BoxGeometry(2.5, 0.8, 2.5)
  const roof = new THREE.Mesh(roofGeo, bodyMat)
  roof.position.set(x, 1.8, z + 0.3)
  introGroup.add(roof)

  for (let wx of [-1.6, 1.6]) {
    for (let wz of [-1.5, 1.5]) {
      const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8)
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111111 })
      const wheel = new THREE.Mesh(wheelGeo, wheelMat)
      wheel.position.set(x + wx, 0.4, z + wz)
      wheel.rotation.z = Math.PI / 2
      introGroup.add(wheel)
    }
  }
}

createJeep(-6, -8)
createJeep(7, -10)

export function clearIntro() {
  introGroup.visible = false
  scene.background = new THREE.Color(0x000000)
  scene.fog = new THREE.FogExp2(0x000000, 0.08)
}