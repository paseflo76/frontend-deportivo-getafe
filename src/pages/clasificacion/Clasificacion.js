import './clasificacion.css'

import {
  getResultados,
  saveResultado,
  saveResultadoNew,
  parseJwt,
  deleteResultado
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
      equipos[m.local] = { equipo: m.local, puntos: 0, gf: 0, gc: 0, id: null }
    if (m.visitante && !equipos[m.visitante])
      equipos[m.visitante] = {
        equipo: m.visitante,
        puntos: 0,
        gf: 0,
        gc: 0,
        id: null
      }
  })

  resultados.forEach((m) => {
    if (m.descansa) return
    const { local, visitante, golesLocal, golesVisitante, _id } = m

    if (!equipos[local].id) equipos[local].id = _id
    if (!equipos[visitante].id) equipos[visitante].id = _id

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

  // Tabla de clasificación
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
    .filter((e) => e.equipo)
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

  // Partidos de la jornada
  const partidosWrapper = document.createElement('div')
  partidosWrapper.className = 'partidos-wrapper'
  container.appendChild(partidosWrapper)

  const jornadaArray = calendario[jornada - 1] || []

  jornadaArray.forEach((m, index) => {
    const div = document.createElement('div')
    div.className = 'partido'

    if (index === 0 && m.fecha) {
      const fechaDiv = document.createElement('div')
      fechaDiv.className = 'fecha'
      fechaDiv.textContent = `Fecha: ${formatearFecha(m.fecha)}`
      partidosWrapper.appendChild(fechaDiv)
      return
    }

    if (m.descansa) {
      div.textContent = `Descansa: ${m.descansa}`
    } else {
      const guardado = resultados.find(
        (r) => r.local === m.local && r.visitante === m.visitante
      )

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
        inputV.dataset.local = m.local
        inputV.dataset.visitante = m.visitante
        inputV.dataset.id = guardado?._id || ''

        const contenidoDiv = document.createElement('div')
        contenidoDiv.className = 'contenido-partido'
        contenidoDiv.appendChild(
          document.createTextNode(`${m.local} - ${m.visitante} `)
        )
        contenidoDiv.appendChild(inputL)
        contenidoDiv.appendChild(document.createTextNode(' - '))
        contenidoDiv.appendChild(inputV)

        div.appendChild(contenidoDiv)
      } else {
        const golesLocal = guardado?.golesLocal ?? '-'
        const golesVisitante = guardado?.golesVisitante ?? '-'
        div.textContent = `${m.local} ${golesLocal} - ${golesVisitante} ${m.visitante}`
      }
    }

    partidosWrapper.appendChild(div)
  })

  if (user?.rol === 'admin') {
    Button(
      partidosWrapper,
      'Guardar Jornada',
      'primary',
      'medium'
    ).addEventListener('click', async () => {
      const inputsLocal = partidosWrapper.querySelectorAll(
        'input[type="number"][data-local]'
      )
      for (const input of inputsLocal) {
        const local = input.dataset.local
        const visitante = input.dataset.visitante
        const golesLocal = Number(input.value)
        const inputVisitante = Array.from(inputsLocal).find(
          (i) => i.dataset.local === visitante && i.dataset.visitante === local
        )
        const golesVisitante = Number(inputVisitante?.value ?? 0)
        const id = input.dataset.id

        if (id) {
          await saveResultado(id, golesLocal, golesVisitante)
        } else {
          await saveResultadoNew(
            local,
            visitante,
            golesLocal,
            golesVisitante,
            jornada
          )
        }
      }
      window.dispatchEvent(new Event('resultadosUpdated'))
    })
  }

  // Navegación jornada
  const navDiv = document.createElement('div')
  navDiv.className = 'navegacion-jornada'

  const btnAnterior = Button(navDiv, 'Anterior Jornada', 'secondary', 'small')
  btnAnterior.disabled = jornada <= 1
  btnAnterior.addEventListener('click', () => {
    setJornadaActual(jornada - 1)
    renderClasificacion(container)
  })

  const btnSiguiente = Button(navDiv, 'Siguiente Jornada', 'secondary', 'small')
  btnSiguiente.disabled = jornada >= calendario.length
  btnSiguiente.addEventListener('click', () => {
    setJornadaActual(jornada + 1)
    renderClasificacion(container)
  })

  partidosWrapper.appendChild(navDiv)
}

// --- Funciones auxiliares para parsear y mostrar fechas ---
function parseFecha(f) {
  if (!f) return new Date(0)
  const [d, m, y] = f.split('-').map(Number)
  return new Date(2000 + y, m - 1, d)
}

function formatearFecha(f) {
  const date = parseFecha(f)
  return isNaN(date) ? 'Fecha sin definir' : date.toLocaleDateString('es-ES')
}
