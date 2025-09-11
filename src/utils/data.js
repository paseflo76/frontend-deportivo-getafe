// utils/data.js
export const equipos = [
  'ARSENAL GETAFE',
  'BRAVO GETAFE',
  'CELTIC DE ESPARTA',
  'CERVEZAS CLUB',
  'DEPORTIVO GETAFE',
  'G  EMPRESAS AIRBUS',
  'LOS BRASAS',
  'OLIMPIC DE UCRANIA',
  'REAL CAMPO REAL',
  'SAN FRANCIS FC',
  'VILLABETIS'
]

// Calendario completo 22 jornadas (ida + vuelta)
export const calendario = [
  // Jornada 1
  [
    { fecha: '28-09-25' },
    { local: 'ARSENAL GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'SAN FRANCIS FC', visitante: 'DEPORTIVO GETAFE' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'LOS BRASAS' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'REAL CAMPO REAL' },
    { local: 'CERVEZAS CLUB', visitante: 'VILLABETIS' },
    { descansa: 'BRAVO GETAFE' }
  ],
  // Jornada 2
  [
    { fecha: '05-10-25' },
    { local: 'VILLABETIS', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'CERVEZAS CLUB' },
    { local: 'REAL CAMPO REAL', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'LOS BRASAS', visitante: 'SAN FRANCIS FC' },
    { descansa: 'CELTIC DE ESPARTA' }
  ],
  // Jornada 3
  [
    { fecha: '19-10-25' },
    { local: 'CELTIC DE ESPARTA', visitante: 'DEPORTIVO GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'LOS BRASAS' },
    { local: 'SAN FRANCIS FC', visitante: 'REAL CAMPO REAL' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'VILLABETIS' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'BRAVO GETAFE' },
    { descansa: 'CERVEZAS CLUB' }
  ],
  // Jornada 4
  [
    { fecha: '26-10-25' },
    { local: 'LOS BRASAS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'REAL CAMPO REAL', visitante: 'ARSENAL GETAFE' },
    { local: 'VILLABETIS', visitante: 'SAN FRANCIS FC' },
    { local: 'BRAVO GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'CERVEZAS CLUB', visitante: 'G  EMPRESAS AIRBUS' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 5
  [
    { fecha: '09-11-25' },
    { local: 'DEPORTIVO GETAFE', visitante: 'LOS BRASAS' },
    { local: 'CELTIC DE ESPARTA', visitante: 'REAL CAMPO REAL' },
    { local: 'ARSENAL GETAFE', visitante: 'VILLABETIS' },
    { local: 'SAN FRANCIS FC', visitante: 'BRAVO GETAFE' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'CERVEZAS CLUB' },
    { descansa: 'G  EMPRESAS AIRBUS' }
  ],
  // Jornada 6
  [
    { fecha: '16-11-25' },
    { local: 'REAL CAMPO REAL', visitante: 'DEPORIVO GETAFE' },
    { local: 'VILLABETIS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'BRAVO GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'SAN FRANCIS FC' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'OLIMPIC DE UCRANIA' },
    { descansa: 'LOS BRASAS' }
  ],
  // Jornada 7
  [
    { fecha: '23-11-25' },
    { local: 'LOS BRASAS', visitante: 'REAL CAMPO REAL' },
    { local: 'DEPORTIVO GETAFE', visitante: '' },
    { local: 'CELTIC DE ESPARTA', visitante: 'BRAVO GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'CERVEZAS CLUB' },
    { local: '', visitante: 'G  EMPRESAS AIRBUS' },
    { descansa: 'OLIMPIC DE UCRANIA' }
  ],
  // Jornada 8
  [
    { fecha: '30-11-25' },
    { local: 'VILLABETIS', visitante: 'LOS BRASAS' },
    { local: 'BRAVO GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'ARSENAL GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'CELTIC DE ESPARTA' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'SAN FRANCIS FC' },
    { descansa: 'REAL CAMPO REAL' }
  ],
  // Jornada 9
  [
    { fecha: '14-12-25' },
    { local: 'REAL CAMPO REAL', visitante: 'VILLABETIS' },
    { local: 'LOS BRASAS', visitante: 'BRAVO GETAFE' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CERVEZAS CLUB' },
    { local: 'CELTIC DE ESPARTA', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'ARSENAL GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { descansa: 'SAN FRANCIS FC' }
  ],
  // Jornada 10
  [
    { fecha: '21-12-25' },
    { local: 'BRAVO GETAFE', visitante: 'REAL CAMPO REAL' },
    { local: 'CERVEZAS CLUB', visitante: 'LOS BRASAS' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'CELTIC DE ESPARTA' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'DEPORTIVO GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'ARSENAL GETAFE' },
    { descansa: 'VILLABETIS' }
  ],
  // Jornada 11
  [
    { fecha: '11-01-26' },
    { local: 'VILLABETIS', visitante: 'BRAVO GETAFE' },
    { local: 'REAL CAMPO REAL', visitante: 'CERVEZAS CLUB' },
    { local: 'LOS BRASAS', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'CELTIC DE ESPARTA', visitante: 'SAN FRANCIS FC' },
    { descansa: 'ARSENAL GETAFE' }
  ],
  // Jornada 12
  [
    { fecha: '18-01-26' },
    { local: 'CELTIC DE ESPARTA', visitante: 'ARSENAL GETAFE' },
    { local: 'DEPORTIVO GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'LOS BRASAS', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'REAL CAMPO REAL', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'VILLABETIS', visitante: 'CERVEZAS CLUB' },
    { descansa: 'BRAVO GETAFE' }
  ],
  // Jornada 13
  [
    { fecha: '25-01-26' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'VILLABETIS' },
    { local: 'ARSENAL GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'BRAVO GETAFE' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'REAL CAMPO REAL' },
    { local: 'SAN FRANCIS FC', visitante: 'LOS BRASAS' },
    { descansa: 'CELTIC DE ESPARTA' }
  ],
  // Jornada 14
  [
    { fecha: '01-02-26' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'LOS BRASAS', visitante: 'ARSENAL GETAFE' },
    { local: 'REAL CAMPO REAL', visitante: 'SAN FRANCIS FC' },
    { local: 'VILLABETIS', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'BRAVO GETAFE', visitante: 'G  EMPRESAS AIRBUS' },
    { descansa: 'CERVEZAS CLUB' }
  ],
  // Jornada 15
  [
    { fecha: '08-02-26' },
    { local: 'CELTIC DE ESPARTA', visitante: 'LOS BRASAS' },
    { local: 'ARSENAL GETAFE', visitante: 'REAL CAMPO REAL' },
    { local: 'SAN FRANCIS FC', visitante: 'VILLABETIS' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'BRAVO GETAFE' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'CERVEZAS CLUB' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 16
  [
    { local: 'LOS BRASAS', visitante: 'DEPORTIVO GETAFE' },
    { local: 'REAL CAMPO REAL', visitante: 'CELTIC DE ESPARTA' },
    { local: 'VILLABETIS', visitante: 'ARSENAL GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'CERVEZAS CLUB', visitante: 'OLIMPIC DE UCRANIA' },
    { descansa: 'G  EMPRESAS AIRBUS' }
  ],
  // Jornada 17
  [
    { fecha: '22-02-26' },
    { local: 'DEPORIVO GETAFE', visitante: 'REAL CAMPO REAL' },
    { local: 'CELTIC DE ESPARTA', visitante: 'VILLABETIS' },
    { local: 'ARSENAL GETAFE', visitante: 'BRAVO GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'CERVEZAS CLUB' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'G  EMPRESAS AIRBUS' },
    { descansa: 'LOS BRASAS' }
  ],
  // Jornada 18
  [
    { fecha: '01-03-26' },
    { local: 'REAL CAMPO REAL', visitante: 'LOS BRASAS' },
    { local: 'VILLABETIS', visitante: 'DEPORTIVO GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'CERVEZAS CLUB', visitante: 'ARSENAL GETAFE' },
    { local: 'G  EMPRESAS AIRBUS', visitante: '' },
    { descansa: 'OLIMPIC DE UCRANIA' }
  ],
  // Jornada 19
  [
    { fecha: '08-03-26' },
    { local: 'LOS BRASAS', visitante: 'VILLABETIS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'BRAVO GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'CELTIC DE ESPARTA', visitante: 'CERVEZAS CLUB' },
    { local: 'SAN FRANCIS FC', visitante: 'OLIMPIC DE UCRANIA' },
    { descansa: 'REAL CAMPO REAL' }
  ],
  // Jornada 20
  [
    { fecha: '15-03-26' },
    { local: 'VILLABETIS', visitante: 'REAL CAMPO REAL' },
    { local: 'BRAVO GETAFE', visitante: 'LOS BRASAS' },
    { local: 'CERVEZAS CLUB', visitante: 'DEPORTIVO GETAFE' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'ARSENAL GETAFE' },
    { descansa: 'SAN FRANCIS FC' }
  ],
  // Jornada 21
  [
    { fecha: '22-03-26' },
    { local: 'REAL CAMPO REAL', visitante: 'BRAVO GETAFE' },
    { local: 'LOS BRASAS', visitante: 'CERVEZAS CLUB' },
    { local: 'CELTIC DE ESPARTA', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'DEPORTIVO GETAFE', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'ARSENAL GETAFE', visitante: 'SAN FRANCIS FC' },
    { descansa: 'VILLABETIS' }
  ],
  // Jornada 22
  [
    { fecha: '12-04-26' },
    { local: 'BRAVO GETAFE', visitante: 'VILLABETIS' },
    { local: 'CERVEZAS CLUB', visitante: 'REAL CAMPO REAL' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'LOS BRASAS' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'DEPORTIVO GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'CELTIC DE ESPARTA' },
    { descansa: 'ARSENAL GETAFE' }
  ]
]

// Inicializa resultados en localStorage
export function initResultados() {
  if (!localStorage.getItem('resultados')) {
    const init = calendario.map((jornada) =>
      jornada.map((m) => ({
        local: m.local,
        visitante: m.visitante,
        golesLocal: null,
        golesVisitante: null
      }))
    )
    localStorage.setItem('resultados', JSON.stringify(init))
    localStorage.setItem('jornadaActual', '1')
  }
}

export function getResultados() {
  return JSON.parse(localStorage.getItem('resultados')) || []
}

export function saveResultados(data) {
  localStorage.setItem('resultados', JSON.stringify(data))
  try {
    window.dispatchEvent(new Event('resultadosUpdated'))
  } catch (e) {
    // si hay entorno sin window, fallo silencioso
  }
}

export function getJornadaActual() {
  return Number(localStorage.getItem('jornadaActual') || '1')
}

export function nextJornada() {
  const j = getJornadaActual()
  localStorage.setItem('jornadaActual', String(j + 1))
  try {
    window.dispatchEvent(new Event('resultadosUpdated'))
  } catch (e) {}
}

export function prevJornada() {
  const j = getJornadaActual()
  if (j > 1) {
    localStorage.setItem('jornadaActual', String(j - 1))
    try {
      window.dispatchEvent(new Event('resultadosUpdated'))
    } catch {}
  }
}
