/* import { renderClasificacion } from '../../utils/clasificacion.js/clasifi'
import { renderJornadas } from '../../utils/jornadas/jornadas.js'
import './clasificacion.css'

export const Clasificacion = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const divClasificacion = document.createElement('div')
  divClasificacion.id = 'clasificacion'
  main.appendChild(divClasificacion)

  const divJornadas = document.createElement('div')
  divJornadas.id = 'jornadas-clasificacion'
  main.appendChild(divJornadas)

  await renderClasificacion(divClasificacion)
  await renderJornadas(divJornadas, divClasificacion)
} */

import {
  getResultados,
  saveResultados,
  getJornadaActual,
  nextJornada
} from '../../utils/data.js'
import { calcularClasificacion } from '../../utils/clasificacion.js'
import { parseJwt } from '../../components/Header/Header.js'

export async function renderClasificacion(container) {
  container.innerHTML = ''

  const { tabla, jornadaMax } = calcularClasificacion()
  const h2 = document.createElement('h2')
  h2.textContent = `Clasificación después de la Jornada ${jornadaMax}`
  container.appendChild(h2)

  const table = document.createElement('table')
  table.className = 'tabla-clasificacion'
  table.innerHTML = `
    <thead>
      <tr>
        <th>Equipo</th><th>Puntos</th><th>GF</th><th>GC</th><th>DIF</th>
      </tr>
    </thead>
  `
  const tbody = document.createElement('tbody')
  tabla.forEach((e) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${e.equipo}</td>
      <td>${e.puntos}</td>
      <td>${e.gf}</td>
      <td>${e.gc}</td>
      <td>${e.dif}</td>
    `
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)
  container.appendChild(table)

  // Mostrar partidos de la jornada actual con inputs si admin
  const resultados = getResultados()
  const jornada = getJornadaActual()
  const user = parseJwt(localStorage.getItem('token'))

  const h3 = document.createElement('h3')
  h3.textContent = `Resultados Jornada ${jornada}`
  container.appendChild(h3)

  let completos = true
  resultados[jornada - 1].forEach((m, i) => {
    if (!m.local) return
    const div = document.createElement('div')

    if (user?.rol === 'admin') {
      const inputL = document.createElement('input')
      const inputV = document.createElement('input')
      inputL.type = inputV.type = 'number'
      inputL.min = inputV.min = 0
      inputL.value = m.golesLocal ?? ''
      inputV.value = m.golesVisitante ?? ''

      inputL.addEventListener('change', () => {
        m.golesLocal = Number(inputL.value)
        saveResultados(resultados)
      })
      inputV.addEventListener('change', () => {
        m.golesVisitante = Number(inputV.value)
        saveResultados(resultados)
      })

      div.textContent = `${m.local} vs ${m.visitante} `
      div.appendChild(inputL)
      div.appendChild(document.createTextNode(' - '))
      div.appendChild(inputV)
    } else {
      div.textContent = `${m.local} ${m.golesLocal ?? '-'} - ${
        m.golesVisitante ?? '-'
      } ${m.visitante}`
    }

    if (m.golesLocal == null || m.golesVisitante == null) completos = false
    container.appendChild(div)
  })

  if (user?.rol === 'admin' && completos) {
    const btn = document.createElement('button')
    btn.textContent = 'Siguiente Jornada'
    btn.addEventListener('click', () => {
      nextJornada()
      renderClasificacion(container)
    })
    container.appendChild(btn)
  }
}
