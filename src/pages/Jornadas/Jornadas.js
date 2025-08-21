import { renderJornadas } from '../../utils/jornadas/jornadas'
import './jornadas.css'

export const Jornadas = () => {
  const main = document.querySelector('main')
  container.innerHTML = `<div id="jornadas"></div>`
  renderJornadas('jornadas')
}
