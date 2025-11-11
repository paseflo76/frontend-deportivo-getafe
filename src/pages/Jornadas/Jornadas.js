import './jornadas.css'
import { getResultados } from '../../utils/data.js'

export async function Calendario() {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''

  const container = document.createElement('div')
  container.id = 'calendario'
  main.appendChild(container)

  await renderJornadas(container)

  if (!window._jornadasListener) {
    window._jornadasListener = async () => {
      await renderJornadas(container)
    }
    window.addEventListener('resultadosUpdated', window._jornadasListener)
  }
}

async function renderJornadas(container) {
  container.innerHTML = ''

  const resultados = await getResultados()

  // Suponiendo que "calendario" viene de utils/data.js
  const { calendario } = await import('../../utils/data.js')

  jornadaArray.forEach((m) => {
    const partidoDiv = document.createElement('div')
    partidoDiv.className = 'partido'

    if (m.fecha) {
      const fechaDiv = document.createElement('div')
      fechaDiv.className = 'fecha'
      fechaDiv.textContent = `Fecha: ${m.fecha}`
      partidoDiv.appendChild(fechaDiv)
    } else if (m.descansa) {
      partidoDiv.textContent = `Descansa: ${m.descansa}`
    } else if (m.local && m.visitante) {
      const guardado = resultados.find(
        (r) => r.local === m.local && r.visitante === m.visitante
      )
      const golesLocal = guardado?.golesLocal ?? '-'
      const golesVisitante = guardado?.golesVisitante ?? '-'
      partidoDiv.textContent = `${m.local} ${golesLocal} - ${golesVisitante} ${m.visitante}`
    }

    jornadaDiv.appendChild(partidoDiv)
  })
}
