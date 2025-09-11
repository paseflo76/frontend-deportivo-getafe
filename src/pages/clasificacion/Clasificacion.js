import './clasificacion.css'

import {
  calendario,
  getResultados,
  saveResultados,
  getJornadaActual,
  nextJornada,
  prevJornada
} from '../../utils/data.js'
import { parseJwt } from '../../components/Header/Header.js'

export async function Clasificacion() {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''

  const container = document.createElement('div')
  container.id = 'clasificacion'
  main.appendChild(container)

  const user = parseJwt(localStorage.getItem('token'))
  let jornadaVista = getJornadaActual() // jornada que ve cada usuario

  renderClasificacion(container, jornadaVista, user)

  if (window._clasificacionListener) {
    window.removeEventListener(
      'resultadosUpdated',
      window._clasificacionListener
    )
    window._clasificacionListener = null
  }

  const handler = () => renderClasificacion(container, jornadaVista, user)
  window._clasificacionListener = handler
  window.addEventListener('resultadosUpdated', handler)
}

function renderClasificacion(container, jornada, user) {
  container.innerHTML = ''

  const resultados = getResultados()

  const equipos = {}
  resultados.forEach((j) => {
    j.forEach((m) => {
      if (m.descansa) return
      const { local, visitante, golesLocal, golesVisitante } = m
      if (local) {
        if (!equipos[local])
          equipos[local] = { equipo: local, puntos: 0, gf: 0, gc: 0 }
      }
      if (visitante) {
        if (!equipos[visitante])
          equipos[visitante] = { equipo: visitante, puntos: 0, gf: 0, gc: 0 }
      }

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

  // preparar resultados de la jornada
  const jornadaArray = calendario[jornada - 1] || []
  const resultadosJornada = resultados[jornada - 1] || []
  let resultadoIndex = 0
  const jornadaResultados = jornadaArray.map((m) => {
    if (m.descansa || m.fecha) return m
    const guardado = resultadosJornada[resultadoIndex] || {}
    resultadoIndex++
    return { ...m, ...guardado }
  })

  let completos = true
  jornadaResultados.forEach((m, i) => {
    if (m.fecha) return // ignorar cabecera fecha

    const div = document.createElement('div')
    div.className = 'partido'

    if (m.descansa) {
      div.textContent = `Descansa: ${m.descansa}`
    } else if (user?.rol === 'admin') {
      const contenidoDiv = document.createElement('div')
      contenidoDiv.className = 'contenido-partido'

      const spanLocal = document.createElement('span')
      spanLocal.className = 'equipo-local'
      spanLocal.textContent = m.local

      const inputL = document.createElement('input')
      inputL.type = 'number'
      inputL.value = m.golesLocal ?? ''
      inputL.min = 0

      const spanGuion = document.createElement('span')
      spanGuion.className = 'guion'
      spanGuion.textContent = '-'

      const inputV = document.createElement('input')
      inputV.type = 'number'
      inputV.value = m.golesVisitante ?? ''
      inputV.min = 0

      const spanVisitante = document.createElement('span')
      spanVisitante.className = 'equipo-visitante'
      spanVisitante.textContent = m.visitante

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
        renderClasificacion(container, jornada, user)
      })

      const btnBorrar = document.createElement('button')
      btnBorrar.textContent = 'Borrar'
      btnBorrar.addEventListener('click', () => {
        resultados[jornada - 1][resultadoIndex - 1].golesLocal = null
        resultados[jornada - 1][resultadoIndex - 1].golesVisitante = null
        saveResultados(resultados)
        renderClasificacion(container, jornada, user)
      })

      botonesDiv.appendChild(btnGuardar)
      botonesDiv.appendChild(btnBorrar)

      div.appendChild(contenidoDiv)
      div.appendChild(botonesDiv)
    } else {
      div.textContent = `${m.local} ${m.golesLocal ?? '-'} - ${
        m.golesVisitante ?? '-'
      } ${m.visitante}`
    }

    if (m.golesLocal == null || m.golesVisitante == null) completos = false
    partidosWrapper.appendChild(div)
  })

  const navDiv = document.createElement('div')
  navDiv.className = 'navegacion-jornada'

  const btnAnterior = document.createElement('button')
  btnAnterior.textContent = 'Anterior Jornada'
  btnAnterior.disabled = jornada <= 1
  btnAnterior.addEventListener('click', () => {
    jornada--
    renderClasificacion(container, jornada, user)
  })

  const btnSiguiente = document.createElement('button')
  btnSiguiente.textContent = 'Siguiente Jornada'
  btnSiguiente.disabled = jornada >= calendario.length
  btnSiguiente.addEventListener('click', () => {
    jornada++
    renderClasificacion(container, jornada, user)
  })

  navDiv.appendChild(btnAnterior)
  navDiv.appendChild(btnSiguiente)
  partidosWrapper.appendChild(navDiv)
}
