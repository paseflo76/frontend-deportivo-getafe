// utils/jornadas/jornadas.js
import { apiCatch } from '../fetch/fech.js'

export async function renderJornadas(container) {
  // recibe elemento DOM
  container.innerHTML = ''
  let data = []
  try {
    data = await apiCatch('/api/v2/match/matches')
  } catch (err) {
    container.textContent = 'Error al cargar las jornadas'
    console.error(err)
    return
  }

  let current = null
  data.forEach((m) => {
    if (m.jornada !== current) {
      current = m.jornada
      const h2 = document.createElement('h2')
      h2.textContent = `Jornada ${current}`
      container.appendChild(h2)
    }
    const div = document.createElement('div')
    const score = (m.golesLocal ?? '-') + ' - ' + (m.golesVisitante ?? '-')
    div.textContent = `${m.local} ${score} ${m.visitante}`
    container.appendChild(div)
  })
}
