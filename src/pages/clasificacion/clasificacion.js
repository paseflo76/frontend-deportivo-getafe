import { renderClasificacion } from '../../utils/clasificacion.js/clasificacion'
import './clasificacion.css'

export const Clasificacion = async () => {
  const main = document.querySelector('main')
  main.innerHTML = `<div id="clasificacion"></div>`
  await renderClasificacion('clasificacion') // pasar id como string
}
