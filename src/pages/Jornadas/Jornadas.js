import './jornadas.css'

import {
  calendario,
  getResultados,
  getJornadaActual
} from '../../utils/data.js'

export async function Calendario() {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''

  const container = document.createElement('div')
  container.id = 'calendario'
  main.appendChild(container)

  renderCalendario(container)

  if (window._calendarioListener) {
    window.removeEventListener('resultadosUpdated', window._calendarioListener)
    window._calendarioListener = null
  }

  const handler = () => renderCalendario(container)
  window._calendarioListener = handler
  window.addEventListener('resultadosUpdated', handler)
}

export function renderCalendario(container) {
  container.innerHTML = ''

  const resultados = getResultados()
  const jornadaActual = getJornadaActual()

  calendario.forEach((jornada, jIndex) => {
    const jNumber = jIndex + 1
    const list = document.createElement('div')
    list.className = 'jornada-list'

    const h2 = document.createElement('h2')
    h2.textContent = `Jornada ${jNumber}`
    if (jNumber === jornadaActual) h2.classList.add('jornada-actual')
    list.appendChild(h2)

    // mostrar fecha de la jornada (si existe)
    const fechaJornada = jornada.find((m) => m.fecha)?.fecha
    if (fechaJornada) {
      const fechaEl = document.createElement('div')
      fechaEl.className = 'fecha-jornada'
      fechaEl.textContent = fechaJornada
      list.appendChild(fechaEl)
    }

    const saved = resultados[jIndex] || []
    let matchIndex = 0

    jornada.forEach((partido) => {
      if (partido.fecha) return // saltar cabecera fecha

      const matchDiv = document.createElement('div')
      matchDiv.className = 'partido'

      if (partido.descansa) {
        matchDiv.textContent = `Descansa: ${partido.descansa}`
      } else {
        const res = saved[matchIndex] || {}
        const golesL = res.golesLocal ?? '-'
        const golesV = res.golesVisitante ?? '-'
        matchDiv.textContent = `${partido.local} ${golesL} - ${golesV} ${partido.visitante}`
        if (jNumber === jornadaActual)
          matchDiv.classList.add('jornada-actual-partido')
        matchIndex++
      }

      list.appendChild(matchDiv)
    })

    container.appendChild(list)
  })
}
