import { API_BASE, apiCatch } from '../../utils/fetch/fech'
import { loader } from '../../utils/loader/loader'
import { Button } from '../button/button'

import './cardEvent.css'

//! funcion mostrar cardEvento

export const cardEvent = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  loader(true)

  const eventos = await apiCatch(`${API_BASE}/api/v2/eventos`)

  loader(false)

  printEventos(eventos, main)
}

export const printEventos = (eventos, ePadre) => {
  ePadre.innerHTML = ''

  for (const evento of eventos) {
    const divEventos = document.createElement('div')
    divEventos.id = 'Eventos'

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
      const modalExistente = divEvento.querySelector('.asist-list')
      if (modalExistente) return

      const modal = document.createElement('div')
      modal.className = 'asist-list'

      const opciones = document.createElement('div')
      opciones.className = 'asist-options'

      const lista = document.createElement('div')
      lista.className = 'asistentes'

      const btnCerrar = Button(opciones, 'cerrar', 'secundary', 's')
      btnCerrar.addEventListener('click', () => modal.remove())

      modal.append(opciones, lista, btnCerrar)
      divEvento.appendChild(modal)

      menuAsist(evento._id, modal)
    })

    divEvento.append(tipo, imgEvent, titulo, fecha, lugar, btnAsist)
    divEventos.appendChild(divEvento)
    ePadre.appendChild(divEventos)
  }
}

const menuAsist = (eventoId, divEvento) => {
  const existente = divEvento.querySelector('.asist-list')
  if (existente) existente.remove()

  const modal = document.createElement('div')
  modal.className = 'asist-list'

  const opciones = document.createElement('div')
  opciones.className = 'asist-options'

  const lista = document.createElement('div')
  lista.className = 'asistentes'

  modal.append(opciones, lista)
  divEvento.appendChild(modal)

  const estados = ['Va a entrenar 👍', 'En duda ❓', 'No puede ❌']
  estados.forEach((estado) => {
    const btn = Button(opciones, estado, 'secundary', 's')
    btn.addEventListener('click', async () => {
      await envAsistencia(eventoId, estado)
      await mostrarAsistentes(eventoId, modal)
    })
    opciones.appendChild(btn)
  })

  mostrarAsistentes(eventoId, modal)
}

const envAsistencia = async (eventoId, estado) => {
  const token = localStorage.getItem('token')
  await apiCatch(
    `${API_BASE}/api/v2/eventos/${eventoId}/asistencia`,
    'PATCH',
    { estado },
    token
  )
}

const mostrarAsistentes = async (eventoId, asistContainer) => {
  const eventos = await apiCatch(`${API_BASE}/api/v2/eventos`)
  const evento = eventos.find((e) => e._id === eventoId)

  const contenedor = asistContainer.querySelector('.asistentes')
  contenedor.innerHTML = ''

  const categorias = {
    'Va a entrenar 👍': [],
    'En duda ❓': [],
    'No puede ❌': []
  }

  evento.asistentes.forEach((a) => {
    const nombre = a.user?.userName || 'Usuario'
    if (categorias[a.estado]) {
      categorias[a.estado].push(nombre)
    }
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
