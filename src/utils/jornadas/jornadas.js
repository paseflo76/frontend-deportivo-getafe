import { apiCatch } from '../fetch/fech'

export async function renderJornadas(containerId) {
  const data = await apiCatch('/v2/Match/matches')

  const container = document.getElementById(containerId)
  container.innerHTML = ''

  let current = null
  data.forEach((m) => {
    if (m.jornada !== current) {
      current = m.jornada
      const h3 = document.createElement('h2')
      h3.textContent = `Jornada ${current}`
      container.appendChild(h3)
    }
    const div = document.createElement('div')
    const score = (m.golesLocal ?? '-') + ' - ' + (m.golesVisitante ?? '-')
    div.textContent = `${m.local} ${score} ${m.visitante}`
    container.appendChild(div)
  })
}
