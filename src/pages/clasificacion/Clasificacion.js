// clasificacion.js corregido para estructura de partidos horizontal

import './clasificacion.css'
import { Button } from '../../components/button/button.js'
import {
  calendario,
  getJornadaActual,
  setJornadaActual
} from '../../utils/data.js'
import {
  getResultados,
  saveResultado,
  saveResultadoNew,
  parseJwt
} from '../../utils/data.js'
import { apiCatch } from '../../utils/fetch/fech.js'

// Obtener sanciones del backend
async function getSanciones() {
  return await apiCatch('/api/v2/sanciones/teams')
}

async function saveSancion(nombre, puntos) {
  return await apiCatch('/api/v2/sanciones/penalizacion', 'PUT', {
    nombre,
    puntos
  })
}

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
  const sanciones = await getSanciones()

  const equipos = {}
  calendario.flat().forEach((m) => {
    if (m.descansa) return
    if (m.local && !equipos[m.local])
      equipos[m.local] = {
        equipo: m.local,
        puntos: 0,
        sancion: 0,
        gf: 0,
        gc: 0,
        id: null,
        jugados: 0,
        ganados: 0,
        empatados: 0,
        perdidos: 0
      }
    if (m.visitante && !equipos[m.visitante])
      equipos[m.visitante] = {
        equipo: m.visitante,
        puntos: 0,
        sancion: 0,
        gf: 0,
        gc: 0,
        id: null,
        jugados: 0,
        ganados: 0,
        empatados: 0,
        perdidos: 0
      }
  })

  resultados.forEach((m) => {
    if (m.descansa) return
    const { local, visitante, golesLocal, golesVisitante, _id } = m
    if (!equipos[local] || !equipos[visitante]) return
    if (!equipos[local].id) equipos[local].id = _id
    if (!equipos[visitante].id) equipos[visitante].id = _id
    if (golesLocal != null && golesVisitante != null) {
      equipos[local].gf += golesLocal
      equipos[local].gc += golesVisitante
      equipos[visitante].gf += golesVisitante
      equipos[visitante].gc += golesLocal
      equipos[local].jugados++
      equipos[visitante].jugados++
      if (golesLocal > golesVisitante) {
        equipos[local].puntos += 3
        equipos[local].ganados++
        equipos[visitante].perdidos++
      } else if (golesLocal < golesVisitante) {
        equipos[visitante].puntos += 3
        equipos[visitante].ganados++
        equipos[local].perdidos++
      } else {
        equipos[local].puntos++
        equipos[visitante].puntos++
        equipos[local].empatados++
        equipos[visitante].empatados++
      }
    }
  })

  // Aplicar sanciones
  Object.values(equipos).forEach((e) => {
    const s = sanciones.find((t) => t.nombre === e.equipo)
    e.sancion = s ? s.penalizacion : 0
    e.puntos -= e.sancion
    if (e.puntos < 0) e.puntos = 0
  })

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
        <th>J</th>
        <th>G</th>
        <th>E</th>
        <th>P</th>
        <th>F</th>
        <th>C</th>
        <th>DIF</th>
        <th>Sanción</th>
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
        <td>${e.jugados}</td>
        <td>${e.ganados}</td>
        <td>${e.empatados}</td>
        <td>${e.perdidos}</td>
        <td>${e.gf}</td>
        <td>${e.gc}</td>
        <td>${e.gf - e.gc}</td>
        <td></td>
      `

      // Sanción
      const sancionCell = document.createElement('td')
      if (user?.rol === 'admin') {
        const input = document.createElement('input')
        input.type = 'number'
        input.value = e.sancion
        input.classList.add('input-sancion')
        sancionCell.appendChild(input)

        const btn = Button(sancionCell, 'Guardar', 'small', 'secondary')
        btn.addEventListener('click', async () => {
          const puntos = Number(input.value)
          await saveSancion(e.equipo, puntos)
          window.dispatchEvent(new Event('resultadosUpdated'))
        })
      } else {
        sancionCell.textContent = e.sancion
      }
      tr.replaceChild(sancionCell, tr.children[10])
      tbody.appendChild(tr)
    })

  table.appendChild(tbody)
  tablaWrapper.appendChild(table)

  // Código de partidos y navegación (sin cambios)
  const partidosWrapper = document.createElement('div')
  partidosWrapper.className = 'partidos-wrapper'
  container.appendChild(partidosWrapper)

  const jornadaArray = calendario[jornada - 1] || []

  jornadaArray.forEach((m) => {
    if (m.fecha) {
      const fechaDiv = document.createElement('div')
      fechaDiv.className = 'fecha'
      fechaDiv.textContent = 'Fecha: ' + formatearFecha(m.fecha)
      partidosWrapper.appendChild(fechaDiv)
      return
    }

    const div = document.createElement('div')
    div.className = 'partido'

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

        const spanLocal = document.createElement('span')
        spanLocal.className = 'equipo-local'
        spanLocal.textContent = m.local

        const spanGuion = document.createElement('span')
        spanGuion.className = 'guion'
        spanGuion.textContent = '-'

        const spanVisitante = document.createElement('span')
        spanVisitante.className = 'equipo-visitante'
        spanVisitante.textContent = m.visitante

        contenidoDiv.appendChild(spanLocal)
        contenidoDiv.appendChild(inputL)
        contenidoDiv.appendChild(spanGuion)
        contenidoDiv.appendChild(inputV)
        contenidoDiv.appendChild(spanVisitante)

        div.appendChild(contenidoDiv)

        const btnGuardar = Button(div, 'Guardar', 'secondary', 'small')
        btnGuardar.addEventListener('click', async () => {
          const local = inputL.dataset.local
          const visitante = inputL.dataset.visitante
          const golesLocal = Number(inputL.value)
          const golesVisitante = Number(inputV.value)
          const id = inputL.dataset.id

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

          window.dispatchEvent(new Event('resultadosUpdated'))
        })
      } else {
        div.textContent = `${m.local} ${guardado?.golesLocal ?? '-'} - ${guardado?.golesVisitante ?? '-'} ${m.visitante}`
      }
    }

    partidosWrapper.appendChild(div)
  })

  if (user?.rol === 'admin') {
    Button(
      partidosWrapper,
      'Borrar Resultados Jornada',
      'danger',
      'small'
    ).addEventListener('click', async () => {
      if (
        !confirm(
          `¿Seguro que quieres borrar todos los resultados de la jornada ${jornada}?`
        )
      )
        return

      await apiCatch(
        `/league/matches/jornada/${jornada}/clear`,
        'PUT',
        null,
        localStorage.getItem('token')
      )
      window.dispatchEvent(new Event('resultadosUpdated'))
    })
  }

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

// Formateo de fecha
function parseFecha(f) {
  if (!f) return new Date(0)
  const [d, m, y] = f.split('-').map(Number)
  return new Date(2000 + y, m - 1, d)
}

function formatearFecha(f) {
  const date = parseFecha(f)
  return isNaN(date) ? 'Fecha sin definir' : date.toLocaleDateString('es-ES')
}
