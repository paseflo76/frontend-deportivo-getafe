import './jornadas.css'
import { renderJornadas as renderFromAPI } from '../../utils/apiRenderJornadas.js'

export async function Calendario() {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''

  const container = document.createElement('div')
  container.id = 'calendario'
  main.appendChild(container)

  await renderFromAPI(container)

  // Escuchar actualizaciones desde Clasificacion
  if (!window._jornadasListener) {
    window._jornadasListener = async () => {
      await renderFromAPI(container)
    }
    window.addEventListener('resultadosUpdated', window._jornadasListener)
  }
}
