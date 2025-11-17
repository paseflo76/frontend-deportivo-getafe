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

  // Admin form (creamos campos pero mostraremos/ocultaremos según tipo)
  let adminForm
  let selectNombre // para goles/asistencias
  let inputNombrePortero // para porteros
  let selectValor

  if (user?.rol === 'admin') {
    adminForm = document.createElement('div')
    adminForm.className = 'admin-form'

    // select para jugadores/porteros (cuando proceda)
    selectNombre = document.createElement('select')
    selectNombre.id = 'nombre'

    // input libre para portero
    inputNombrePortero = document.createElement('input')
    inputNombrePortero.type = 'text'
    inputNombrePortero.id = 'nombre-portero'
    inputNombrePortero.placeholder = 'Nombre portero'
    inputNombrePortero.style.display = 'none'

    // select valor 1..5
    selectValor = document.createElement('select')
    selectValor.id = 'valor'
    for (let i = 1; i <= 5; i++) {
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
      // limpiar inputs
      if (tipo === 'porteros') inputNombrePortero.value = ''
      else selectNombre.selectedIndex = 0
      selectValor.selectedIndex = 0
    })

    container.insertBefore(adminForm, tablaWrapper)
  }

  selectTipo.addEventListener('change', mostrar)
  // también actualizar formulario admin al cambiar tipo
  selectTipo.addEventListener('change', () => {
    ajustarAdminForm(selectTipo.value)
  })

  await mostrar() // primera carga

  async function ajustarAdminForm(tipo) {
    if (!adminForm) return
    if (tipo === 'porteros') {
      // mostrar input libre, ocultar select listado
      selectNombre.style.display = 'none'
      inputNombrePortero.style.display = ''
      inputNombrePortero.focus()
    } else {
      // mostrar select listado, ocultar input libre
      selectNombre.style.display = ''
      inputNombrePortero.style.display = 'none'
    }
  }

  async function cargarNombresParaSelect(statsData) {
    if (!selectNombre) return
    selectNombre.innerHTML = ''
    const tipo = selectTipo.value
    const lista = tipo === 'porteros' ? statsData.porteros : statsData.jugadores
    // si la lista contiene objetos con _id o sin _id no importa: usamos nombre y, si hay _id, lo guardamos en data-id del option
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
        '<th>Pos</th><th>Portero</th><th>Goles Recibidos</th><th>Partidos</th><th>Promedio</th><th>Acciones</th></tr><tbody>'
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
            <td>${p.golesRecibidos}</td>
            <td>${p.partidos}</td>
            <td>${promedio}</td>
            <td id="acciones-p-${p._id}"></td>
          </tr>`
        })
      html += '</tbody></table>'
    }

    tablaWrapper.innerHTML = html

    // Crear botones eliminar (admin)
    if (user?.rol === 'admin') {
      if (tipo === 'porteros') {
        data.porteros.forEach((p) => {
          const td = document.getElementById(`acciones-p-${p._id}`)
          if (!td) return
          const btn = Button(td, 'Eliminar', 'danger', 's')
          btn.addEventListener('click', async () => {
            await apiCatch(`/api/v2/stats/portero/${p._id}`, 'DELETE')
            mostrar()
          })
        })
      } else {
        // jugadores: intentar borrar por _id; si no existe o la petición falla, borrar por nombre
        data.jugadores.forEach((j) => {
          const idAttr = j._id ? j._id : encodeURIComponent(j.nombre)
          const td = document.getElementById(`acciones-j-${escapeId(idAttr)}`)
          if (!td) return
          const btn = Button(td, 'Eliminar', 'danger', 's')
          btn.addEventListener('click', async () => {
            try {
              if (j._id) {
                await apiCatch(`/api/v2/stats/jugador/${j._id}`, 'DELETE')
              } else {
                // no _id: eliminar por nombre
                await apiCatch(
                  `/api/v2/stats/jugador/${encodeURIComponent(j.nombre)}`,
                  'DELETE'
                )
              }
            } catch (err) {
              // si falla con id, intentar por nombre
              try {
                await apiCatch(
                  `/api/v2/stats/jugador/${encodeURIComponent(j.nombre)}`,
                  'DELETE'
                )
              } catch (err2) {
                console.error('No se pudo eliminar jugador:', err2)
                alert('No se pudo eliminar el jugador. Revisa la consola.')
                return
              }
            }
            mostrar()
          })
        })
      }
    }
  }

  // Helper: generar id seguro para atributo DOM (quita caracteres problemáticos)
  function escapeId(s) {
    return String(s).replace(/[^a-zA-Z0-9\-_:.]/g, '_')
  }
}
