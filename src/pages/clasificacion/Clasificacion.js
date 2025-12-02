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
import { apiCatch } from '../../utils/fetch/fech.js'

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

    if (m.local && !equipos[m.local]) {
      equipos[m.local] = {
        equipo: m.local,
        puntos: 0,
        gf: 0,
        gc: 0,
        jugados: 0,
        ganados: 0,
        empatados: 0,
        perdidos: 0
      }
    }

    if (m.visitante && !equipos[m.visitante]) {
      equipos[m.visitante] = {
        equipo: m.visitante,
        puntos: 0,
        gf: 0,
        gc: 0,
        jugados: 0,
        ganados: 0,
        empatados: 0,
        perdidos: 0
      }
    }
  })

  resultados.forEach((m) => {
    if (m.descansa) return

    const { local, visitante, golesLocal, golesVisitante } = m
    if (!equipos[local] || !equipos[visitante]) return

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
      `
      tbody.appendChild(tr)
    })

  table.appendChild(tbody)
  tablaWrapper.appendChild(table)

  const partidosWrapper = document.createElement('div')
  partidosWrapper.className = 'partidos-wrapper'
  container.appendChild(partidosWrapper)

  const jornadaArray = calendario[jornada - 1] || []

  jornadaArray.forEach((m) => {
    const div = document.createElement('div')
    div.className = 'partido'

    if (m.fecha) {
      const fechaDiv = document.createElement('div')
      fechaDiv.className = 'fecha'
      fechaDiv.textContent = 'Fecha: ' + formatearFecha(m.fecha)
      partidosWrapper.appendChild(fechaDiv)
      return
    }

    if (m.descansa) {
      div.textContent = `Descansa: ${m.descansa}`
      partidosWrapper.appendChild(div)
      return
    }

    const partidoDuplicados = resultados.filter(
      (r) =>
        r.local === m.local &&
        r.visitante === m.visitante &&
        r.jornada === jornada
    )

    if (user?.rol === 'admin') {
      const registro = partidoDuplicados[0] || null

      const inputL = document.createElement('input')
      inputL.type = 'number'
      inputL.min = 0
      inputL.value = registro?.golesLocal ?? ''

      const inputV = document.createElement('input')
      inputV.type = 'number'
      inputV.min = 0
      inputV.value = registro?.golesVisitante ?? ''

      const contenidoDiv = document.createElement('div')
      contenidoDiv.className = 'contenido-partido'

      contenidoDiv.innerHTML = `
        <span class="equipo-local">${m.local}</span>
      `
      contenidoDiv.appendChild(inputL)
      contenidoDiv.innerHTML += `<span class="guion">-</span>`
      contenidoDiv.appendChild(inputV)
      contenidoDiv.innerHTML += `
        <span class="equipo-visitante">${m.visitante}</span>
      `

      div.appendChild(contenidoDiv)

      const btn = Button(div, 'Guardar', 'secondary', 'small')
      btn.addEventListener('click', async () => {
        const gL = Number(inputL.value)
        const gV = Number(inputV.value)

        if (partidoDuplicados.length > 1) {
          for (let i = 1; i < partidoDuplicados.length; i++) {
            await apiCatch(
              `/api/v2/league/matches/${partidoDuplicados[i]._id}`,
              'DELETE'
            )
          }
        }

        if (registro) {
          await saveResultado(registro._id, gL, gV)
        } else {
          await saveResultadoNew(m.local, m.visitante, gL, gV, jornada)
        }

        window.dispatchEvent(new Event('resultadosUpdated'))
      })
    } else {
      const guardado = partidoDuplicados[0]
      div.textContent = `${m.local} ${guardado?.golesLocal ?? '-'} - ${
        guardado?.golesVisitante ?? '-'
      } ${m.visitante}`
    }

    partidosWrapper.appendChild(div)
  })

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

function parseFecha(f) {
  if (!f) return new Date(0)
  const [d, m, y] = f.split('-').map(Number)
  return new Date(2000 + y, m - 1, d)
}

function formatearFecha(f) {
  const date = parseFecha(f)
  return isNaN(date) ? 'Fecha sin definir' : date.toLocaleDateString('es-ES')
}
