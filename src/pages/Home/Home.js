import './Home.css'

import { printEventos } from '../../components/cardEvent/cardEvent'
import { getEventos } from '../../utils/eventos/eventos'

export const Home = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const container = document.createElement('div')
  container.className = 'home-container'

  const titulo = document.createElement('h1')
  titulo.textContent = 'Eventos del Club Deportivo Getafe'
  titulo.className = 'home-title'

  const descripcion = document.createElement('p')
  descripcion.textContent =
    'Consulta aquí los próximos eventos del club y confirma tu asistencia.'
  descripcion.className = 'home-description'

  const listaEventos = document.createElement('div')
  listaEventos.className = 'lista-eventos'

  const eventos = await getEventos()
  printEventos(eventos, listaEventos)

  container.append(titulo, descripcion, listaEventos)
  main.appendChild(container)
}
