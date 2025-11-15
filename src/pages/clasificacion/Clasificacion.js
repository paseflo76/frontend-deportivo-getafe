// clasificacion.js corregido para estructura de partidos horizontal

import './clasificacion.css'
import {
  getResultados,
  saveResultado,
  saveResultadoNew,
  parseJwt
} from '../../utils/data.js'
import {
  calendario,
  getJornadaActual,
  setJornadaActual
} from '../../utils/data.js'
import { Button } from '../../components/button/button.js'

export async function Clasificacion() {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''

  const container = document.createElement('div')
  container.id = 'clasificacion'
  main.appendChild(container)

  await renderClasificacion(container)

  if (window._clasificacionListener) {
    window.removeEventListener(
      'resultadosUpdated',
      window._clasificacionListener
    )
    window._clasificacionListener = null
  }

  const handler = async () => await renderClasificacion(container)
  window._clasificacionListener = handler
  window.addEventListener('resultadosUpdated', handler)
}

async function renderClasificacion(container) {
  container.innerHTML = ''
  const resultados = await getResultados()
  const jornada = getJornadaActual()
  const user = parseJwt(localStorage.getItem('token'))

  const equipos = {}
  calendario.flat().forEach((m) => {
    if (m.descansa) return
    if (m.local && !equipos[m.local])
      equipos[m.local] = { equipo: m.local, puntos: 0, gf: 0, gc: 0 }
    if (m.visitante && !equipos[m.visitante])
      equipos[m.visitante] = { equipo: m.visitante, puntos: 0, gf: 0, gc: 0 }
  })

  resultados.forEach((m) => {
    if (m.descansa) return
    const { local, visitante, golesLocal, golesVisitante } = m
    if (golesLocal != null && golesVisitante != null) {
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
    }
  })

  // Ordenar tabla
  const tablaWrapper = document.createElement('div')
  tablaWrapper.className = 'tabla-wrapper'
  container.appendChild(tablaWrapper)

  const h2 = document.createElement('h2')
  h2.textContent = `Jornada ${jornada}`
  h2.style.textAlign = 'center'
  tablaWrapper.appendChild(h2)

  const table = document.createElement('table')
  table.className = 'tabla-clasificacion'
  table.innerHTML = `
    <thead>
      <tr>
        <th>Pos</th><th>Equipo</th><th>Puntos</th><th>GF</th><th>GC</th><th>DIF</th>
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

  // Partidos jornada
  const partidosWrapper = document.createElement('div')
  partidosWrapper.className = 'partidos-wrapper'
  container.appendChild(partidosWrapper)

  const jornadaArray = calendario[jornada - 1] || []

  jornadaArray.forEach((m) => {
    if (m.descansa) {
      const div = document.createElement('div')
      div.textContent = `Descansa: ${m.descansa}`
      partidosWrapper.appendChild(div)
      return
    }

    const guardado = resultados.find(
      (r) => r.local === m.local && r.visitante === m.visitante
    )
    const div = document.createElement('div')
    div.className = 'partido'

    if (user?.rol === 'admin') {
      const inputL = document.createElement('input')
      inputL.type = 'number'
      inputL.min = 0
      inputL.value = guardado?.golesLocal ?? ''
      inputL.dataset.local = m.local
      inputL.dataset.visitante = m.visitante
      inputL.dataset.id = guardado?._id || ''

      const inputV = document.createElement('input')
      inputV.type = 'number'
      inputV.min = 0
      inputV.value = guardado?.golesVisitante ?? ''
      inputV.dataset.local = m.visitante
      inputV.dataset.visitante = m.local
      inputV.dataset.id = guardado?._id || ''

      const contenidoDiv = document.createElement('div')
      contenidoDiv.className = 'contenido-partido'
      contenidoDiv.appendChild(document.createTextNode(`${m.local} `))
      contenidoDiv.appendChild(inputL)
      contenidoDiv.appendChild(document.createTextNode(' - '))
      contenidoDiv.appendChild(inputV)
      contenidoDiv.appendChild(document.createTextNode(` ${m.visitante}`))

      div.appendChild(contenidoDiv)
    } else {
      div.textContent = `${m.local} ${guardado?.golesLocal ?? '-'} - ${
        guardado?.golesVisitante ?? '-'
      } ${m.visitante}`
    }

    partidosWrapper.appendChild(div)
  })

  if (user?.rol === 'admin') {
    Button(
      partidosWrapper,
      'Guardar Jornada',
      'secondary',
      'small'
    ).addEventListener('click', async () => {
      const inputsLocal = partidosWrapper.querySelectorAll(
        'input[type="number"][data-local]'
      )
      const pares = {}

      inputsLocal.forEach((input) => {
        const key = [input.dataset.local, input.dataset.visitante]
          .sort()
          .join('-')
        pares[key] = pares[key] || {}
        if (input.dataset.local === input.dataset.visitante) return
        if (input.dataset.id) pares[key].id = input.dataset.id
        if (input.dataset.local === input.dataset.id) return
        if (!pares[key].local) pares[key].local = Number(input.value)
        else pares[key].visitante = Number(input.value)
      })

      for (const key in pares) {
        const r = pares[key]
        if (r.id) await saveResultado(r.id, r.local, r.visitante)
        else
          await saveResultadoNew(
            r.local,
            r.visitante,
            r.local,
            r.visitante,
            jornada
          )
      }
      window.dispatchEvent(new Event('resultadosUpdated'))
    })
  }
}
