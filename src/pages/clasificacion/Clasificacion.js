import './clasificacion.css'

import {
  calendario,
  getResultados,
  saveResultados,
  getJornadaActual,
  setJornadaActual
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
  resultados.forEach((j) => {
    j.forEach((m) => {
      if (m.descansa) return
      const { local, visitante, golesLocal, golesVisitante } = m
      if (golesLocal == null || golesVisitante == null) return // solo contabiliza partidos jugados
      if (!equipos[local])
        equipos[local] = { equipo: local, puntos: 0, gf: 0, gc: 0 }
      if (!equipos[visitante])
        equipos[visitante] = { equipo: visitante, puntos: 0, gf: 0, gc: 0 }

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
      <th>Pos</th>
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
    .forEach((e, index) => {
      const tr = document.createElement('tr')
      if (index === 0) tr.classList.add('primero')
      tr.innerHTML = `
      <td>${index + 1}</td>
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
  const jornadaArray = calendario[jornada - 1] || []
  const resultadosJornada = resultados[jornada - 1] || []

  let resultadoIndex = 0
  jornadaArray.forEach((m) => {
    const div = document.createElement('div')
    div.className = 'partido'

    if (m.descansa) {
      div.textContent = `Descansa: ${m.descansa}`
    } else {
      if (!resultadosJornada[resultadoIndex]) return
      const guardado = resultadosJornada[resultadoIndex]
      const partido = { ...m, ...guardado }
      resultadoIndex++

      if (user?.rol === 'admin') {
        const contenidoDiv = document.createElement('div')
        contenidoDiv.className = 'contenido-partido'

        const spanLocal = document.createElement('span')
        spanLocal.className = 'equipo-local'
        spanLocal.textContent = partido.local

        const inputL = document.createElement('input')
        inputL.type = 'number'
        inputL.value = partido.golesLocal ?? ''
        inputL.min = 0

        const spanGuion = document.createElement('span')
        spanGuion.className = 'guion'
        spanGuion.textContent = '-'

        const inputV = document.createElement('input')
        inputV.type = 'number'
        inputV.value = partido.golesVisitante ?? ''
        inputV.min = 0

        const spanVisitante = document.createElement('span')
        spanVisitante.className = 'equipo-visitante'
        spanVisitante.textContent = partido.visitante

        contenidoDiv.appendChild(spanLocal)
        contenidoDiv.appendChild(inputL)
        contenidoDiv.appendChild(spanGuion)
        contenidoDiv.appendChild(inputV)
        contenidoDiv.appendChild(spanVisitante)

        const botonesDiv = document.createElement('div')
        botonesDiv.className = 'botones-partido'

        const btnGuardar = document.createElement('button')
        btnGuardar.textContent = 'Guardar'
        btnGuardar.addEventListener('click', () => {
          resultados[jornada - 1][resultadoIndex - 1].golesLocal =
            inputL.value === '' ? null : Number(inputL.value)
          resultados[jornada - 1][resultadoIndex - 1].golesVisitante =
            inputV.value === '' ? null : Number(inputV.value)
          saveResultados(resultados)
          renderClasificacion(container)
        })

        const btnBorrar = document.createElement('button')
        btnBorrar.textContent = 'Borrar'
        btnBorrar.addEventListener('click', () => {
          resultados[jornada - 1][resultadoIndex - 1].golesLocal = null
          resultados[jornada - 1][resultadoIndex - 1].golesVisitante = null
          saveResultados(resultados)
          renderClasificacion(container)
        })

        botonesDiv.appendChild(btnGuardar)
        botonesDiv.appendChild(btnBorrar)
        div.appendChild(contenidoDiv)
        div.appendChild(botonesDiv)
      } else {
        div.textContent = `${partido.local} ${partido.golesLocal ?? '-'} - ${
          partido.golesVisitante ?? '-'
        } ${partido.visitante}`
      }
    }

    partidosWrapper.appendChild(div)
  })

  const navDiv = document.createElement('div')
  navDiv.className = 'navegacion-jornada'

  const btnAnterior = document.createElement('button')
  btnAnterior.textContent = 'Anterior Jornada'
  btnAnterior.disabled = jornada <= 1
  btnAnterior.addEventListener('click', () => {
    setJornadaActual(jornada - 1)
    renderClasificacion(container)
  })

  const btnSiguiente = document.createElement('button')
  btnSiguiente.textContent = 'Siguiente Jornada'
  btnSiguiente.disabled = jornada >= calendario.length
  btnSiguiente.addEventListener('click', () => {
    setJornadaActual(jornada + 1)
    renderClasificacion(container)
  })

  navDiv.appendChild(btnAnterior)
  navDiv.appendChild(btnSiguiente)
  partidosWrapper.appendChild(navDiv)
}
