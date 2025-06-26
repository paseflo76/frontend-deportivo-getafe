import './Home.css'

import { CardEvento } from '../../components/CardEvento/CardEvento'
import { getEventos } from '../../utils/eventos/eventos'

export const Home = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const container = document.createElement('div')
  container.className = 'Home-container'

  const titulo = document.createElement('h1')
  titulo.textContent = 'Eventos del Club Deportivo Getafe'
  titulo.className = 'home-title'

  const descripcion = document.createElement('p')
  descripcion.textContent =
    'Consulta aquí los próximos eventos del club y confirma tu asistencia.'
  descripcion.className = 'home-description'

  const eventos = await getEventos()

  const listaEventos = document.createElement('div')
  listaEventos.className = 'lista-eventos'

  eventos.forEach((evento) => {
    const card = CardEvento(evento)
    listaEventos.appendChild(card)
  })

  container.append(titulo, descripcion, listaEventos)
  main.appendChild(container)
}
