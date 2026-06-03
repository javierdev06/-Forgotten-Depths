import * as THREE from 'three'
import { camera } from '../core/renderer.js'
import * as Player from '../player/player.js'
import * as Intro from '../scene/intro.js'

const CAM_POSITIONS = {
  wide:      { pos: new THREE.Vector3(0, 3, 6),    look: new THREE.Vector3(0, 1, -8)   },
  lucas:     { pos: new THREE.Vector3(-1.5, 2, 1), look: new THREE.Vector3(2, 1.5, -1) },
  professor: { pos: new THREE.Vector3(3.5, 2, 1),  look: new THREE.Vector3(1, 1.5, -1) },
  cave:      { pos: new THREE.Vector3(0, 4, 2),    look: new THREE.Vector3(0, 2, -12)  },
}

const LUCAS_POS     = new THREE.Vector3(0, 0, 0)
const PROFESSOR_POS = new THREE.Vector3(2, 0, -0.5)

const DIALOGUE = [
  { speaker: 'Profesor Martínez', text: 'Lucas... ¿ves todo esto?',                                                               cam: 'professor', duration: 3500 },
  { speaker: 'Lucas',             text: 'Sí. Parece que se fueron con mucha prisa.',                                              cam: 'lucas',     duration: 4000 },
  { speaker: 'Profesor Martínez', text: 'Ese es justamente el problema. No se fueron.',                                           cam: 'professor', duration: 4500 },
  { speaker: 'Lucas',             text: '¿Está seguro?',                                                                          cam: 'lucas',     duration: 2500 },
  { speaker: 'Profesor Martínez', text: 'Cuarenta y dos personas entraron a esta montaña hace tres meses. Ninguna volvió a salir.', cam: 'professor', duration: 6000 },
  { speaker: 'Lucas',             text: 'Las autoridades dijeron que probablemente murieron durante un derrumbe.',                 cam: 'lucas',     duration: 5000 },
  { speaker: 'Profesor Martínez', text: 'Y yo digo que se equivocan.',                                                            cam: 'professor', duration: 3500 },
  { speaker: 'Profesor Martínez', text: '[Le entrega un viejo cuaderno]',                                                         cam: 'wide',      duration: 3000 },
  { speaker: 'Profesor Martínez', text: 'Este fue el último informe que recibimos de la expedición.',                             cam: 'professor', duration: 5000 },
  { speaker: 'Lucas',             text: '"Las estructuras continúan descendiendo más allá de lo esperado..."',                    cam: 'lucas',     duration: 5000 },
  { speaker: 'Lucas',             text: '"Creemos haber encontrado evidencia de una civilización desconocida..."',                cam: 'lucas',     duration: 5000 },
  { speaker: 'Profesor Martínez', text: 'Sigue leyendo.',                                                                         cam: 'professor', duration: 2500 },
  { speaker: 'Lucas',             text: '"...hemos descubierto una puerta sellada bajo la montaña."',                             cam: 'lucas',     duration: 5000 },
  { speaker: 'Lucas',             text: '"...mañana intentaremos abrirla."',                                                      cam: 'lucas',     duration: 3500 },
  { speaker: 'Lucas',             text: 'No hay más.',                                                                            cam: 'lucas',     duration: 2500 },
  { speaker: 'Profesor Martínez', text: 'Porque esa fue la última comunicación.',                                                 cam: 'professor', duration: 4000 },
  { speaker: 'Lucas',             text: '¿Y cree que todo comenzó cuando abrieron esa puerta?',                                   cam: 'lucas',     duration: 4500 },
  { speaker: 'Profesor Martínez', text: 'No lo sé.',                                                                              cam: 'professor', duration: 2500 },
  { speaker: 'Profesor Martínez', text: 'Pero sé que algo ocurrió ahí abajo.',                                                    cam: 'professor', duration: 4000 },
  { speaker: 'Lucas',             text: 'Entonces encontraremos respuestas.',                                                     cam: 'lucas',     duration: 3500 },
  { speaker: 'Profesor Martínez', text: 'Eso espero.',                                                                            cam: 'professor', duration: 2500 },
  { speaker: 'Profesor Martínez', text: 'Lucas...',                                                                               cam: 'professor', duration: 2000 },
  { speaker: 'Lucas',             text: '¿Sí?',                                                                                   cam: 'lucas',     duration: 2000 },
  { speaker: 'Profesor Martínez', text: 'Si encuentras algo extraño... cualquier cosa... no tomes riesgos innecesarios.',         cam: 'professor', duration: 6000 },
  { speaker: 'Lucas',             text: 'Tranquilo, profesor. Solo entraré, investigaré y volveré a salir.',                      cam: 'lucas',     duration: 5000 },
  { speaker: 'Profesor Martínez', text: 'Eso mismo dijeron ellos.',                                                               cam: 'professor', duration: 3500 },
  { speaker: 'Lucas',             text: 'Volveré antes de que oscurezca.',                                                        cam: 'lucas',     duration: 3500 },
  { speaker: 'Profesor Martínez', text: 'Te estaré esperando.',                                                                   cam: 'professor', duration: 3000 },
  { speaker: 'Lucas',             text: 'Nos vemos en unas horas.',                                                               cam: 'lucas',     duration: 3500 },
  { speaker: 'Profesor Martínez', text: 'Buena suerte.',                                                                          cam: 'professor', duration: 2500 },
  { speaker: '',                  text: '[Lucas entra lentamente en la oscuridad de la cueva]',                                   cam: 'cave',      duration: 4000 },
]

