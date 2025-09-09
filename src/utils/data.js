// utils/data.js
export const equipos = [
  'ARSENAL GETAFE',
  'BRAVO GETAFE',
  'CELTIC DE ESPARTA',
  'CERVEZA CLUB',
  'DEPORTIVO GETAFE',
  'GRUPO DE EMPRESAS AIRBUS',
  'LOS BRASAS',
  'OLIMPIC DE UCRANIA',
  'REAL CAMPO REAL',
  'SAN FRANCIS FC',
  'VILLARETS'
]

// Calendario completo 22 jornadas (ida + vuelta)
export const calendario = [
  // Jornada 1
  [
    { local: 'ARSENAL GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'SAN FRANCIS FC', visitante: 'DEPORTIVO GETAFE' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'LOS BRASAS' },
    { local: 'GRUPO DE EMPRESAS AIRBUS', visitante: 'REAL CAMPO REAL' },
    { local: 'CERVEZA CLUB', visitante: 'VILLARETS' },
    { descansa: 'BRAVO GETAFE' }
  ],
  // Jornada 2
  [
    { local: 'ARSENAL GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'DEPORTIVO GETAFE', visitante: 'GRUPO DE EMPRESAS AIRBUS' },
    { local: 'CELTIC DE ESPARTA', visitante: 'CERVEZA CLUB' },
    { local: 'BRAVO GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'LOS BRASAS', visitante: 'VILLARETS' },
    { descansa: 'REAL CAMPO REAL' }
  ],
  // Jornada 3
  [
    { local: 'ARSENAL GETAFE', visitante: 'BRAVO GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'CELTIC DE ESPARTA' },
    { local: 'CERVEZA CLUB', visitante: 'REAL CAMPO REAL' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'VILLARETS' },
    { local: 'GRUPO DE EMPRESAS AIRBUS', visitante: 'LOS BRASAS' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 4
  [
    { local: 'ARSENAL GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'REAL CAMPO REAL', visitante: 'SAN FRANCIS FC' },
    { local: 'CELTIC DE ESPARTA', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'BRAVO GETAFE', visitante: 'CERVEZA CLUB' },
    { local: 'LOS BRASAS', visitante: 'VILLARETS' },
    { descansa: 'GRUPO DE EMPRESAS AIRBUS' }
  ],
  // Jornada 5
  [
    { local: 'ARSENAL GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'SAN FRANCIS FC', visitante: 'BRAVO GETAFE' },
    { local: 'VILLARETS', visitante: 'GRUPO DE EMPRESAS AIRBUS' },
    { local: 'CERVEZA CLUB', visitante: 'LOS BRASAS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { descansa: 'REAL CAMPO REAL' }
  ],
  // Jornada 6
  [
    { local: 'ARSENAL GETAFE', visitante: 'CERVEZA CLUB' },
    { local: 'GRUPO DE EMPRESAS AIRBUS', visitante: 'SAN FRANCIS FC' },
    { local: 'REAL CAMPO REAL', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'CELTIC DE ESPARTA', visitante: 'VILLARETS' },
    { local: 'BRAVO GETAFE', visitante: 'LOS BRASAS' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 7
  [
    { local: 'ARSENAL GETAFE', visitante: 'REAL CAMPO REAL' },
    { local: 'SAN FRANCIS FC', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'LOS BRASAS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'VILLARETS', visitante: 'DEPORTIVO GETAFE' },
    { local: 'CERVEZA CLUB', visitante: 'GRUPO DE EMPRESAS AIRBUS' },
    { descansa: 'BRAVO GETAFE' }
  ],
  // Jornada 8
  [
    { local: 'ARSENAL GETAFE', visitante: 'LOS BRASAS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'REAL CAMPO REAL' },
    { local: 'CELTIC DE ESPARTA', visitante: 'GRUPO DE EMPRESAS AIRBUS' },
    { local: 'BRAVO GETAFE', visitante: 'VILLARETS' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'CERVEZA CLUB' },
    { descansa: 'SAN FRANCIS FC' }
  ],
  // Jornada 9
  [
    { local: 'ARSENAL GETAFE', visitante: 'VILLARETS' },
    { local: 'SAN FRANCIS FC', visitante: 'LOS BRASAS' },
    { local: 'GRUPO DE EMPRESAS AIRBUS', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'REAL CAMPO REAL', visitante: 'CERVEZA CLUB' },
    { local: 'CELTIC DE ESPARTA', visitante: 'BRAVO GETAFE' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 10
  [
    { local: 'ARSENAL GETAFE', visitante: 'GRUPO DE EMPRESAS AIRBUS' },
    { local: 'SAN FRANCIS FC', visitante: 'CERVEZA CLUB' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'DEPORTIVO GETAFE' },
    { local: 'LOS BRASAS', visitante: 'REAL CAMPO REAL' },
    { local: 'VILLARETS', visitante: 'BRAVO GETAFE' },
    { descansa: 'CELTIC DE ESPARTA' }
  ],
  // Jornada 11
  [
    { local: 'ARSENAL GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'CELTIC DE ESPARTA', visitante: 'REAL CAMPO REAL' },
    { local: 'BRAVO GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'CERVEZA CLUB', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'VILLARETS', visitante: 'LOS BRASAS' },
    { descansa: 'GRUPO DE EMPRESAS AIRBUS' }
  ],
  // Jornada 12
  [
    { local: 'CELTIC DE ESPARTA', visitante: 'ARSENAL GETAFE' },
    { local: 'DEPORTIVO GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'LOS BRASAS', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'REAL CAMPO REAL', visitante: 'GRUPO DE EMPRESAS AIRBUS' },
    { local: 'VILLARETS', visitante: 'CERVEZA CLUB' },
    { descansa: 'BRAVO GETAFE' }
  ],
  // Jornada 13
  [
    { local: 'SAN FRANCIS FC', visitante: 'ARSENAL GETAFE' },
    { local: 'GRUPO DE EMPRESAS AIRBUS', visitante: 'DEPORTIVO GETAFE' },
    { local: 'CERVEZA CLUB', visitante: 'CELTIC DE ESPARTA' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'BRAVO GETAFE' },
    { local: 'VILLARETS', visitante: 'LOS BRASAS' },
    { descansa: 'REAL CAMPO REAL' }
  ],
  // Jornada 14
  [
    { local: 'BRAVO GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'CELTIC DE ESPARTA', visitante: 'SAN FRANCIS FC' },
    { local: 'REAL CAMPO REAL', visitante: 'CERVEZA CLUB' },
    { local: 'VILLARETS', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'LOS BRASAS', visitante: 'GRUPO DE EMPRESAS AIRBUS' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 15
  [
    { local: 'DEPORTIVO GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'REAL CAMPO REAL' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'CELTIC DE ESPARTA' },
    { local: 'CERVEZA CLUB', visitante: 'BRAVO GETAFE' },
    { local: 'VILLARETS', visitante: 'LOS BRASAS' },
    { descansa: 'GRUPO DE EMPRESAS AIRBUS' }
  ],
  // Jornada 16
  [
    { local: 'OLIMPIC DE UCRANIA', visitante: 'ARSENAL GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'GRUPO DE EMPRESAS AIRBUS', visitante: 'VILLARETS' },
    { local: 'LOS BRASAS', visitante: 'CERVEZA CLUB' },
    { local: 'CELTIC DE ESPARTA', visitante: 'DEPORTIVO GETAFE' },
    { descansa: 'REAL CAMPO REAL' }
  ],
  // Jornada 17
  [
    { local: 'CERVEZA CLUB', visitante: 'ARSENAL GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'GRUPO DE EMPRESAS AIRBUS' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'REAL CAMPO REAL' },
    { local: 'VILLARETS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'LOS BRASAS', visitante: 'BRAVO GETAFE' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 18
  [
    { local: 'REAL CAMPO REAL', visitante: 'ARSENAL GETAFE' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'SAN FRANCIS FC' },
    { local: 'CELTIC DE ESPARTA', visitante: 'LOS BRASAS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'VILLARETS' },
    { local: 'GRUPO DE EMPRESAS AIRBUS', visitante: 'CERVEZA CLUB' },
    { descansa: 'BRAVO GETAFE' }
  ],
  // Jornada 19
  [
    { local: 'LOS BRASAS', visitante: 'ARSENAL GETAFE' },
    { local: 'REAL CAMPO REAL', visitante: 'DEPORTIVO GETAFE' },
    { local: 'GRUPO DE EMPRESAS AIRBUS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'VILLARETS', visitante: 'BRAVO GETAFE' },
    { local: 'CERVEZA CLUB', visitante: 'OLIMPIC DE UCRANIA' },
    { descansa: 'SAN FRANCIS FC' }
  ],
  // Jornada 20
  [
    { local: 'VILLARETS', visitante: 'ARSENAL GETAFE' },
    { local: 'LOS BRASAS', visitante: 'SAN FRANCIS FC' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'GRUPO DE EMPRESAS AIRBUS' },
    { local: 'CERVEZA CLUB', visitante: 'REAL CAMPO REAL' },
    { local: 'BRAVO GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 21
  [
    { local: 'GRUPO DE EMPRESAS AIRBUS', visitante: 'ARSENAL GETAFE' },
    { local: 'CERVEZA CLUB', visitante: 'SAN FRANCIS FC' },
    { local: 'DEPORTIVO GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'REAL CAMPO REAL', visitante: 'LOS BRASAS' },
    { local: 'BRAVO GETAFE', visitante: 'VILLARETS' },
    { descansa: 'CELTIC DE ESPARTA' }
  ],
  // Jornada 22
  [
    { local: 'SAN FRANCIS FC', visitante: 'ARSENAL GETAFE' },
    { local: 'REAL CAMPO REAL', visitante: 'CELTIC DE ESPARTA' },
    { local: 'DEPORTIVO GETAFE', visitante: 'BRAVO GETAFE' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'CERVEZA CLUB' },
    { local: 'LOS BRASAS', visitante: 'VILLARETS' },
    { descansa: 'GRUPO DE EMPRESAS AIRBUS' }
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
}

export function getJornadaActual() {
  return Number(localStorage.getItem('jornadaActual') || '1')
}

export function nextJornada() {
  const j = getJornadaActual()
  localStorage.setItem('jornadaActual', String(j + 1))
}
