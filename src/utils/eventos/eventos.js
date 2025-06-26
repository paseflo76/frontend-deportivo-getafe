import { apiCatch } from '../api'

export const getEventos = async () => {
  try {
    return await apiCatch('/api/v2/eventos')
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    return []
  }
}
