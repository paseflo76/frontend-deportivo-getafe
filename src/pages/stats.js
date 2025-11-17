import './stats.css'
import { Button } from '../components/button/button.js'
import { apiCatch } from '../utils/fetch/fech.js'
import { parseJwt } from '../utils/data.js'

export async function Stats() {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''

  const container = document.createElement('div')
  container.id = 'stats'
  main.appendChild(container)

  const filtroDiv = document.createElement('div')
  filtroDiv.className = 'filtro-stats'
  const selectTipo = document.createElement('select')
  selectTipo.id = 'tipo'
  selectTipo.innerHTML = `
    <option value="goles">Goles</option>
    <option value="asistencias">Asistencias</option>
    <option value="porteros">Porteros</option>
  `
  filtroDiv.appendChild(selectTipo)
  container.appendChild(filtroDiv)

  const tablaWrapper = document.createElement('div')
  tablaWrapper.id = 'tabla'
  container.appendChild(tablaWrapper)

  const user = parseJwt(localStorage.getItem('token'))

  let adminForm
  if (user?.rol === 'admin') {
    adminForm = document.createElement('div')
    adminForm.className = 'admin-form'

    const selectNombre = document.createElement('select')
    selectNombre.id = 'nombre'

    const selectValor = document.createElement('select')
    selectValor.id = 'valor'
    for (let i = 1; i <= 5; i++) {
      const op = document.createElement('option')
      op.value = i
      op.textContent = i
      selectValor.appendChild(op)
    }

    adminForm.appendChild(selectNombre)
    adminForm.appendChild(selectValor)

    const btnActualizar = Button(adminForm, 'Actualizar', 'secondary', 's')
    btnActualizar.addEventListener('click', async () => {
      const tipo = selectTipo.value
      const nombre = selectNombre.value
      const valor = Number(selectValor.value)
      if (!nombre || isNaN(valor)) return

      if (tipo === 'porteros') {
        await apiCatch('/api/v2/stats/portero', 'POST', {
          nombre,
          golesRecibidos: valor,
          partidos: 1
        })
      } else {
        const data = { nombre }
        if (tipo === 'goles') data.goles = valor
        if (tipo === 'asistencias') data.asistencias = valor
        await apiCatch('/api/v2/stats/jugador', 'POST', data)
      }

      mostrar()
    })

    container.insertBefore(adminForm, tablaWrapper)
  }

  selectTipo.addEventListener('change', mostrar)
  mostrar()

  async function cargarNombres(tipo, statsData) {
    const selectNombre = document.getElementById('nombre')
    selectNombre.innerHTML = ''

    let lista = []
    if (tipo === 'porteros') lista = statsData.porteros
    else lista = statsData.jugadores

    lista.forEach((p) => {
      const op = document.createElement('option')
      op.value = p.nombre
      op.textContent = p.nombre
      selectNombre.appendChild(op)
    })
  }

  async function mostrar() {
    const tipo = selectTipo.value
    const data = await apiCatch('/api/v2/stats')

    if (user?.rol === 'admin') cargarNombres(tipo, data)

    let html = '<table><thead><tr>'

    if (tipo === 'goles') {
      html +=
        '<th>Pos</th><th>Jugador</th><th>Goles</th><th>Acciones</th></tr><tbody>'
      data.jugadores
        .sort((a, b) => b.goles - a.goles)
        .forEach((j, i) => {
          html += `
            <tr>
              <td>${i + 1}</td>
              <td>${j.nombre}</td>
              <td>${j.goles}</td>
              <td id="acciones-j-${j._id}"></td>
            </tr>
          `
        })
      html += '</tbody></table>'
    }

    if (tipo === 'asistencias') {
      html +=
        '<th>Pos</th><th>Jugador</th><th>Asistencias</th><th>Acciones</th></tr><tbody>'
      data.jugadores
        .sort((a, b) => b.asistencias - a.asistencias)
        .forEach((j, i) => {
          html += `
            <tr>
              <td>${i + 1}</td>
              <td>${j.nombre}</td>
              <td>${j.asistencias}</td>
              <td id="acciones-j-${j._id}"></td>
            </tr>
          `
        })
      html += '</tbody></table>'
    }

    if (tipo === 'porteros') {
      html +=
        '<th>Pos</th><th>Portero</th><th>Goles Recibidos</th><th>Partidos</th><th>Promedio</th><th>Acciones</th></tr><tbody>'
      data.porteros
        .sort(
          (a, b) =>
            a.golesRecibidos / (a.partidos || 1) -
            b.golesRecibidos / (b.partidos || 1)
        )
        .forEach((p, i) => {
          const promedio = (p.golesRecibidos / (p.partidos || 1)).toFixed(2)
          html += `
            <tr>
              <td>${i + 1}</td>
              <td>${p.nombre}</td>
              <td>${p.golesRecibidos}</td>
              <td>${p.partidos}</td>
              <td>${promedio}</td>
              <td id="acciones-p-${p._id}"></td>
            </tr>
          `
        })
      html += '</tbody></table>'
    }

    tablaWrapper.innerHTML = html

    if (user?.rol === 'admin') {
      if (tipo !== 'porteros') {
        data.jugadores.forEach((j) => {
          const td = document.getElementById(`acciones-j-${j._id}`)
          if (!td) return
          const btn = Button(td, 'Eliminar', 'danger', 's')
          btn.addEventListener('click', async () => {
            await apiCatch(`/api/v2/stats/jugador/${j._id}`, 'DELETE')
            mostrar()
          })
        })
      }

      if (tipo === 'porteros') {
        data.porteros.forEach((p) => {
          const td = document.getElementById(`acciones-p-${p._id}`)
          const btn = Button(td, 'Eliminar', 'danger', 's')
          btn.addEventListener('click', async () => {
            await apiCatch(`/api/v2/stats/portero/${p._id}`, 'DELETE')
            mostrar()
          })
        })
      }
    }
  }
}
