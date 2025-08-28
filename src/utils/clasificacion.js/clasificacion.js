import { apiCatch } from '../fetch/fech.js'

export async function renderClasificacion(container) {
  // recibe elemento DOM
  container.innerHTML = ''
  let data = []
  try {
    data = await apiCatch('/api/v2/match/classification')
  } catch (err) {
    container.textContent = 'Error al cargar la clasificación'
    console.error(err)
    return
  }

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
