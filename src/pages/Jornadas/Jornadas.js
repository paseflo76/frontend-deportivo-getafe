import './jornadas.css'
import { getResultados } from '../../utils/data.js'
import { calendario } from '../../utils/data.js'

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

  calendario.forEach((jornadaArray, index) => {
    const jornadaDiv = document.createElement('div')
    jornadaDiv.className = 'jornada-list'
    container.appendChild(jornadaDiv)

    const h2 = document.createElement('h2')
    h2.textContent = `Jornada ${index + 1}`
    jornadaDiv.appendChild(h2)

    const fechaObj = jornadaArray.find((m) => m.fecha)
    const fechaDiv = document.createElement('div')
    fechaDiv.className = 'fecha'
    fechaDiv.textContent = fechaObj?.fecha
      ? `Fecha: ${fechaObj.fecha}`
      : 'Fecha sin definir'
    jornadaDiv.appendChild(fechaDiv)

    jornadaArray.forEach((m) => {
      if (m.fecha) return

      const partidoDiv = document.createElement('div')
      partidoDiv.className = 'partido'

      if (m.descansa) {
        partidoDiv.innerHTML = `<span class="descansa">Descansa: ${m.descansa}</span>`
      } else if (m.local && m.visitante) {
        const guardado = resultados.find(
          (r) => r.local === m.local && r.visitante === m.visitante
        )
        const golesLocal = guardado?.golesLocal ?? '-'
        const golesVisitante = guardado?.golesVisitante ?? '-'

        partidoDiv.innerHTML = `
          <span class="local">${m.local}</span>
          <span class="marcador">${golesLocal} - ${golesVisitante}</span>
          <span class="visitante">${m.visitante}</span>
        `
      }

      jornadaDiv.appendChild(partidoDiv)
    })
  })
}
