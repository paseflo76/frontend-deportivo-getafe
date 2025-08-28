// pages/jornadas/jornadas.js
import { renderJornadas } from '../../utils/jornadas/jornadas'
import './Jornadas.css'

export const Jornadas = async () => {
  const main = document.querySelector('main')
  main.innerHTML = `<div id="jornadas"></div>`
  const container = document.querySelector('main div')
  await renderJornadas(container)
}
