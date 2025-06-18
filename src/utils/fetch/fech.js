export const API_BASE = 'https://backend-deportivo-getafe.onrender.com'

export const apiCatch = async (
  url,
  method = 'GET',
  data = null,
  token = null
) => {
  const isFormData = data instanceof FormData

  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData) headers['Content-Type'] = 'application/json'

  // Si url es absoluta (empieza por http/https), usarla tal cual. Si no, concatenar con API_BASE
  const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : API_BASE + url

  const options = {
    method,
    headers,
    body: isFormData ? data : data ? JSON.stringify(data) : null
  }

  try {
    const res = await fetch(fullUrl, options)
    const contentType = res.headers.get('Content-Type') || ''
    const isJson = contentType.includes('application/json')
    const body = isJson ? await res.json() : null

    if (!res.ok) throw { status: res.status, body }
    return body
  } catch (error) {
    throw error
  }
}
