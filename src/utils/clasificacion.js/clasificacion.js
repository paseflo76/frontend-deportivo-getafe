import { apiCatch } from './api.js'

export async function renderClasificacion(containerId) {
  const data = await apiCatch('/v2/Match/classification')

  const container = document.getElementById(containerId)
  container.innerHTML = ''

  const table = document.createElement('table')
  table.className = 'tabla-clasificacion'

  const thead = document.createElement('thead')
  thead.innerHTML = `
    <tr>
      <th>Equipo</th>
      <th>Puntos</th>
      <th>GF</th>
      <th>GC</th>
      <th>DIF</th>
    </tr>
  `
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  data.forEach((e) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${e.equipo}</td>
      <td>${e.puntos}</td>
      <td>${e.gf}</td>
      <td>${e.gc}</td>
      <td>${e.gf - e.gc}</td>
    `
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)

  container.appendChild(table)
}
