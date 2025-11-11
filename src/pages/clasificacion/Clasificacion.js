import './clasificacion.css'
import {
  getResultados,
  saveResultado,
  deleteResultado,
  parseJwt
} from '../../utils/data.js'
import {
  calendario,
  getJornadaActual,
  setJornadaActual
} from '../../utils/data.js'

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

  jornadaArray.forEach((m) => {
    const div = document.createElement('div')
    div.className = 'partido'

    if (m.descansa) {
      div.textContent = `Descansa: ${m.descansa}`
    } else {
      const guardado = resultados.find(
        (r) => r.local === m.local && r.visitante === m.visitante
      )

      const golesLocal = guardado?.golesLocal ?? '-'
      const golesVisitante = guardado?.golesVisitante ?? '-'

      if (user?.rol === 'admin' && guardado) {
        const contenidoDiv = document.createElement('div')
        contenidoDiv.className = 'contenido-partido'

        const inputL = document.createElement('input')
        inputL.type = 'number'
        inputL.value = golesLocal !== '-' ? golesLocal : ''
        inputL.min = 0

        const inputV = document.createElement('input')
        inputV.type = 'number'
        inputV.value = golesVisitante !== '-' ? golesVisitante : ''
        inputV.min = 0

        contenidoDiv.innerHTML = `<span>${m.local}</span> - <span>${m.visitante}</span>`
        contenidoDiv.appendChild(inputL)
        contenidoDiv.appendChild(inputV)

        const btnGuardar = document.createElement('button')
        btnGuardar.textContent = 'Guardar'
        btnGuardar.addEventListener('click', async () => {
          await saveResultado(
            guardado._id,
            Number(inputL.value),
            Number(inputV.value)
          )
          await renderClasificacion(container)
        })

        const btnBorrar = document.createElement('button')
        btnBorrar.textContent = 'Borrar'
        btnBorrar.addEventListener('click', async () => {
          await deleteResultado(guardado._id)
          await renderClasificacion(container)
        })

        div.appendChild(contenidoDiv)
        div.appendChild(btnGuardar)
        div.appendChild(btnBorrar)
      } else {
        div.textContent = `${m.local} ${golesLocal} - ${golesVisitante} ${m.visitante}`
      }
    }

    partidosWrapper.appendChild(div)
  })

  // Navegación jornada
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
