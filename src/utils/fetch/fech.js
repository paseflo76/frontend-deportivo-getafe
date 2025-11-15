// apiCatch.js
export const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://backend-deportivo-getafe.onrender.com'

export const apiCatch = async (
  endpoint,
  method = 'GET',
  data = null,
  token = null
) => {
  const isFormData = data instanceof FormData

  // Tomar token si no se pasa
  if (!token) token = localStorage.getItem('token')

  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData && method !== 'GET')
    headers['Content-Type'] = 'application/json'

  const options = {
    method,
    headers,
    body: isFormData
      ? data
      : data && method !== 'GET'
      ? JSON.stringify(data)
      : null
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options)
    const contentType = res.headers.get('Content-Type') || ''
    const isJson = contentType.includes('application/json')
    const body = isJson ? await res.json() : null

    if (!res.ok) throw { status: res.status, body }
    return body
  } catch (error) {
    throw error
  }
}
