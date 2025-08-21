import { renderClasificacion } from '../../utils/clasificacion.js/clasificacion'
import './clasificacion.css'

export const Clasificacion = () => {
  const container = document.getElementById('main')
  container.innerHTML = `<div id="clasificacion"></div>`
  renderClasificacion('clasificacion')
}
