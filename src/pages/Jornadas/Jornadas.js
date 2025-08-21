import { renderJornadas } from '../../utils/jornadas/jornadas'
import './jornadas.css'

export const Jornadas = () => {
  const container = document.getElementById('main')
  container.innerHTML = `<div id="jornadas"></div>`
  renderJornadas('jornadas')
}
