import { apiCatch } from './data.js'

export async function renderJornadas(container) {
  container.innerHTML = ''
  let data = []

  try {
    data = await apiCatch('/api/v2/league/matches')
  } catch (err) {
    container.textContent = 'Error al cargar las jornadas'
    console.error(err)
    return
  }

  if (!data || data.length === 0) {
    container.textContent = 'No hay partidos disponibles'
    return
  }

  // Ordenar por jornada y fecha
  data.sort((a, b) => {
    if (a.jornada !== b.jornada) return a.jornada - b.jornada
    return new Date(a.fecha) - new Date(b.fecha)
  })

  // Agrupar partidos por jornada
  const jornadasMap = {}
  data.forEach((m) => {
    if (!jornadasMap[m.jornada]) jornadasMap[m.jornada] = []
    jornadasMap[m.jornada].push(m)
  })

  // Renderizar cada jornada completa
  Object.entries(jornadasMap).forEach(([num, matches]) => {
    const jornadaDiv = document.createElement('div')
    jornadaDiv.className = 'jornada-list'
    container.appendChild(jornadaDiv)

    const h2 = document.createElement('h2')
    h2.textContent = `Jornada ${num}`
    jornadaDiv.appendChild(h2)

    // Tomar la fecha del primer partido de la jornada
    const fechaJornada = matches[0]?.fecha
      ? new Date(matches[0].fecha).toLocaleDateString('es-ES')
      : 'Fecha sin definir'

    const fechaDiv = document.createElement('div')
    fechaDiv.className = 'fecha'
    fechaDiv.textContent = `Fecha: ${fechaJornada}`
    jornadaDiv.appendChild(fechaDiv)

    matches.forEach((m) => {
      const partidoDiv = document.createElement('div')
      partidoDiv.className = 'partido'

      if (m.descansa) {
        partidoDiv.textContent = `Descansa: ${m.descansa}`
      } else {
        const local = m.local ?? 'Local'
        const visitante = m.visitante ?? 'Visitante'
        const golesLocal = m.golesLocal ?? '-'
        const golesVisitante = m.golesVisitante ?? '-'
        partidoDiv.textContent = `${local} ${golesLocal} - ${golesVisitante} ${visitante}`
      }

      jornadaDiv.appendChild(partidoDiv)
    })
  })
}
