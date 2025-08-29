import { renderClasificacion } from '../../utils/clasificacion/Clasificacion.js'
import { renderJornadas } from '../../utils/jornadas/jornadas.js'
import './clasificacion.css'

export const Clasificacion = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const divClasificacion = document.createElement('div')
  divClasificacion.id = 'clasificacion'
  main.appendChild(divClasificacion)

  const divJornadas = document.createElement('div')
  divJornadas.id = 'jornadas-clasificacion'
  main.appendChild(divJornadas)

  await renderClasificacion(divClasificacion)
  await renderJornadas(divJornadas, divClasificacion)
}
