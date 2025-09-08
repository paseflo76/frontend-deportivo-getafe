/* import { apiCatch } from '../fetch/fech.js'

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
} */
import { equipos, getResultados, getJornadaActual } from './data.js'

export function calcularClasificacion() {
  const tabla = equipos.map((e) => ({
    equipo: e,
    puntos: 0,
    gf: 0,
    gc: 0,
    dif: 0
  }))

  const jornadaMax = getJornadaActual()
  const resultados = getResultados()

  for (let j = 0; j < jornadaMax; j++) {
    resultados[j].forEach((m) => {
      if (m.local && m.golesLocal != null && m.golesVisitante != null) {
        const local = tabla.find((t) => t.equipo === m.local)
        const visitante = tabla.find((t) => t.equipo === m.visitante)

        local.gf += m.golesLocal
        local.gc += m.golesVisitante
        visitante.gf += m.golesVisitante
        visitante.gc += m.golesLocal

        if (m.golesLocal > m.golesVisitante) local.puntos += 3
        else if (m.golesLocal < m.golesVisitante) visitante.puntos += 3
        else {
          local.puntos += 1
          visitante.puntos += 1
        }
      }
    })
  }

  tabla.forEach((t) => (t.dif = t.gf - t.gc))

  tabla.sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos
    if (b.dif !== a.dif) return b.dif - a.dif
    return b.gf - a.gf
  })

  return { tabla, jornadaMax }
}
