import { scene, camera, renderer } from './core/renderer.js'
import { updatePlayer, lucasPos } from './player/player.js'
import { note, updateRockfall } from './scene/chapter1.js'

// Estado del juego
let gameState = 'intro' // 'intro' | 'game'

// Cargar escena según estado
async function loadIntro() {
  await import('./scene/intro.js')
}

loadIntro()

const msgDiv = document.getElementById('wall-message')

window.addEventListener('keydown', (e) => {
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