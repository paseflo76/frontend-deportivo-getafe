import './cardEvent.css'
import { loader } from '../../utils/loader/loader'
import { Button } from '../button/button'
import { apiCatch } from '../../utils/fetch/fech'

export const cardEvent = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''
  loader(true)

  const eventos = await apiCatch('/api/v2/eventos')

  loader(false)
  printEventos(eventos, main)
}

export const printEventos = (eventos, contenedor) => {
  const fragment = document.createDocumentFragment()

  const removeExistingModals = () => {
    const modals = document.querySelectorAll('.modal-confirmacion')
    modals.forEach((modal) => modal.remove())
  }

  for (const evento of eventos) {
    const divEvento = document.createElement('div')
    divEvento.className = 'evento'

    const tipo = document.createElement('p')
    const imgEvent = document.createElement('img')
    const titulo = document.createElement('h2')
    const fecha = document.createElement('p')
    const lugar = document.createElement('p')
    const btnAsist = Button(divEvento, 'Confirmar asistencia', 'secundary', 's')

    tipo.textContent = evento.tipo
    imgEvent.src = evento.img
    titulo.textContent = evento.titulo
    fecha.textContent = evento.fecha
    lugar.textContent = evento.lugar

    btnAsist.addEventListener('click', () => {
      removeExistingModals()
      menuAsist(evento._id, divEvento, evento.tipo)
    })

    divEvento.append(tipo, imgEvent, titulo, fecha, lugar, btnAsist)
    fragment.appendChild(divEvento)
  }

  contenedor.appendChild(fragment)
}

const menuAsist = (eventoId, divEvento, tipo) => {
  const existente = divEvento.querySelector('.asist-list')
  if (existente) existente.remove()

  const modal = document.createElement('div')
  modal.className = 'asist-list modal-confirmacion'

  const opciones = document.createElement('div')
  opciones.className = 'asist-options'

  const lista = document.createElement('div')
  lista.className = 'asistentes'

  modal.append(opciones, lista)
  divEvento.appendChild(modal)

  apiCatch('/api/v2/eventos').then((eventos) => {
    const evento = eventos.find((e) => e._id === eventoId)

    const estados = (() => {
      switch (tipo.toLowerCase()) {
        case 'partido':
          return ['Va al partido 👍', 'En duda ❓', 'No puede ❌']
        case 'entrenamiento':
          return ['Va a entrenar 👍', 'En duda ❓', 'No puede ❌']
        case 'cena de equipo':
          return ['Va a la cena 🍽️', 'En duda ❓', 'No puede ❌']
        default:
          return ['En duda ❓', 'No puede ❌']
      }
    })()

    estados.forEach((estado) => {
      const btn = Button(opciones, estado, 'secundary', 's')
      btn.addEventListener('click', async () => {
        await envAsistencia(eventoId, estado)
        await mostrarAsistentes(eventoId, modal)
      })
      opciones.appendChild(btn)
    })

    const btnCerrar = Button(opciones, 'cerrar', 'secundary', 's')
    btnCerrar.addEventListener('click', () => modal.remove())
    opciones.appendChild(btnCerrar)

    mostrarAsistentes(eventoId, modal)
  })
}

const envAsistencia = async (eventoId, estado) => {
  const token = localStorage.getItem('token')
  await apiCatch(
    `/api/v2/eventos/${eventoId}/asistencia`,
    'PATCH',
    { estado },
    token
  )
}

const mostrarAsistentes = async (eventoId, asistContainer) => {
  const eventos = await apiCatch('/api/v2/eventos')
  const evento = eventos.find((e) => e._id === eventoId)
  const contenedor = asistContainer.querySelector('.asistentes')
  contenedor.innerHTML = ''

  const estados = (() => {
    switch (evento.tipo.toLowerCase()) {
      case 'partido':
        return ['Va al partido 👍', 'En duda ❓', 'No puede ❌']
      case 'entrenamiento':
        return ['Va a entrenar 👍', 'En duda ❓', 'No puede ❌']
      case 'cena de equipo':
        return ['Va a la cena 🍽️', 'En duda ❓', 'No puede ❌']
      default:
        return ['En duda ❓', 'No puede ❌']
    }
  })()

  const categorias = {}
  estados.forEach((e) => (categorias[e] = []))

  evento.asistentes.forEach((a) => {
    const nombre = a.user?.userName || 'Usuario'
    const estado = a.estado
    if (categorias[estado]) categorias[estado].push(nombre)
  })

  for (const estado in categorias) {
    const seccion = document.createElement('div')
    seccion.className = 'options'
    const titulo = document.createElement('h4')
    titulo.textContent = estado
    seccion.appendChild(titulo)

    const lista = document.createElement('ul')
    lista.className = 'ulAsist'
    categorias[estado].forEach((nombre) => {
      const li = document.createElement('li')
      li.textContent = nombre
      lista.appendChild(li)
    })

    seccion.appendChild(lista)
    contenedor.appendChild(seccion)
  }
}
