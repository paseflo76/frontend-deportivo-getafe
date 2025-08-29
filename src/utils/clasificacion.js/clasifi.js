import { apiCatch } from '../fetch/fech.js'

export async function renderClasificacion(container) {
  container.innerHTML = ''
  let data = []
  try {
    data = await apiCatch('/api/v2/league/classification')
  } catch (err) {
    container.textContent = 'Error al cargar la clasificación'
    return
  }

  if (!data || data.length === 0) {
    container.textContent = 'No hay datos de clasificación'
    return
  }

  const jornadaMax = Math.max(...data.map((m) => m.jornada))

  const h2 = document.createElement('h2')
  h2.textContent = `Clasificación después de la Jornada ${jornadaMax}`
  container.appendChild(h2)

  const table = document.createElement('table')
  table.className = 'tabla-clasificacion'
  table.innerHTML = `
    <thead>
      <tr>
        <th>Equipo</th>
        <th>Puntos</th>
        <th>GF</th>
        <th>GC</th>
        <th>DIF</th>
      </tr>
    </thead>
  `
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
