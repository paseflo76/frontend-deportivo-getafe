import { renderClasificacion } from '../../utils/clasificacion.js/clasificacion.js'
import { renderJornadas } from '../../utils/jornadas/jornadas.js'
import './clasificacion.css'

export const Clasificacion = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  // Contenedor para clasificación
  const divClasificacion = document.createElement('div')
  divClasificacion.id = 'clasificacion'
  main.appendChild(divClasificacion)

  // Contenedor para jornadas (opcional, se puede quitar si solo quieres tabla)
  const divJornadas = document.createElement('div')
  divJornadas.id = 'jornadas-clasificacion'
  main.appendChild(divJornadas)

  // Renderizar clasificación
  await renderClasificacion(divClasificacion)

  // Renderizar jornadas debajo de la clasificación
  await renderJornadas(divJornadas, divClasificacion) // pasamos divClasificacion para actualizar
}
