/* import './Home.css'

import { printEventos } from '../../components/cardEvent/cardEvent'
import { getEventos } from '../../utils/eventos/eventos'

export const Home = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const container = document.createElement('div')
  container.className = 'Home-container'

  const header = document.createElement('div')
  header.className = 'home-header'

  const titulo = document.createElement('h1')
  titulo.textContent = 'Eventos del Club Deportivo Getafe'
  titulo.className = 'home-title'

  const descripcion = document.createElement('p')
  descripcion.textContent =
    'Consulta aquí los próximos eventos del club y confirma tu asistencia.'
  descripcion.className = 'home-description'

  header.append(titulo, descripcion)

  const listaEventos = document.createElement('div')
  listaEventos.className = 'lista-eventos'

  const eventos = await getEventos()
  printEventos(eventos, listaEventos)

  container.append(header, listaEventos)
  main.appendChild(container)
}
 */

import './Home.css'
import { getEventos } from '../../utils/eventos/eventos'

let ventanaActiva = null // controla la ventana de confirmación abierta

export const printEventos = (eventos, contenedor) => {
  eventos.forEach((evento) => {
    const card = document.createElement('div')
    card.className = 'evento-card'
    card.textContent = evento.nombre

    const btnConfirmar = document.createElement('button')
    btnConfirmar.textContent = 'Confirmar asistencia'

    btnConfirmar.addEventListener('click', () => {
      if (ventanaActiva) {
        ventanaActiva.remove()
      }

      const ventana = document.createElement('div')
      ventana.className = 'ventana-confirmacion'
      ventana.textContent = `Confirmar asistencia a ${evento.nombre}?`

      const btnSi = document.createElement('button')
      btnSi.textContent = 'Sí'

      const btnNo = document.createElement('button')
      btnNo.textContent = 'No'
      btnNo.addEventListener('click', () => ventana.remove())

      ventana.append(btnSi, btnNo)
      document.body.appendChild(ventana)
      ventanaActiva = ventana
    })

    card.appendChild(btnConfirmar)
    contenedor.appendChild(card)
  })
}

export const Home = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const container = document.createElement('div')
  container.className = 'Home-container'

  const header = document.createElement('div')
  header.className = 'home-header'

  const titulo = document.createElement('h1')
  titulo.textContent = 'Eventos del Club Deportivo Getafe'
  titulo.className = 'home-title'

  const descripcion = document.createElement('p')
  descripcion.textContent =
    'Consulta aquí los próximos eventos del club y confirma tu asistencia.'
  descripcion.className = 'home-description'

  header.append(titulo, descripcion)

  const listaEventos = document.createElement('div')
  listaEventos.className = 'lista-eventos'

  const eventos = await getEventos()
  printEventos(eventos, listaEventos)

  container.append(header, listaEventos)
  main.appendChild(container)
}
