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

  data.sort((a, b) => {
    if (a.jornada !== b.jornada) return a.jornada - b.jornada
    return parseFecha(a.fecha) - parseFecha(b.fecha)
  })

  const jornadasMap = {}
  data.forEach((m) => {
    if (!jornadasMap[m.jornada]) jornadasMap[m.jornada] = []
    jornadasMap[m.jornada].push(m)
  })

  Object.entries(jornadasMap).forEach(([num, matches]) => {
    const jornadaDiv = document.createElement('div')
    jornadaDiv.className = 'jornada-list'
    container.appendChild(jornadaDiv)

    const h2 = document.createElement('h2')
    h2.textContent = `Jornada ${num}`
    jornadaDiv.appendChild(h2)

    const fechaJornada = matches[0]?.fecha
      ? formatearFecha(matches[0].fecha)
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

// --- Funciones auxiliares para parsear y mostrar fechas ---
function parseFecha(f) {
  if (!f) return new Date(0)
  // Soporta formato DD-MM-YY
  const [d, m, y] = f.split('-').map(Number)
  return new Date(2000 + y, m - 1, d)
}

function formatearFecha(f) {
  const date = parseFecha(f)
  return isNaN(date) ? 'Fecha sin definir' : date.toLocaleDateString('es-ES')
}
