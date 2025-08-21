// pages/clasificacion/clasificacion.js
import { renderClasificacion } from '../../utils/clasificacion.js/clasificacion'
import './clasificacion.css'

export const Clasificacion = async () => {
  const main = document.querySelector('main')
  main.innerHTML = `<div id="clasificacion"></div>`
  const container = document.querySelector('main div')
  await renderClasificacion(container)
}
