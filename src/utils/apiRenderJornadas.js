import { API_BASE } from './data.js'

export async function renderJornadas(container) {
  container.innerHTML = ''

  let data = []
  try {
    const res = await fetch(`${API_BASE}/matches`)
    if (!res.ok) throw new Error('Error al cargar las jornadas')
    data = await res.json()
  } catch (err) {
    container.textContent = 'Error al cargar las jornadas'
    console.error(err)
    return
  }

  if (!data || data.length === 0) {
    container.textContent = 'No hay partidos disponibles'
    return
  }

  data.sort((a, b) => {
    if (a.jornada !== b.jornada) return a.jornada - b.jornada
    return new Date(a.fecha) - new Date(b.fecha)
  })

  let currentJornada = null
  data.forEach((m) => {
    if (m.jornada !== currentJornada) {
      currentJornada = m.jornada
      const h2 = document.createElement('h2')
      h2.textContent = `Jornada ${currentJornada}`
      container.appendChild(h2)
    }

    const matchDiv = document.createElement('div')
    const local = m.local ?? 'Local'
    const visitante = m.visitante ?? 'Visitante'
    const golesLocal = m.golesLocal ?? '-'
    const golesVisitante = m.golesVisitante ?? '-'

    matchDiv.textContent = `${local} ${golesLocal} - ${golesVisitante} ${visitante}`
    container.appendChild(matchDiv)
  })
}