// ── UI ──
const subtitleBox = document.createElement('div')
subtitleBox.style.cssText = `
  position: fixed; bottom: 80px; left: 50%;
  transform: translateX(-50%);
  max-width: 800px; width: 90%;
  text-align: center; pointer-events: none;
  z-index: 50; opacity: 0; transition: opacity 0.4s;
`
document.body.appendChild(subtitleBox)

const speakerEl = document.createElement('div')
speakerEl.style.cssText = `
  font-family: 'Georgia', serif; font-size: 16px; font-weight: bold;
  color: #ffcc44; text-shadow: 0 0 8px rgba(0,0,0,0.9);
  margin-bottom: 6px; letter-spacing: 1px;
`

const textEl = document.createElement('div')
textEl.style.cssText = `
  font-family: 'Georgia', serif; font-size: 20px; color: #ffffff;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8);
  line-height: 1.5; background: rgba(0,0,0,0.35);
  padding: 10px 20px; border-radius: 6px;
`
subtitleBox.appendChild(speakerEl)
subtitleBox.appendChild(textEl)

// ── CÁMARA ──
let currentCamPos = new THREE.Vector3()
let currentCamLook = new THREE.Vector3()
let targetCamPos = new THREE.Vector3()
let targetCamLook = new THREE.Vector3()

function setCameraTarget(camName) {
  const c = CAM_POSITIONS[camName]
  targetCamPos.copy(c.pos)
  targetCamLook.copy(c.look)
}

let currentSpeaker = ''

function updateCharacters(delta) {
  const lucasModel = Player.lucasModel
  const professorModel = Intro.professorModel

  if (!lucasModel || !professorModel) return

  const lucasTargetRY = currentSpeaker === 'Lucas' ? Math.PI + 0.3 : 0.3
  lucasModel.rotation.y += (lucasTargetRY - lucasModel.rotation.y) * 0.05
  lucasModel.position.x = LUCAS_POS.x
  lucasModel.position.z = LUCAS_POS.z

  const profTargetRY = currentSpeaker === 'Profesor Martínez' ? -1.2 : -0.8
  professorModel.rotation.y += (profTargetRY - professorModel.rotation.y) * 0.05
  professorModel.position.x = PROFESSOR_POS.x
  professorModel.position.z = PROFESSOR_POS.z
}

// ── ESTADO ──
let dialogueIndex = 0
let dialogueTimer = 0
let dialogueActive = false
let onDialogueEnd = null

export function startDialogue(onEnd) {
  if (Intro.professorMixer) Intro.professorMixer.timeScale = 1
  if (Player.mixer) Player.mixer.timeScale = 1

  dialogueActive = true
  dialogueIndex = 0
  dialogueTimer = 0
  onDialogueEnd = onEnd

  const first = DIALOGUE[0]
  currentCamPos.copy(CAM_POSITIONS[first.cam].pos)
  currentCamLook.copy(CAM_POSITIONS[first.cam].look)
  setCameraTarget(first.cam)
  showLine(first)
}

function showLine(line) {
  speakerEl.textContent = line.speaker
  textEl.textContent = line.text
  subtitleBox.style.opacity = '1'
  setCameraTarget(line.cam)
  currentSpeaker = line.speaker
}

function hideLine() {
  subtitleBox.style.opacity = '0'
}

export function updateDialogue(delta) {
  if (!dialogueActive) return

  currentCamPos.lerp(targetCamPos, 0.03)
  currentCamLook.lerp(targetCamLook, 0.03)
  camera.position.copy(currentCamPos)
  camera.lookAt(currentCamLook)

  updateCharacters(delta)

  dialogueTimer += delta

  const current = DIALOGUE[dialogueIndex]
  if (dialogueTimer >= current.duration) {
    dialogueTimer = 0
    dialogueIndex++

    if (dialogueIndex >= DIALOGUE.length) {
      dialogueActive = false
      hideLine()
      if (onDialogueEnd) onDialogueEnd()
      return
    }

    showLine(DIALOGUE[dialogueIndex])
  }
}