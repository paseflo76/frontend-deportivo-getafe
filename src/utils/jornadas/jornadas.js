import { apiCatch } from '../fetch/fech.js'

export async function renderJornadas(container) {
  container.innerHTML = '' // limpiar contenido previo

  let data = []
  try {
    data = await apiCatch('/api/v2/league/matches') // llamar al backend
  } catch (err) {
    container.textContent = 'Error al cargar las jornadas'
    console.error(err)
    return
  }

  if (!data || data.length === 0) {
    container.textContent = 'No hay partidos disponibles'
    return
  }

  // Ordenar por jornada y fecha por si no vienen ordenados
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
