import { calendario, getJornadaActual } from './data.js'
import { getResultados } from './data.js'

export async function renderJornadas(container) {
  container.innerHTML = ''

  const jornada = getJornadaActual()
  const jornadaArray = calendario[jornada - 1] || []
  const resultados = await getResultados()

  const h2 = document.createElement('h2')
  h2.textContent = `Jornada ${jornada}`
  container.appendChild(h2)

  jornadaArray.forEach((m) => {
    const div = document.createElement('div')
    div.className = 'partido'

    if (m.descansa) {
      div.textContent = `Descansa: ${m.descansa}`
    } else {
      const guardado = resultados.find(
        (r) => r.local === m.local && r.visitante === m.visitante
      )
      const golesLocal = guardado?.golesLocal ?? '-'
      const golesVisitante = guardado?.golesVisitante ?? '-'
      div.textContent = `${m.local} ${golesLocal} - ${golesVisitante} ${m.visitante}`
    }

    container.appendChild(div)
  })
}
