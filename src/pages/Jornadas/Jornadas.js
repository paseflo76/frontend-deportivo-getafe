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

    const h2 = document.createElement('h2')
    h2.textContent = `Jornada ${jNumber}`
    if (jNumber === jornadaActual) h2.classList.add('jornada-actual')
    container.appendChild(h2)

    const list = document.createElement('div')
    list.className = 'jornada-list'

    jornada.forEach((partido, pIndex) => {
      const matchDiv = document.createElement('div')
      matchDiv.className = 'partido'

      if (partido?.descansa) {
        matchDiv.textContent = `Descansa: ${partido.descansa}`
      } else {
        const res = (resultados[jIndex] && resultados[jIndex][pIndex]) || {}
        const golesL = res.golesLocal ?? '-'
        const golesV = res.golesVisitante ?? '-'

        matchDiv.textContent = `${partido.local} ${golesL} - ${golesV} ${partido.visitante}`
        if (jNumber === jornadaActual)
          matchDiv.classList.add('jornada-actual-partido')
      }

      list.appendChild(matchDiv)
    })

    container.appendChild(list)
  })
}
