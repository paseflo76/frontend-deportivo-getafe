import { apiCatch } from '../utils/api.js'
import { parseJwt } from '../utils/data.js'
import { Button } from '../components/button/button.js'

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
    adminForm.innerHTML = `
      <input type="text" id="nombre" placeholder="Nombre">
      <input type="number" id="valor" placeholder="Cantidad">
    `
    const btnAgregar = Button(adminForm, 'Actualizar', 'secondary', 'small')
    btnAgregar.addEventListener('click', async () => {
      const tipo = selectTipo.value
      const nombre = document.getElementById('nombre').value.trim()
      const valor = Number(document.getElementById('valor').value)
      if (!nombre || isNaN(valor)) return

      if (tipo === 'porteros') {
        await apiCatch('/stats/portero', 'POST', {
          nombre,
          golesRecibidos: valor,
          partidos: 1
        })
      } else {
        const data = { nombre }
        if (tipo === 'goles') data.goles = valor
        if (tipo === 'asistencias') data.asistencias = valor
        await apiCatch('/stats/jugador', 'POST', data)
      }
      mostrar()
    })
    container.insertBefore(adminForm, tablaWrapper)
  }

  selectTipo.addEventListener('change', mostrar)
  mostrar()

  async function mostrar() {
    const tipo = selectTipo.value
    const data = await apiCatch('/stats')
    let html = '<table><thead><tr>'

    if (tipo === 'porteros') {
      html += '<th>Portero</th><th>Promedio Goles Recibidos</th></tr><tbody>'
      data.porteros.forEach((p) => {
        html += `<tr><td>${p.nombre}</td><td>${(
          p.golesRecibidos / (p.partidos || 1)
        ).toFixed(2)}</td></tr>`
      })
      html += '</tbody>'
    } else {
      html += '<th>Jugador</th><th>Goles</th><th>Asistencias</th></tr><tbody>'
      data.jugadores.forEach((j) => {
        html += `<tr><td>${j.nombre}</td><td>${j.goles}</td><td>${j.asistencias}</td></tr>`
      })
      html += '</tbody>'
    }

    html += '</table>'
    tablaWrapper.innerHTML = html
  }
}
