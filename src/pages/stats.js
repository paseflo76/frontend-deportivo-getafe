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

  const user = parseJwt(localStorage.getItem('token'))

  // ==========================================
  // PANEL DE ADMINISTRACIÓN
  // ==========================================

  let adminForm
  let selectNombre
  let inputNombrePortero
  let selectValor

  let currentId = null

  if (user?.rol === 'admin') {
    adminForm = document.createElement('div')

    adminForm.className = 'admin-form'

    // Selector de jugador
    selectNombre = document.createElement('select')

    selectNombre.id = 'nombre'

    // Nombre del portero
    inputNombrePortero = document.createElement('input')

    inputNombrePortero.id = 'nombre-portero'

    inputNombrePortero.placeholder = 'Nombre portero'

    inputNombrePortero.style.display = 'none'

    // Valor
    selectValor = document.createElement('select')

    selectValor.id = 'valor'

    for (let i = 0; i <= 20; i++) {
      const op = document.createElement('option')

      op.value = i

      op.textContent = i

      selectValor.appendChild(op)
    }

    adminForm.append(selectNombre, inputNombrePortero, selectValor)

    // Botón actualizar
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

      selectValor.value = '0'

      mostrar()
    })

    container.appendChild(adminForm)

    // ==========================================
    // BOTÓN REINICIAR TEMPORADA
    // ==========================================

    const resetContainer = document.createElement('div')

    resetContainer.className = 'reset-temporada'

    const btnReset = Button(
      resetContainer,
      'Reiniciar temporada',
      'danger',
      's'
    )

    btnReset.addEventListener('click', async () => {
      const confirmar = window.confirm(
        '¿Seguro que quieres reiniciar la temporada?\n\n' +
          'Se pondrán a 0 los goles, asistencias, goles recibidos y partidos de todos los jugadores y porteros.\n\n' +
          'Los jugadores NO serán eliminados.'
      )

      if (!confirmar) return

      try {
        await apiCatch('/api/v2/stats/reset', 'PUT')

        currentId = null

        await mostrar()

        window.alert('La temporada se ha reiniciado correctamente.')
      } catch (error) {
        console.error('Error al reiniciar la temporada:', error)

        window.alert('No se ha podido reiniciar la temporada.')
      }
    })

    container.appendChild(resetContainer)
  }

  // ==========================================
  // TABLA
  // ==========================================

  const tablaWrapper = document.createElement('div')

  tablaWrapper.id = 'tabla'

  container.appendChild(tablaWrapper)

  selectTipo.addEventListener('change', mostrar)

  await mostrar()

  // ==========================================
  // CARGAR NOMBRES
  // ==========================================

  function cargarNombresParaSelect(data) {
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

  // ==========================================
  // AJUSTAR FORMULARIO
  // ==========================================

  function ajustarAdminForm() {
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

  // ==========================================
  // MOSTRAR ESTADÍSTICAS
  // ==========================================

  async function mostrar() {
    const tipo = selectTipo.value

    const data = await apiCatch('/api/v2/stats')

    if (user?.rol === 'admin') {
      cargarNombresParaSelect(data)

      ajustarAdminForm()
    }

    let html = `
      <table class="tabla-${tipo}">
        <tbody>
    `

    // ==========================================
    // GOLES
    // ==========================================

    if (tipo === 'goles') {
      html += `
        <tr class="header">
          <td>#</td>
          <td>Jugador</td>
          <td>G</td>
          <td></td>
        </tr>
      `

      data.jugadores
        .sort((a, b) => b.goles - a.goles)
        .forEach((j, i) => {
          html += `
            <tr>
              <td>${i + 1}</td>
              <td>${j.nombre}</td>
              <td>${j.goles}</td>
              <td></td>
            </tr>
          `
        })
    }

    // ==========================================
    // ASISTENCIAS
    // ==========================================

    if (tipo === 'asistencias') {
      html += `
        <tr class="header">
          <td>#</td>
          <td>Jugador</td>
          <td>A</td>
          <td></td>
        </tr>
      `

      data.jugadores
        .sort((a, b) => b.asistencias - a.asistencias)
        .forEach((j, i) => {
          html += `
            <tr>
              <td>${i + 1}</td>
              <td>${j.nombre}</td>
              <td>${j.asistencias}</td>
              <td></td>
            </tr>
          `
        })
    }

    // ==========================================
    // PORTEROS
    // ==========================================

    if (tipo === 'porteros') {
      html += `
        <tr class="header">
          <td>#</td>
          <td>Portero</td>
          <td>GC</td>
          <td>PJ</td>
          <td>Coef</td>
          <td></td>
        </tr>
      `

      data.porteros
        .map((p) => ({
          ...p,
          coef: p.partidos ? p.golesRecibidos / p.partidos : Infinity
        }))
        .sort((a, b) => {
          // 1. Más partidos jugados
          if (a.partidos !== b.partidos) {
            return b.partidos - a.partidos
          }

          // 2. Mejor coeficiente
          if (a.coef !== b.coef) {
            return a.coef - b.coef
          }

          // 3. Menos goles encajados
          return a.golesRecibidos - b.golesRecibidos
        })
        .forEach((p, i) => {
          html += `
            <tr>
              <td>${i + 1}</td>
              <td>${p.nombre}</td>
              <td>${p.golesRecibidos}</td>
              <td>${p.partidos}</td>
              <td>${p.coef === Infinity ? '-' : p.coef.toFixed(2)}</td>
              <td></td>
            </tr>
          `
        })
    }

    html += `
        </tbody>
      </table>
    `

    tablaWrapper.innerHTML = html
  }
}
