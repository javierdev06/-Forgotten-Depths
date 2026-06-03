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

// ── TEXTURAS PBR ──
const texLoader = new THREE.TextureLoader()

function loadPBR(folder, prefix, repeatU, repeatV) {
  const color  = texLoader.load(`/${folder}/${prefix}_Color.jpg`)
  const normal = texLoader.load(`/${folder}/${prefix}_NormalGL.jpg`)
  const rough  = texLoader.load(`/${folder}/${prefix}_Roughness.jpg`)
  ;[color, normal, rough].forEach(t => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeatU, repeatV)
  })
  return { color, normal, rough }
}

const grassTex  = loadPBR('grass004',  'Grass004_1K-JPG',  20, 20)
const barkTex   = loadPBR('bark014',   'Bark014_1K-JPG',    2,  3)
const groundTex = loadPBR('ground068', 'Ground068_1K-JPG',  6,  6)

// ── CIELO ATARDECER ──
const skyGeo = new THREE.SphereGeometry(400, 32, 32)
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    topColor:    { value: new THREE.Color(0x0a1628) },
    midColor:    { value: new THREE.Color(0xf5a020) },
    bottomColor: { value: new THREE.Color(0xffd700) },
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
        color = mix(midColor, topColor, pow(h - 0.1, 0.25));
      } else {
        color = mix(bottomColor, midColor, pow((h + 1.0) * 0.9, 0.6));
      }
      gl_FragColor = vec4(color, 1.0);
    }
  `
})
const sky = new THREE.Mesh(skyGeo, skyMat)
scene.add(sky)

// ── SOL ──
const sunGeo = new THREE.SphereGeometry(5, 16, 16)
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffe066 })
const sun = new THREE.Mesh(sunGeo, sunMat)
sun.position.set(-55, 12, -200)
scene.add(sun)

const haloGeo = new THREE.SphereGeometry(9, 16, 16)
const haloMat = new THREE.MeshBasicMaterial({ color: 0xffaa33, transparent: true, opacity: 0.18 })
const halo = new THREE.Mesh(haloGeo, haloMat)
halo.position.copy(sun.position)
scene.add(halo)

scene.fog = new THREE.FogExp2(0xf0a030, 0.008)

// ── SUELO CON GRASS ──
const groundGeo = new THREE.PlaneGeometry(200, 200, 40, 40)
const groundMat = new THREE.MeshStandardMaterial({
  map:          grassTex.color,
  normalMap:    grassTex.normal,
  roughnessMap: grassTex.rough,
  roughness: 1.0,
  metalness: 0.0,
})
const posAttr = groundGeo.attributes.position
for (let i = 0; i < posAttr.count; i++) {
  const x = posAttr.getX(i)
  const z = posAttr.getY(i)
  posAttr.setZ(i, Math.sin(x * 0.2) * 0.4 + Math.cos(z * 0.15) * 0.3)
}
groundGeo.computeVertexNormals()
const ground = new THREE.Mesh(groundGeo, groundMat)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
introGroup.add(ground)

// ── FRANJA DE TIERRA CERCA DE LA CUEVA ──
const dirtGeo = new THREE.PlaneGeometry(20, 20)
const dirtMat = new THREE.MeshStandardMaterial({
  map:          groundTex.color,
  normalMap:    groundTex.normal,
  roughnessMap: groundTex.rough,
  roughness: 1.0,
})
const dirt = new THREE.Mesh(dirtGeo, dirtMat)
dirt.rotation.x = -Math.PI / 2
dirt.position.set(0, 0.01, -12)
introGroup.add(dirt)

// ── MONTAÑAS GLB ──
const mountainLoader = new GLTFLoader()
mountainLoader.load('/mountain.glb', (gltf) => {
  const mountainTemplate = gltf.scene

  const positions = [
    { x: 0,   z: -50, s: 18 },
    { x: -22, z: -58, s: 13 },
    { x: 22,  z: -54, s: 15 },
    { x: -42, z: -65, s: 17 },
    { x: 38,  z: -62, s: 11 },
  ]
  positions.forEach((p, i) => {
    const mountain = mountainTemplate.clone()
    mountain.scale.set(p.s, p.s, p.s)
    mountain.position.set(p.x, 0, p.z)
    mountain.rotation.y = i * 1.2

    mountain.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    introGroup.add(mountain)
  })
})

// ── CUEVA GLB ──
const caveLoader = new GLTFLoader()
caveLoader.load('/cave.glb', (gltf) => {
  const cave = gltf.scene
  cave.scale.set(3, 3, 3)
  cave.position.set(0, 3, -9)
  cave.rotation.y = 0

  cave.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  introGroup.add(cave)

  // Luz cálida saliendo de la cueva
  const caveGlow = new THREE.PointLight(0xff6600, 3, 16)
  caveGlow.position.set(0, 2, -13)
  introGroup.add(caveGlow)
})






// ── ÁRBOLES GLB ──
const treeLoader = new GLTFLoader()
treeLoader.load('/trees.glb', (gltf) => {
  const treeTemplate = gltf.scene

  // Semilla fija para posiciones consistentes
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

for (let i = 0; i < 35; i++) {
    const x = (seededRandom(i * 2) - 0.5) * 70 - 5
    const z = (seededRandom(i * 2 + 1) - 0.5) * 45 + 22
    if (Math.abs(x) < 9 && z > -6) continue
    if (Math.abs(x) < 13.5 && z > -18 && z < -5) continue

    const tree = treeTemplate.clone()
    const scale = 0.25 + seededRandom(i * 3) * 0.1
    tree.scale.set(scale, scale, scale)
    tree.position.set(x, 0, z)
    tree.rotation.y = seededRandom(i * 4) * Math.PI * 2
    tree.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    introGroup.add(tree)
  }
})

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
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x4a5a3a })
  const body = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 5), bodyMat)
  body.position.set(x, 0.8, z)
  introGroup.add(body)

  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 2.5), bodyMat)
  roof.position.set(x, 1.8, z + 0.3)
  introGroup.add(roof)

  for (let wx of [-1.6, 1.6]) {
    for (let wz of [-1.5, 1.5]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8),
        new THREE.MeshLambertMaterial({ color: 0x111111 })
      )
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