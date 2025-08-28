// pages/jornadas/jornadas.js
import { renderJornadas } from '../../utils/jornadas/jornadas'
import './jornadas.css'

export const Jornadas = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const div = document.createElement('div')
  div.id = 'jornadas'
  main.appendChild(div)

  await renderJornadas(div) // pasar el elemento DOM
}
