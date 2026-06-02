import { scene, camera, renderer } from './core/renderer.js'
import { note, updateRockfall } from './scene/chapter1.js'
import { updatePlayer, lucasPos } from './player/player.js'

const msgDiv = document.getElementById('wall-message')
const interactPrompt = document.getElementById('interact-prompt')

let noteOpen = false

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE') {
    const dist = lucasPos.distanceTo(note.position)
    if (dist < 3 && !noteOpen) {
      noteOpen = true
      msgDiv.style.display = 'block'
      document.exitPointerLock()
    } else if (noteOpen) {
      noteOpen = false
      msgDiv.style.display = 'none'
    }
  }
})

function animate() {
  requestAnimationFrame(animate)
  updatePlayer()
  updateRockfall(performance.now())

  // Rotar nota levemente para que llame la atención
  note.rotation.y += 0.01

  // Mostrar prompt si está cerca
  const dist = lucasPos.distanceTo(note.position)
  if (dist < 3 && !noteOpen) {
    document.getElementById('interact-prompt').style.display = 'block'
  } else {
    document.getElementById('interact-prompt').style.display = 'none'
  }

  renderer.render(scene, camera)
}

animate()