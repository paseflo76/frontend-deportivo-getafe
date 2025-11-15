import { apiCatch } from '../fetch/fech'

export const getEventos = async () => {
  try {
    // Solo '/eventos', API_BASE ya incluye /api/v2
    return await apiCatch('/eventos')
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    return []
  }
}
