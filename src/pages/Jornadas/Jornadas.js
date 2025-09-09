import {
  calendario,
  getResultados,
  getJornadaActual
} from '../../utils/data.js'

export const Jornadas = async () => {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''
  main.classList.add('jornadas')

  const container = document.createElement('div')
  container.id = 'calendario'
  main.appendChild(container)

  renderCalendario(container)

  // Evitar listeners duplicados entre navegaciones
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

    jornada.forEach((partido, pIndex) => {
      const matchDiv = document.createElement('div')
      matchDiv.className = 'partido'

      if (partido?.descansa) {
        matchDiv.textContent = `Descansa: ${partido.descansa}`
      } else {
        const res = (resultados[jIndex] && resultados[jIndex][pIndex]) || {}
        const golesL = res.golesLocal ?? '-'
        const golesV = res.golesVisitante ?? '-'

        const localSpan = document.createElement('span')
        localSpan.className = 'local'
        localSpan.textContent = partido.local

        const scoreSpan = document.createElement('span')
        scoreSpan.className = 'marcador'
        scoreSpan.textContent = `${golesL} - ${golesV}`

        const visitanteSpan = document.createElement('span')
        visitanteSpan.className = 'visitante'
        visitanteSpan.textContent = partido.visitante

        matchDiv.appendChild(localSpan)
        matchDiv.appendChild(document.createTextNode(' '))
        matchDiv.appendChild(scoreSpan)
        matchDiv.appendChild(document.createTextNode(' '))
        matchDiv.appendChild(visitanteSpan)

        if (jNumber === jornadaActual)
          matchDiv.classList.add('jornada-actual-partido')
      }

      list.appendChild(matchDiv)
    })

    container.appendChild(list)
  })
}
