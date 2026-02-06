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

  // Admin form (campos según tipo)
  let adminForm
  let selectNombre
  let inputNombrePortero
  let selectValor
  let currentId = null // id del jugador o portero a corregir

  if (user?.rol === 'admin') {
    adminForm = document.createElement('div')
    adminForm.className = 'admin-form'

    selectNombre = document.createElement('select')
    selectNombre.id = 'nombre'

    inputNombrePortero = document.createElement('input')
    inputNombrePortero.type = 'text'
    inputNombrePortero.id = 'nombre-portero'
    inputNombrePortero.placeholder = 'Nombre portero'
    inputNombrePortero.style.display = 'none'

    selectValor = document.createElement('select')
    selectValor.id = 'valor'
    for (let i = 0; i <= 5; i++) {
      const op = document.createElement('option')
      op.value = i
      op.textContent = i
      selectValor.appendChild(op)
    }

    adminForm.appendChild(selectNombre)
    adminForm.appendChild(inputNombrePortero)
    adminForm.appendChild(selectValor)

    const btnActualizar = Button(adminForm, 'Actualizar', 'secondary', 's')
    btnActualizar.addEventListener('click', async () => {
      const tipo = selectTipo.value
      const nombreFromSelect = selectNombre?.value
      const nombrePortero = inputNombrePortero?.value.trim()
      const nombre = tipo === 'porteros' ? nombrePortero : nombreFromSelect
      const valor = Number(selectValor.value)
      if (!nombre || isNaN(valor)) return

      if (currentId) {
        // Corregir un registro existente
        if (tipo === 'porteros') {
          await apiCatch(`/api/v2/stats/portero/${currentId}`, 'PUT', {
            golesRecibidos: valor
          })
        } else {
          const data =
            tipo === 'goles' ? { goles: valor } : { asistencias: valor }
          await apiCatch(`/api/v2/stats/jugador/${currentId}`, 'PUT', data)
        }
      } else {
        // Crear nuevo registro si no se seleccionó ninguno
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
      }

      currentId = null
      mostrar()
      if (tipo === 'porteros') inputNombrePortero.value = ''
      else selectNombre.selectedIndex = 0
      selectValor.selectedIndex = 0
    })

    container.insertBefore(adminForm, tablaWrapper)
  }

  selectTipo.addEventListener('change', mostrar)
  selectTipo.addEventListener('change', () => {
    ajustarAdminForm(selectTipo.value)
  })

  await mostrar()

  async function ajustarAdminForm(tipo) {
    if (!adminForm) return
    if (tipo === 'porteros') {
      selectNombre.style.display = 'none'
      inputNombrePortero.style.display = ''
      inputNombrePortero.focus()
    } else {
      selectNombre.style.display = ''
      inputNombrePortero.style.display = 'none'
    }
  }

  async function cargarNombresParaSelect(statsData) {
    if (!selectNombre) return
    selectNombre.innerHTML = ''
    const tipo = selectTipo.value
    const lista = tipo === 'porteros' ? statsData.porteros : statsData.jugadores
    lista.forEach((p) => {
      const op = document.createElement('option')
      op.value = p.nombre
      op.textContent = p.nombre
      if (p._id) op.dataset.id = p._id
      selectNombre.appendChild(op)
    })
  }

  async function mostrar() {
    const tipo = selectTipo.value
    const data = await apiCatch('/api/v2/stats')

    if (user?.rol === 'admin') {
      await cargarNombresParaSelect(data)
      ajustarAdminForm(tipo)
    }

    let html = '<table><thead><tr>'

    if (tipo === 'goles') {
      html +=
        '<th>Pos</th><th>Jugador</th><th>Goles</th><th>Acciones</th></tr><tbody>'
      data.jugadores
        .sort((a, b) => b.goles - a.goles)
        .forEach((j, i) => {
          const idAttr = j._id ? j._id : encodeURIComponent(j.nombre)
          html += `<tr>
            <td>${i + 1}</td>
            <td>${j.nombre}</td>
            <td>${j.goles}</td>
            <td id="acciones-j-${escapeId(idAttr)}"></td>
          </tr>`
        })
      html += '</tbody></table>'
    } else if (tipo === 'asistencias') {
      html +=
        '<th>Pos</th><th>Jugador</th><th>Asistencias</th><th>Acciones</th></tr><tbody>'
      data.jugadores
        .sort((a, b) => b.asistencias - a.asistencias)
        .forEach((j, i) => {
          const idAttr = j._id ? j._id : encodeURIComponent(j.nombre)
          html += `<tr>
            <td>${i + 1}</td>
            <td>${j.nombre}</td>
            <td>${j.asistencias}</td>
            <td id="acciones-j-${escapeId(idAttr)}"></td>
          </tr>`
        })
      html += '</tbody></table>'
    } else if (tipo === 'porteros') {
      html +=
        '<th>Pos</th><th>Portero</th><th>Goles Recibidos</th><th>Partidos</th><th>Coeficiente</th><th>Acciones</th></tr><tbody>'
      data.porteros
        .map((p) => ({
          ...p,
          coef: p.partidos > 0 ? p.golesRecibidos / p.partidos : Infinity
        }))
        .sort((a, b) => {
          // 1) mejor coeficiente Zamora
          if (a.coef !== b.coef) return a.coef - b.coef

          // 2) más partidos jugados
          if (a.partidos !== b.partidos) return b.partidos - a.partidos

          // 3) menos goles encajados
          return a.golesRecibidos - b.golesRecibidos
        })

      html += '</tbody></table>'
    }

    tablaWrapper.innerHTML = html

    if (user?.rol === 'admin') {
      if (tipo === 'porteros') {
        data.porteros.forEach((p) => {
          const td = document.getElementById(`acciones-p-${p._id}`)
          if (!td) return
          const btnEliminar = Button(td, 'Eliminar', 'danger', 's')
          btnEliminar.addEventListener('click', async () => {
            await apiCatch(`/api/v2/stats/portero/${p._id}`, 'DELETE')
            mostrar()
          })
          const btnCorregir = Button(td, 'Corregir', 'secondary', 's')
          btnCorregir.addEventListener('click', () => {
            inputNombrePortero.value = p.nombre
            selectValor.value = p.golesRecibidos
            currentId = p._id
            ajustarAdminForm('porteros')
          })
        })
      } else {
        data.jugadores.forEach((j) => {
          const idAttr = j._id ? j._id : encodeURIComponent(j.nombre)
          const td = document.getElementById(`acciones-j-${escapeId(idAttr)}`)
          if (!td) return
          const btnEliminar = Button(td, 'Eliminar', 'danger', 's')
          btnEliminar.addEventListener('click', async () => {
            try {
              if (j._id)
                await apiCatch(`/api/v2/stats/jugador/${j._id}`, 'DELETE')
              else
                await apiCatch(
                  `/api/v2/stats/jugador/${encodeURIComponent(j.nombre)}`,
                  'DELETE'
                )
              mostrar()
            } catch (err) {
              console.error('No se pudo eliminar jugador:', err)
              alert('No se pudo eliminar el jugador. Revisa la consola.')
            }
          })
          const btnCorregir = Button(td, 'Corregir', 'secondary', 's')
          btnCorregir.addEventListener('click', () => {
            selectNombre.value = j.nombre
            selectValor.value = tipo === 'goles' ? j.goles : j.asistencias
            currentId = j._id
            ajustarAdminForm(tipo)
          })
        })
      }
    }
  }

  function escapeId(s) {
    return String(s).replace(/[^a-zA-Z0-9\-_:.]/g, '_')
  }
}
