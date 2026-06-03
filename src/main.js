import * as THREE from 'three'
import { scene, camera, renderer } from './core/renderer.js'
import { updatePlayer, lucasPos } from './player/player.js'
import { note, updateRockfall, chapter1Group } from './scene/chapter1.js'
import { introGroup, clearIntro, professorMixer } from './scene/intro.js'
import { startDialogue, updateDialogue } from './scene/dialogue.js'
import * as Player from './player/player.js'


// ── MENÚ PRINCIPAL ──
const mainMenu = document.getElementById('main-menu')
const btnNewGame = document.getElementById('btn-new-game')
const btnContinue = document.getElementById('btn-continue')
const btnOptions = document.getElementById('btn-options')

let gameState = 'menu'

btnNewGame.addEventListener('click', () => {
  mainMenu.style.opacity = '0'
  mainMenu.style.transition = 'opacity 1.5s'
  setTimeout(() => {
    mainMenu.style.display = 'none'
    gameState = 'intro'
  }, 1500)
})

btnContinue.addEventListener('click', () => {
  // Por ahora igual que nueva partida
  mainMenu.style.opacity = '0'
  mainMenu.style.transition = 'opacity 1.5s'
  setTimeout(() => {
    mainMenu.style.display = 'none'
    gameState = 'intro'
  }, 1500)
})

btnOptions.addEventListener('click', () => {
  alert('Opciones próximamente')
})


let gameState = 'menu'

// ── MENÚ PRINCIPAL ──
const mainMenu = document.getElementById('main-menu')

document.getElementById('btn-new-game').addEventListener('click', () => {
  mainMenu.style.opacity = '0'
  setTimeout(() => {
    mainMenu.style.display = 'none'
    gameState = 'intro'
  }, 1500)
})

document.getElementById('btn-continue').addEventListener('click', () => {
  mainMenu.style.opacity = '0'
  setTimeout(() => {
    mainMenu.style.display = 'none'
    gameState = 'intro'
  }, 1500)
})

document.getElementById('btn-options').addEventListener('click', () => {
  alert('Opciones próximamente')
})
const msgDiv = document.getElementById('wall-message')

const fadeDiv = document.createElement('div')
fadeDiv.style.cssText = `
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background: black;
  opacity: 0;
  pointer-events: none;
  z-index: 100;
  transition: opacity 1.5s;
`
document.body.appendChild(fadeDiv)



camera.position.set(0, 2, 5)
camera.lookAt(0, 2, -10)

function startGame() {
  fadeDiv.style.opacity = '1'
  setTimeout(() => {
    fadeDiv.style.opacity = '0'
    gameState = 'dialogue'
    startDialogue(() => {
      fadeDiv.style.opacity = '1'
      setTimeout(() => {
        clearIntro()
        chapter1Group.visible = true
        scene.background = new THREE.Color(0x000000)
        scene.fog = new THREE.FogExp2(0x000000, 0.08)
        lucasPos.set(0, 0.5, 5)
        camera.position.set(0, 2, 5)
        camera.lookAt(0, 2, -5)
        gameState = 'game'
        setTimeout(() => { fadeDiv.style.opacity = '0' }, 100)
      }, 1500)
    })
  }, 1000)
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && gameState === 'intro') startGame()

  if (e.code === 'KeyE' && gameState === 'game') {
    const dist = lucasPos.distanceTo(note.position)
    if (dist < 3) {
      msgDiv.style.display = msgDiv.style.display === 'none' ? 'block' : 'none'
      if (msgDiv.style.display === 'block') document.exitPointerLock()
    }
  }
})

function animate() {
  requestAnimationFrame(animate)
  if (professorMixer) professorMixer.update(0.016)

  if (gameState === 'dialogue' || gameState === 'intro') {
    if (Player.mixer) Player.mixer.update(0.016)
    if (professorMixer) professorMixer.update(0.016)
  }

  if (gameState === 'dialogue') {
    updateDialogue(16)
  }

  

  if (gameState === 'game') {
    updatePlayer()
    updateRockfall(performance.now())
    note.rotation.y += 0.01
    const dist = lucasPos.distanceTo(note.position)
    document.getElementById('interact-prompt').style.display =
      dist < 3 && msgDiv.style.display === 'none' ? 'block' : 'none'
  }

  renderer.render(scene, camera)
}
animate()