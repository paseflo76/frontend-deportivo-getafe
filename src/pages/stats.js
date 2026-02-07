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

  let adminForm, selectNombre, inputNombrePortero, selectValor
  let currentId = null

  if (user?.rol === 'admin') {
    adminForm = document.createElement('div')
    adminForm.className = 'admin-form'

    selectNombre = document.createElement('select')
    selectNombre.id = 'nombre'

    inputNombrePortero = document.createElement('input')
    inputNombrePortero.id = 'nombre-portero'
    inputNombrePortero.placeholder = 'Nombre portero'
    inputNombrePortero.style.display = 'none'

    selectValor = document.createElement('select')
    selectValor.id = 'valor'
    for (let i = 0; i <= 20; i++) {
      const op = document.createElement('option')
      op.value = i
      op.textContent = i
      selectValor.appendChild(op)
    }

    adminForm.append(selectNombre, inputNombrePortero, selectValor)

    const btnActualizar = Button(adminForm, 'Actualizar', 'secondary', 's')
    btnActualizar.addEventListener('click', async () => {
      const tipo = selectTipo.value
      const nombre =
        tipo === 'porteros'
          ? inputNombrePortero.value.trim()
          : selectNombre.value
      const valor = Number(selectValor.value)
      if (!nombre) return

      if (currentId) {
        if (tipo === 'porteros') {
          await apiCatch(`/api/v2/stats/portero/${currentId}`, 'PUT', {
            golesRecibidos: valor
          })
        } else {
          await apiCatch(`/api/v2/stats/jugador/${currentId}`, 'PUT', {
            [tipo]: valor
          })
        }
      } else {
        if (tipo === 'porteros') {
          await apiCatch('/api/v2/stats/portero', 'POST', {
            nombre,
            golesRecibidos: valor,
            partidos: 1
          })
        } else {
          await apiCatch('/api/v2/stats/jugador', 'POST', {
            nombre,
            [tipo]: valor
          })
        }
      }

      currentId = null
      mostrar()
    })

    container.insertBefore(adminForm, tablaWrapper)
  }

  selectTipo.addEventListener('change', mostrar)
  await mostrar()

  async function cargarNombresParaSelect(data) {
    if (!selectNombre) return
    selectNombre.innerHTML = ''
    const lista =
      selectTipo.value === 'porteros' ? data.porteros : data.jugadores
    lista.forEach((p) => {
      const op = document.createElement('option')
      op.value = p.nombre
      op.textContent = p.nombre
      selectNombre.appendChild(op)
    })
  }

  async function ajustarAdminForm() {
    if (!adminForm) return
    const tipo = selectTipo.value
    if (tipo === 'porteros') {
      selectNombre.style.display = 'none'
      inputNombrePortero.style.display = ''
    } else {
      selectNombre.style.display = ''
      inputNombrePortero.style.display = 'none'
    }
  }

  async function mostrar() {
    const tipo = selectTipo.value
    const data = await apiCatch('/api/v2/stats')

    if (user?.rol === 'admin') {
      await cargarNombresParaSelect(data)
      ajustarAdminForm()
    }

    let html = `<table class="tabla-${tipo}"><tbody>`

    if (tipo === 'goles') {
      html += `<tr class="header"><td>#</td><td>Jugador</td><td>G</td><td></td></tr>`
      data.jugadores
        .sort((a, b) => b.goles - a.goles)
        .forEach((j, i) => {
          html += `<tr>
            <td>${i + 1}</td>
            <td>${j.nombre}</td>
            <td>${j.goles}</td>
            <td></td>
          </tr>`
        })
    }

    if (tipo === 'asistencias') {
      html += `<tr class="header"><td>#</td><td>Jugador</td><td>A</td><td></td></tr>`
      data.jugadores
        .sort((a, b) => b.asistencias - a.asistencias)
        .forEach((j, i) => {
          html += `<tr>
            <td>${i + 1}</td>
            <td>${j.nombre}</td>
            <td>${j.asistencias}</td>
            <td></td>
          </tr>`
        })
    }

    if (tipo === 'porteros') {
      html += `
        <tr class="header">
          <td>#</td><td>Portero</td><td>GC</td><td>PJ</td><td>Coef</td><td></td>
        </tr>`

      data.porteros
        .map((p) => ({
          ...p,
          coef: p.partidos ? p.golesRecibidos / p.partidos : Infinity
        }))
        .sort((a, b) => {
          // 1) prioridad a partidos jugados
          if (a.partidos !== b.partidos) {
            return b.partidos - a.partidos
          }

          // 2) coeficiente Zamora
          if (a.coef !== b.coef) {
            return a.coef - b.coef
          }

          // 3) menos goles encajados
          return a.golesRecibidos - b.golesRecibidos
        })

        .forEach((p, i) => {
          html += `<tr>
            <td>${i + 1}</td>
            <td>${p.nombre}</td>
            <td>${p.golesRecibidos}</td>
            <td>${p.partidos}</td>
            <td>${p.coef.toFixed(2)}</td>
            <td></td>
          </tr>`
        })
    }

    html += '</tbody></table>'
    tablaWrapper.innerHTML = html
  }
}
