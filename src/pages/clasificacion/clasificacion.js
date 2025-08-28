import { renderClasificacion } from '../../utils/clasificacion.js/clasificacion'
import './clasificacion.css'

export const Clasificacion = async () => {
  const main = document.querySelector('main')
  main.innerHTML = '' // limpiar contenido previo

  const div = document.createElement('div')
  div.id = 'clasificacion'
  main.appendChild(div)

  await renderClasificacion(div) // pasar el elemento DOM
}
