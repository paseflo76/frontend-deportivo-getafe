// pages/jornadas/jornadas.js
import { renderJornadas } from '../../utils/jornadas/jornadas'
import './jornadas.css'

export const Jornadas = async () => {
  const main = document.querySelector('main')
  main.innerHTML = `<div id="jornadas"></div>`
  await renderJornadas('jornadas') // pasar id como string
}
