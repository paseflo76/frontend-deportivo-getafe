import './jornadas.css'
import { renderJornadas } from '../../utils/jornadas.js'

export const Jornadas = () => {
  const container = document.getElementById('main-content')
  container.innerHTML = `<div id="jornadas"></div>`
  renderJornadas('jornadas')
}
