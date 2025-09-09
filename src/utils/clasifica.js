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
