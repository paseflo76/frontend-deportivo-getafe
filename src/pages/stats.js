import './stats.css'
import { parseJwt } from '../utils/data.js'
import { Button } from '../components/button/button.js'
import { jugadores, porteros } from '../utils/dataStats.js'

export async function Stats() {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''

  const container = document.createElement('div')
  container.id = 'stats'
  main.appendChild(container)

  renderStats(container)
}

function renderStats(container) {
  container.innerHTML = ''

  const user = parseJwt(localStorage.getItem('token'))

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

  let adminForm
  if (user?.rol === 'admin') {
    adminForm = document.createElement('div')
    adminForm.className = 'admin-form'
    adminForm.innerHTML = `
      <input type="text" id="nombre" placeholder="Nombre">
      <input type="number" id="valor" placeholder="Cantidad">
    `
    const btnAgregar = Button(adminForm, 'Agregar', 'secondary', 'small')
    btnAgregar.addEventListener('click', agregar)
    container.insertBefore(adminForm, tablaWrapper)
  }

  selectTipo.addEventListener('change', mostrar)
  mostrar()

  function agregar() {
    if (user?.rol !== 'admin') return
    const tipo = selectTipo.value
    const nombre = document.getElementById('nombre').value.trim()
    const valor = Number(document.getElementById('valor').value)
    if (!nombre || isNaN(valor)) return

    if (tipo === 'porteros') {
      const porteroExistente = porteros.find((p) => p.nombre === nombre)
      if (porteroExistente) porteroExistente.golesRecibidos = valor
      else porteros.push({ nombre, golesRecibidos: valor, partidos: 1 })
    } else {
      const jugadorExistente = jugadores.find((j) => j.nombre === nombre)
      if (jugadorExistente) {
        if (tipo === 'goles') jugadorExistente.goles = valor
        if (tipo === 'asistencias') jugadorExistente.asistencias = valor
      } else {
        const nuevo = { nombre, goles: 0, asistencias: 0 }
        if (tipo === 'goles') nuevo.goles = valor
        if (tipo === 'asistencias') nuevo.asistencias = valor
        jugadores.push(nuevo)
      }
    }

    mostrar()
  }

  function mostrar() {
    const tipo = selectTipo.value
    let html = '<table><thead><tr>'

    if (tipo === 'porteros') {
      html += '<th>Portero</th><th>Promedio Goles Recibidos</th></tr>'
      html += '<tbody>'
      porteros.forEach((p) => {
        html += `<tr><td>${p.nombre}</td><td>${(
          p.golesRecibidos / (p.partidos || 1)
        ).toFixed(2)}</td></tr>`
      })
      html += '</tbody>'
    } else {
      html += '<th>Jugador</th><th>Goles</th><th>Asistencias</th></tr>'
      html += '<tbody>'
      jugadores.forEach((j) => {
        html += `<tr><td>${j.nombre}</td><td>${j.goles}</td><td>${j.asistencias}</td></tr>`
      })
      html += '</tbody>'
    }

    html += '</table>'
    tablaWrapper.innerHTML = html
  }
}
