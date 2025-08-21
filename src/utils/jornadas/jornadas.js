// utils/jornadas/jornadas.js
import { apiCatch } from '../fetch/fech.js'

export async function renderJornadas(container) {
  container.innerHTML = ''
  const data = await apiCatch('/v2/Match/matches')

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
