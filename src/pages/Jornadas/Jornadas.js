// pages/jornadas/jornadas.js
import { apiCatch } from '../fetch/fech.js'
import { parseJwt } from '../../components/Header/Header.js'

export async function renderJornadas(container, divClasificacion = null) {
  // ... código igual ...
}

// Export nombrado para Header.js
export const Jornadas = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''
  const div = document.createElement('div')
  main.appendChild(div)
  await renderJornadas(div)
}
