export const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/v2'
    : 'https://backend-deportivo-getafe.onrender.com/api/v2'

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
  'CHACARITAS GETAFE',
  'DEPORTIVO GETAFE',
  'G.E AIRBUS',
  'LOS BRASAS',
  'OLIMPIC DE UCRANIA',
  'SAN FRANCIS FC',
  'CAFETEROS FC',
  'CERVEZAS CLUB'
]

// Calendario completo 22 jornadas (ida + vuelta)
export const calendario = [
  // JORNADA 1
  [
    { fecha: '27-09-26' },
    { local: 'ARSENAL GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'SAN FRANCIS FC', visitante: 'CHACARITAS GETAFE' },
    { local: 'LOS BRASAS', visitante: 'G.E AIRBUS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'CERVEZAS CLUB', visitante: 'BRAVO GETAFE' },
    { descansa: 'CAFETEROS FC' }
  ],

  // JORNADA 2
  [
    { fecha: '04-10-26' },
    { local: 'CELTIC DE ESPARTA', visitante: 'CERVEZAS CLUB' },
    { local: 'CHACARITAS GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'G.E AIRBUS', visitante: 'SAN FRANCIS FC' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'LOS BRASAS' },
    { local: 'CAFETEROS FC', visitante: 'DEPORTIVO GETAFE' },
    { descansa: 'BRAVO GETAFE' }
  ],

  // JORNADA 3
  [
    { fecha: '18-10-26' },
    { local: 'CELTIC DE ESPARTA', visitante: 'CHACARITAS GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'G.E AIRBUS' },
    { local: 'SAN FRANCIS FC', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'LOS BRASAS', visitante: 'CAFETEROS FC' },
    { local: 'DEPORTIVO GETAFE', visitante: 'BRAVO GETAFE' },
    { descansa: 'CERVEZAS CLUB' }
  ],

  // JORNADA 4
  [
    { fecha: '25-10-26' },
    { local: 'CHACARITAS GETAFE', visitante: 'CERVEZAS CLUB' },
    { local: 'G.E AIRBUS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'ARSENAL GETAFE' },
    { local: 'CAFETEROS FC', visitante: 'SAN FRANCIS FC' },
    { local: 'BRAVO GETAFE', visitante: 'LOS BRASAS' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],

  // JORNADA 5
  [
    { fecha: '08-11-26' },
    { local: 'CHACARITAS GETAFE', visitante: 'G.E AIRBUS' },
    { local: 'CELTIC DE ESPARTA', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'ARSENAL GETAFE', visitante: 'CAFETEROS FC' },
    { local: 'SAN FRANCIS FC', visitante: 'BRAVO GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'DEPORTIVO GETAFE' },
    { descansa: 'LOS BRASAS' }
  ],

  // JORNADA 6
  [
    { fecha: '15-11-26' },
    { local: 'G.E AIRBUS', visitante: 'CERVEZAS CLUB' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'CHACARITAS GETAFE' },
    { local: 'CAFETEROS FC', visitante: 'CELTIC DE ESPARTA' },
    { local: 'BRAVO GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'LOS BRASAS', visitante: 'DEPORTIVO GETAFE' },
    { descansa: 'SAN FRANCIS FC' }
  ],

  // JORNADA 7
  [
    { fecha: '22-11-26' },
    { local: 'G.E AIRBUS', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'CHACARITAS GETAFE', visitante: 'CAFETEROS FC' },
    { local: 'CELTIC DE ESPARTA', visitante: 'BRAVO GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'DEPORTIVO GETAFE' },
    { local: 'CERVEZAS CLUB', visitante: 'LOS BRASAS' },
    { descansa: 'ARSENAL GETAFE' }
  ],

  // JORNADA 8
  [
    { fecha: '29-11-26' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'CERVEZAS CLUB' },
    { local: 'CAFETEROS FC', visitante: 'G.E AIRBUS' },
    { local: 'BRAVO GETAFE', visitante: 'CHACARITAS GETAFE' },
    { local: 'DEPORTIVO GETAFE', visitante: 'ARSENAL GETAFE' },
    { local: 'LOS BRASAS', visitante: 'SAN FRANCIS FC' },
    { descansa: 'CELTIC DE ESPARTA' }
  ],

  // JORNADA 9
  [
    { fecha: '13-12-26' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'CAFETEROS FC' },
    { local: 'G.E AIRBUS', visitante: 'BRAVO GETAFE' },
    { local: 'CHACARITAS GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'LOS BRASAS' },
    { local: 'CERVEZAS CLUB', visitante: 'SAN FRANCIS FC' },
    { descansa: 'CELTIC DE ESPARTA' }
  ],

  // JORNADA 10
  [
    { fecha: '20-12-26' },
    { local: 'CERVEZAS CLUB', visitante: 'CAFETEROS FC' },
    { local: 'BRAVO GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CHACARITAS GETAFE' },
    { local: 'LOS BRASAS', visitante: 'CELTIC DE ESPARTA' },
    { local: 'SAN FRANCIS FC', visitante: 'ARSENAL GETAFE' },
    { descansa: 'G.E AIRBUS' }
  ],

  // JORNADA 11
  [
    { fecha: '10-01-27' },
    { local: 'CAFETEROS FC', visitante: 'BRAVO GETAFE' },
    { local: 'G.E AIRBUS', visitante: 'DEPORTIVO GETAFE' },
    { local: 'CHACARITAS GETAFE', visitante: 'LOS BRASAS' },
    { local: 'CELTIC DE ESPARTA', visitante: 'SAN FRANCIS FC' },
    { local: 'ARSENAL GETAFE', visitante: 'CERVEZAS CLUB' },
    { descansa: 'OLIMPIC DE UCRANIA' }
  ],

  // JORNADA 12
  [
    { fecha: '17-01-27' },
    { local: 'CELTIC DE ESPARTA', visitante: 'ARSENAL GETAFE' },
    { local: 'CHACARITAS GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'G.E AIRBUS', visitante: 'LOS BRASAS' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'DEPORTIVO GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'CERVEZAS CLUB' },
    { descansa: 'CAFETEROS FC' }
  ],

  // JORNADA 13
  [
    { fecha: '24-01-27' },
    { local: 'CERVEZAS CLUB', visitante: 'CELTIC DE ESPARTA' },
    { local: 'ARSENAL GETAFE', visitante: 'CHACARITAS GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'G.E AIRBUS' },
    { local: 'LOS BRASAS', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CAFETEROS FC' },
    { descansa: 'BRAVO GETAFE' }
  ],

  // JORNADA 14
  [
    { fecha: '31-01-27' },
    { local: 'CHACARITAS GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'G.E AIRBUS', visitante: 'ARSENAL GETAFE' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'SAN FRANCIS FC' },
    { local: 'CAFETEROS FC', visitante: 'LOS BRASAS' },
    { local: 'BRAVO GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { descansa: 'CERVEZAS CLUB' }
  ],

  // JORNADA 15
  [
    { fecha: '07-02-27' },
    { local: 'CERVEZAS CLUB', visitante: 'CHACARITAS GETAFE' },
    { local: 'CELTIC DE ESPARTA', visitante: 'G.E AIRBUS' },
    { local: 'ARSENAL GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'SAN FRANCIS FC', visitante: 'CAFETEROS FC' },
    { local: 'LOS BRASAS', visitante: 'BRAVO GETAFE' },
    { descansa: 'DEPORTIVO GETAFE' }
  ],

  // JORNADA 16
  [
    { fecha: '14-02-27' },
    { local: 'G.E AIRBUS', visitante: 'CHACARITAS GETAFE' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'CELTIC DE ESPARTA' },
    { local: 'CAFETEROS FC', visitante: 'ARSENAL GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CERVEZAS CLUB' },
    { descansa: 'LOS BRASAS' }
  ],

  // JORNADA 17
  [
    { fecha: '21-02-27' },
    { local: 'CERVEZAS CLUB', visitante: 'G.E AIRBUS' },
    { local: 'CHACARITAS GETAFE', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'CELTIC DE ESPARTA', visitante: 'CAFETEROS FC' },
    { local: 'ARSENAL GETAFE', visitante: 'BRAVO GETAFE' },
    { local: 'LOS BRASAS', visitante: 'DEPORTIVO GETAFE' },
    { descansa: 'SAN FRANCIS FC' }
  ],

  // JORNADA 18
  [
    { fecha: '28-02-27' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'G.E AIRBUS' },
    { local: 'CAFETEROS FC', visitante: 'CHACARITAS GETAFE' },
    { local: 'BRAVO GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'DEPORTIVO GETAFE', visitante: 'SAN FRANCIS FC' },
    { local: 'LOS BRASAS', visitante: 'CERVEZAS CLUB' },
    { descansa: 'ARSENAL GETAFE' }
  ],

  // JORNADA 19
  [
    { fecha: '07-03-27' },
    { local: 'CERVEZAS CLUB', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'G.E AIRBUS', visitante: 'CAFETEROS FC' },
    { local: 'CHACARITAS GETAFE', visitante: 'BRAVO GETAFE' },
    { local: 'ARSENAL GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'LOS BRASAS' },
    { descansa: 'CELTIC DE ESPARTA' }
  ],

  // JORNADA 20
  [
    { fecha: '14-03-27' },
    { local: 'CAFETEROS FC', visitante: 'OLIMPIC DE UCRANIA' },
    { local: 'BRAVO GETAFE', visitante: 'G.E AIRBUS' },
    { local: 'DEPORTIVO GETAFE', visitante: 'CELTIC DE ESPARTA' },
    { local: 'LOS BRASAS', visitante: 'ARSENAL GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'CERVEZAS CLUB' },
    { descansa: 'CHACARITAS GETAFE' }
  ],

  // JORNADA 21
  [
    { fecha: '04-04-27' },
    { local: 'CAFETEROS FC', visitante: 'CERVEZAS CLUB' },
    { local: 'OLIMPIC DE UCRANIA', visitante: 'BRAVO GETAFE' },
    { local: 'CHACARITAS GETAFE', visitante: 'DEPORTIVO GETAFE' },
    { local: 'CELTIC DE ESPARTA', visitante: 'LOS BRASAS' },
    { local: 'ARSENAL GETAFE', visitante: 'SAN FRANCIS FC' },
    { descansa: 'G.E AIRBUS' }
  ],

  // JORNADA 22
  [
    { fecha: '11-04-27' },
    { local: 'BRAVO GETAFE', visitante: 'CAFETEROS FC' },
    { local: 'DEPORTIVO GETAFE', visitante: 'G.E AIRBUS' },
    { local: 'LOS BRASAS', visitante: 'CHACARITAS GETAFE' },
    { local: 'SAN FRANCIS FC', visitante: 'CELTIC DE ESPARTA' },
    { local: 'CERVEZAS CLUB', visitante: 'ARSENAL GETAFE' },
    { descansa: 'OLIMPIC DE UCRANIA' }
  ]
]

// Funciones API
export async function getResultados() {
  return await apiCatch('/league/matches')
}

export async function saveResultado(id, golesLocal, golesVisitante) {
  return await apiCatch(`/league/matches/${id}`, 'PUT', {
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
    return await apiCatch('/league/matches', 'POST', {
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
  return await apiCatch(`/league/matches/${id}`, 'DELETE')
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
