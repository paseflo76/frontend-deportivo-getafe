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

  // Filtro tipo
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

  // Formulario admin
  let adminForm
  if (user?.rol === 'admin') {
    adminForm = document.createElement('div')
    adminForm.className = 'admin-form'
    adminForm.innerHTML = `
      <input type="text" id="nombre" placeholder="Nombre">
      <input type="number" id="valor" placeholder="Cantidad">
    `
    const btnActualizar = Button(adminForm, 'Actualizar', 'secondary', 's')
    btnActualizar.addEventListener('click', async () => {
      const tipo = selectTipo.value
      const nombre = document.getElementById('nombre').value.trim()
      const valor = Number(document.getElementById('valor').value)
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

  async function mostrar() {
    const tipo = selectTipo.value
    const data = await apiCatch('/api/v2/stats')
    let html = '<table><thead><tr>'

    if (tipo === 'goles') {
      html += '<th>Pos</th><th>Jugador</th><th>Goles</th></tr><tbody>'
      data.jugadores
        .sort((a, b) => b.goles - a.goles)
        .forEach((j, i) => {
          html += `<tr><td>${i + 1}</td><td>${j.nombre}</td><td>${
            j.goles
          }</td></tr>`
        })
      html += '</tbody></table>'
    } else if (tipo === 'asistencias') {
      html += '<th>Pos</th><th>Jugador</th><th>Asistencias</th></tr><tbody>'
      data.jugadores
        .sort((a, b) => b.asistencias - a.asistencias)
        .forEach((j, i) => {
          html += `<tr><td>${i + 1}</td><td>${j.nombre}</td><td>${
            j.asistencias
          }</td></tr>`
        })
      html += '</tbody></table>'
    } else if (tipo === 'porteros') {
      html +=
        '<th>Pos</th><th>Portero</th><th>Promedio Goles Recibidos</th><th>Acciones</th></tr><tbody>'
      data.porteros
        .sort(
          (a, b) =>
            a.golesRecibidos / (a.partidos || 1) -
            b.golesRecibidos / (b.partidos || 1)
        )
        .forEach((p, i) => {
          const promedio = (p.golesRecibidos / (p.partidos || 1)).toFixed(2)
          html += `<tr>
            <td>${i + 1}</td>
            <td>${p.nombre}</td>
            <td>${promedio}</td>
            <td>${
              user?.rol === 'admin'
                ? `<button class="delete-portero" data-id="${p._id}">Eliminar</button>`
                : ''
            }</td>
          </tr>`
        })
      html += '</tbody></table>'
    }

    tablaWrapper.innerHTML = html

    // Event listeners para eliminar porteros solo si es admin
    if (tipo === 'porteros' && user?.rol === 'admin') {
      tablaWrapper.querySelectorAll('.delete-portero').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id
          await apiCatch(`/api/v2/stats/portero/${id}`, 'DELETE')
          mostrar()
        })
      })
    }
  }
}
