export const API_BASE = 'https://pryecto10backend-3.onrender.com'

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

  const options = {
    method,
    headers,
    body: isFormData ? data : data ? JSON.stringify(data) : null
  }

  try {
    const res = await fetch(url, options)
    const contentType = res.headers.get('Content-Type') || ''
    const isJson = contentType.includes('application/json')
    const body = isJson ? await res.json() : null

    if (!res.ok) throw { status: res.status, body }
    return body
  } catch (error) {
    throw error
  }
}
