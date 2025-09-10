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
import './clasificacion.css'

import {
  calendario,
  getResultados,
  saveResultados,
  getJornadaActual,
  nextJornada
} from '../../utils/data.js'
import { parseJwt } from '../../components/Header/Header.js'

export async function Clasificacion() {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''

  const container = document.createElement('div')
  container.id = 'clasificacion'
  main.appendChild(container)

  renderClasificacion(container)

  if (window._clasificacionListener) {
    window.removeEventListener(
      'resultadosUpdated',
      window._clasificacionListener
    )
    window._clasificacionListener = null
  }

  const handler = () => renderClasificacion(container)
  window._clasificacionListener = handler
  window.addEventListener('resultadosUpdated', handler)
}

function renderClasificacion(container) {
  container.innerHTML = ''

  const resultados = getResultados()
  const jornada = getJornadaActual()

  const equipos = {}
  resultados.forEach((jornada) => {
    jornada.forEach((m) => {
      if (m.descansa) return
      const { local, visitante, golesLocal, golesVisitante } = m
      if (!equipos[local])
        equipos[local] = { equipo: local, puntos: 0, gf: 0, gc: 0 }
      if (!equipos[visitante])
        equipos[visitante] = { equipo: visitante, puntos: 0, gf: 0, gc: 0 }
      if (golesLocal == null || golesVisitante == null) return

      equipos[local].gf += golesLocal
      equipos[local].gc += golesVisitante
      equipos[visitante].gf += golesVisitante
      equipos[visitante].gc += golesLocal

      if (golesLocal > golesVisitante) equipos[local].puntos += 3
      else if (golesLocal < golesVisitante) equipos[visitante].puntos += 3
      else {
        equipos[local].puntos++
        equipos[visitante].puntos++
      }
    })
  })

  const tablaWrapper = document.createElement('div')
  tablaWrapper.className = 'tabla-wrapper'
  container.appendChild(tablaWrapper)

  const h2 = document.createElement('h2')
  h2.textContent = `Jornada ${jornada}`
  tablaWrapper.appendChild(h2)

  const table = document.createElement('table')
  table.className = 'tabla-clasificacion'
  table.innerHTML = `
    <thead>
      <tr>
        <th>Equipo</th>
        <th>Puntos</th>
        <th>GF</th>
        <th>GC</th>
        <th>DIF</th>
      </tr>
    </thead>
  `
  const tbody = document.createElement('tbody')
  Object.values(equipos)
    .sort(
      (a, b) =>
        b.puntos - a.puntos || b.gf - b.gc - (a.gf - a.gc) || b.gf - a.gf
    )
    .forEach((e) => {
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td>${e.equipo}</td>
        <td>${e.puntos}</td>
        <td>${e.gf}</td>
        <td>${e.gc}</td>
        <td>${e.gf - e.gc}</td>
      `
      tbody.appendChild(tr)
    })
  table.appendChild(tbody)
  tablaWrapper.appendChild(table)

  const partidosWrapper = document.createElement('div')
  partidosWrapper.className = 'partidos-wrapper'
  container.appendChild(partidosWrapper)

  const user = parseJwt(localStorage.getItem('token'))
  const jornadaResultados = calendario[jornada - 1].map((m, i) => {
    const guardado =
      (resultados[jornada - 1] && resultados[jornada - 1][i]) || {}
    return { ...m, ...guardado }
  })

  let completos = true
  jornadaResultados.forEach((m, i) => {
    const div = document.createElement('div')
    div.className = 'partido'

    if (m.descansa) {
      div.textContent = `Descansa: ${m.descansa}`
    } else if (user?.rol === 'admin') {
      const inputL = document.createElement('input')
      inputL.type = 'number'
      inputL.value = m.golesLocal ?? ''
      inputL.min = 0

      const inputV = document.createElement('input')
      inputV.type = 'number'
      inputV.value = m.golesVisitante ?? ''
      inputV.min = 0

      const botonesDiv = document.createElement('div')
      botonesDiv.className = 'botones-partido'

      const btnGuardar = document.createElement('button')
      btnGuardar.textContent = 'Guardar'
      btnGuardar.addEventListener('click', () => {
        resultados[jornada - 1][i].golesLocal =
          inputL.value === '' ? null : Number(inputL.value)
        resultados[jornada - 1][i].golesVisitante =
          inputV.value === '' ? null : Number(inputV.value)
        saveResultados(resultados)
        renderClasificacion(container)
      })

      const btnBorrar = document.createElement('button')
      btnBorrar.textContent = 'Borrar'
      btnBorrar.addEventListener('click', () => {
        resultados[jornada - 1][i].golesLocal = null
        resultados[jornada - 1][i].golesVisitante = null
        saveResultados(resultados)
        renderClasificacion(container)
      })

      botonesDiv.appendChild(btnGuardar)
      botonesDiv.appendChild(btnBorrar)

      div.appendChild(
        document.createTextNode(
          `${m.local} ${m.golesLocal ?? ''} - ${m.golesVisitante ?? ''} ${
            m.visitante
          } `
        )
      )
      div.appendChild(inputL)
      div.appendChild(document.createTextNode(' vs '))
      div.appendChild(inputV)
      div.appendChild(botonesDiv)
    } else {
      div.textContent = `${m.local} ${m.golesLocal ?? '-'} - ${
        m.golesVisitante ?? '-'
      } ${m.visitante}`
    }

    if (m.golesLocal == null || m.golesVisitante == null) completos = false
    partidosWrapper.appendChild(div)
  })

  if (user?.rol === 'admin' && completos) {
    const btnSiguiente = document.createElement('button')
    btnSiguiente.textContent = 'Siguiente Jornada'
    btnSiguiente.addEventListener('click', () => {
      nextJornada()
      renderClasificacion(container)
    })
    partidosWrapper.appendChild(btnSiguiente)
  }
}
