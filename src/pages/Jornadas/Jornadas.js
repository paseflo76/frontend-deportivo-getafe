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
}
