export const API_BASE = 'https://backend-deportivo-getafe.onrender.com'

export const apiCatch = async (
  url,
  method = 'GET',
  data = null,
  token = null
) => {
  const isFormData = data instanceof FormData

  if (!token) token = localStorage.getItem('token')

  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const options = {
    method,
    headers,
    body: isFormData ? data : data ? JSON.stringify(data) : null
  }

  try {
    const res = await fetch(API_BASE + url, options)
    const contentType = res.headers.get('Content-Type') || ''
    const isJson = contentType.includes('application/json')
    const body = isJson ? await res.json() : null

    if (!res.ok) throw { status: res.status, body }
    return body
  } catch (error) {
    throw error
  }
}

// utils/data.js
export const equipos = [
  'ARSENAL GETAFE',
  'BRAVO GETAFE',
  'CELTIC DE ESPARTA',
  'CERVEZAS CLUB',
  'DEPORTIVO GETAFE',
  'G  EMPRESAS AIRBUS',
  'LOS BRASAS',
  'OLIMPICO UCRANIA',
  'CHACARITAS GETAFE',
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
    { local: 'OLIMPICO UCRANIA', visitante: 'LOS BRASAS' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'CHACARITAS GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'VILLABETIS' },
    { descansa: 'BRAVO GETAFE' }
  ],
  // Jornada 2
  [
    { fecha: '05-10-25' },
    { local: 'VILLABETIS', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'CERVEZAS CLUB' },
    { local: 'CHACARITAS GETAFE', visitante: 'OLIMPICO UCRANIA' },
    { local: 'LOS BRASAS', visitante: 'SAN FRANCIS FC' },
    { descansa: 'CELTIC DE ESPARTA' }
  ],
  // Jornada 3
  [
    { fecha: '19-10-25' },
    { local: 'CELTIC DE ESPARTA', visitante: 'DEPORTIVO GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'LOS BRASAS' },
    { local: 'SAN FRANCIS FC', visitante: 'CHACARITAS GETAFE' },
    { local: 'OLIMPICO UCRANIA', visitante: 'VILLABETIS' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'BRAVO GETAFE' },
    { descansa: 'CERVEZAS CLUB' }
  ],
  // Jornada 4
  [
    { fecha: '26-10-25' },
    { local: 'LOS BRASAS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'CHACARITAS GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'VILLABETIS', visitante: 'SAN FRANCIS FC' },
    { local: 'BRAVO GETAFE', visitante: 'OLIMPICO UCRANIA' },
    { local: 'CERVEZAS CLUB', visitante: 'G  EMPRESAS AIRBUS' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 5
  [
    { fecha: '09-11-25' },
    { local: 'DEPORTIVO GETAFE', visitante: 'LOS BRASAS' },
    { local: 'CELTIC DE ESPARTA', visitante: 'CHACARITAS GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'VILLABETIS' },
    { local: 'SAN FRANCIS FC', visitante: 'BRAVO GETAFE' },
    { local: 'OLIMPICO UCRANIA', visitante: 'CERVEZAS CLUB' },
    { descansa: 'G  EMPRESAS AIRBUS' }
  ],
  // Jornada 6
  [
    { fecha: '16-11-25' },
    { local: 'CHACARITAS GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'VILLABETIS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'BRAVO GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'SAN FRANCIS FC' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'OLIMPICO UCRANIA' },
    { descansa: 'LOS BRASAS' }
  ],
  // Jornada 7
  [
    { fecha: '23-11-25' },
    { local: 'LOS BRASAS', visitante: 'CHACARITAS GETAFE' },
    { local: 'DEPORTIVO GETAFE', visitante: 'VILLABETIS' },
    { local: 'CELTIC DE ESPARTA', visitante: 'BRAVO GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'CERVEZAS CLUB' },
    { local: 'SAN FRANCIS FC', visitante: 'G  EMPRESAS AIRBUS' },
    { descansa: 'OLIMPICO UCRANIA' }
  ],
  // Jornada 8
  [
    { fecha: '30-11-25' },
    { local: 'VILLABETIS', visitante: 'LOS BRASAS' },
    { local: 'BRAVO GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'ARSENAL GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'CELTIC DE ESPARTA' },
    { local: 'OLIMPICO UCRANIA', visitante: 'SAN FRANCIS FC' },
    { descansa: 'CHACARITAS GETAFE' }
  ],
  // Jornada 9
  [
    { fecha: '14-12-25' },
    { local: 'CHACARITAS GETAFE', visitante: 'VILLABETIS' },
    { local: 'LOS BRASAS', visitante: 'BRAVO GETAFE' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CERVEZAS CLUB' },
    { local: 'CELTIC DE ESPARTA', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'ARSENAL GETAFE', visitante: 'OLIMPICO UCRANIA' },
    { descansa: 'SAN FRANCIS FC' }
  ],
  // Jornada 10
  [
    { fecha: '21-12-25' },
    { local: 'BRAVO GETAFE', visitante: 'CHACARITAS GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'LOS BRASAS' },
    { local: 'OLIMPICO UCRANIA', visitante: 'CELTIC DE ESPARTA' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'DEPORTIVO GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'ARSENAL GETAFE' },
    { descansa: 'VILLABETIS' }
  ],
  // Jornada 11
  [
    { fecha: '11-01-26' },
    { local: 'VILLABETIS', visitante: 'BRAVO GETAFE' },
    { local: 'CHACARITAS GETAFE', visitante: 'CERVEZAS CLUB' },
    { local: 'LOS BRASAS', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'OLIMPICO UCRANIA' },
    { local: 'CELTIC DE ESPARTA', visitante: 'SAN FRANCIS FC' },
    { descansa: 'ARSENAL GETAFE' }
  ],
  // Jornada 12
  [
    { fecha: '18-01-26' },
    { local: 'CELTIC DE ESPARTA', visitante: 'ARSENAL GETAFE' },
    { local: 'DEPORTIVO GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'LOS BRASAS', visitante: 'OLIMPICO UCRANIA' },
    { local: 'CHACARITAS GETAFE', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'VILLABETIS', visitante: 'CERVEZAS CLUB' },
    { descansa: 'BRAVO GETAFE' }
  ],
  // Jornada 13
  [
    { fecha: '25-01-26' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'VILLABETIS' },
    { local: 'ARSENAL GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'BRAVO GETAFE' },
    { local: 'OLIMPICO UCRANIA', visitante: 'CHACARITAS GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'LOS BRASAS' },
    { descansa: 'CELTIC DE ESPARTA' }
  ],
  // Jornada 14
  [
    { fecha: '01-02-26' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'LOS BRASAS', visitante: 'ARSENAL GETAFE' },
    { local: 'CHACARITAS GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'VILLABETIS', visitante: 'OLIMPICO UCRANIA' },
    { local: 'BRAVO GETAFE', visitante: 'G  EMPRESAS AIRBUS' },
    { descansa: 'CERVEZAS CLUB' }
  ],
  // Jornada 15
  [
    { fecha: '08-02-26' },
    { local: 'CELTIC DE ESPARTA', visitante: 'LOS BRASAS' },
    { local: 'ARSENAL GETAFE', visitante: 'CHACARITAS GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'VILLABETIS' },
    { local: 'OLIMPICO UCRANIA', visitante: 'BRAVO GETAFE' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'CERVEZAS CLUB' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],
  // Jornada 16
  [
    { fecha: '14-02-26' },
    { local: 'LOS BRASAS', visitante: 'DEPORTIVO GETAFE' },
    { local: 'CHACARITAS GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'VILLABETIS', visitante: 'ARSENAL GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'CERVEZAS CLUB', visitante: 'OLIMPICO UCRANIA' },
    { descansa: 'G  EMPRESAS AIRBUS' }
  ],
  // Jornada 17
  [
    { fecha: '22-02-26' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CHACARITAS GETAFE' },
    { local: 'CELTIC DE ESPARTA', visitante: 'VILLABETIS' },
    { local: 'ARSENAL GETAFE', visitante: 'BRAVO GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'CERVEZAS CLUB' },
    { local: 'OLIMPICO UCRANIA', visitante: 'G  EMPRESAS AIRBUS' },
    { descansa: 'LOS BRASAS' }
  ],
  // Jornada 18
  [
    { fecha: '01-03-26' },
    { local: 'CHACARITAS GETAFE', visitante: 'LOS BRASAS' },
    { local: 'VILLABETIS', visitante: 'DEPORTIVO GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'CERVEZAS CLUB', visitante: 'ARSENAL GETAFE' },
    { local: 'G  EMPRESAS AIRBUS', visitante: '' },
    { descansa: 'OLIMPICO UCRANIA' }
  ],
  // Jornada 19
  [
    { fecha: '08-03-26' },
    { local: 'LOS BRASAS', visitante: 'VILLABETIS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'BRAVO GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'CELTIC DE ESPARTA', visitante: 'CERVEZAS CLUB' },
    { local: 'SAN FRANCIS FC', visitante: 'OLIMPICO UCRANIA' },
    { descansa: 'CHACARITAS GETAFE' }
  ],
  // Jornada 20
  [
    { fecha: '15-03-26' },
    { local: 'VILLABETIS', visitante: 'CHACARITAS GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'LOS BRASAS' },
    { local: 'CERVEZAS CLUB', visitante: 'DEPORTIVO GETAFE' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'OLIMPICO UCRANIA', visitante: 'ARSENAL GETAFE' },
    { descansa: 'SAN FRANCIS FC' }
  ],
  // Jornada 21
  [
    { fecha: '22-03-26' },
    { local: 'CHACARITAS GETAFE', visitante: 'BRAVO GETAFE' },
    { local: 'LOS BRASAS', visitante: 'CERVEZAS CLUB' },
    { local: 'CELTIC DE ESPARTA', visitante: 'OLIMPICO UCRANIA' },
    { local: 'DEPORTIVO GETAFE', visitante: 'G  EMPRESAS AIRBUS' },
    { local: 'ARSENAL GETAFE', visitante: 'SAN FRANCIS FC' },
    { descansa: 'VILLABETIS' }
  ],
  // Jornada 22
  [
    { fecha: '12-04-26' },
    { local: 'BRAVO GETAFE', visitante: 'VILLABETIS' },
    { local: 'CERVEZAS CLUB', visitante: 'CHACARITAS GETAFE' },
    { local: 'G  EMPRESAS AIRBUS', visitante: 'LOS BRASAS' },
    { local: 'OLIMPICO UCRANIA', visitante: 'DEPORTIVO GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'CELTIC DE ESPARTA' },
    { descansa: 'ARSENAL GETAFE' }
  ]
]

// Funciones API
export async function getResultados() {
  return await apiCatch('/api/v2/league/matches')
}

export async function saveResultado(id, golesLocal, golesVisitante) {
  return await apiCatch(`/api/v2/league/matches/${id}`, 'PUT', {
    golesLocal,
    golesVisitante
  })
}

export async function saveResultadoNew(
  local,
  visitante,
  golesLocal,
  golesVisitante,
  jornada
) {
  try {
    return await apiCatch('/api/v2/league/matches', 'POST', {
      local,
      visitante,
      golesLocal,
      golesVisitante,
      jornada
    })
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function deleteResultado(id) {
  return await apiCatch(`/api/v2/league/matches/${id}`, 'DELETE')
}

// JWT
export function parseJwt(token) {
  if (!token) return null
  const payload = token.split('.')[1]
  return JSON.parse(atob(payload))
}

// Jornada actual
export function getJornadaActual() {
  return Number(localStorage.getItem('jornadaActual') || '1')
}

export function setJornadaActual(jornada) {
  localStorage.setItem('jornadaActual', String(jornada))
}
