import { scene, camera, renderer } from './core/renderer.js'
import { updatePlayer } from './player/player.js'
import './scene/cave.js'

// Game loop
function animate() {
  requestAnimationFrame(animate)
  updatePlayer()
  renderer.render(scene, camera)
}

animate()