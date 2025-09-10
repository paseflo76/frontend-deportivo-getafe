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

  // limpiar listeners duplicados
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

  // calcular clasificación
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

  const h2 = document.createElement('h2')
  h2.textContent = `Clasificación tras jornada ${jornada - 1}`
  container.appendChild(h2)

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
  container.appendChild(table)

  // partidos de la jornada actual
  const jornadaDiv = document.createElement('div')
  jornadaDiv.className = 'jornada-actual'
  container.appendChild(jornadaDiv)

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
      inputL.addEventListener('change', () => {
        resultados[jornada - 1][i].golesLocal = Number(inputL.value)
        saveResultados(resultados)
      })

      const inputV = document.createElement('input')
      inputV.type = 'number'
      inputV.value = m.golesVisitante ?? ''
      inputV.min = 0
      inputV.addEventListener('change', () => {
        resultados[jornada - 1][i].golesVisitante = Number(inputV.value)
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
    jornadaDiv.appendChild(div)
  })

  if (user?.rol === 'admin' && completos) {
    const btn = document.createElement('button')
    btn.textContent = 'Siguiente Jornada'
    btn.addEventListener('click', () => {
      nextJornada()
      renderClasificacion(container)
    })
    jornadaDiv.appendChild(btn)
  }
}
