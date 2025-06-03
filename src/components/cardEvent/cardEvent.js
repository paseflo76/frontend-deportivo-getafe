import './cardEvent.css'
import { loader } from '../../utils/loader/loader'
import { Button } from '../button/button'
import { API_BASE, apiCatch } from '../../utils/fetch/fech'
import { Admin } from '../../pages/admin/admin'
import { navigate } from '../../utils/navigate/navigate'

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

    btnAsist.addEventListener('click', () =>
      mostrarMenuAsistencia(evento._id, divEvento)
    )

    divEvento.append(tipo, imgEvent, titulo, fecha, lugar, btnAsist)
    divEventos.appendChild(divEvento)
    ePadre.appendChild(divEventos)
  }
}

const mostrarMenuAsistencia = async (eventoId, divEvento) => {
  const existente = divEvento.querySelector('.asist-list')
  if (existente) return

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
      await mostrarAsistentes(eventoId, lista)
    })
    opciones.appendChild(btn)
  })

  const btnCerrar = Button(opciones, 'cerrar', 'secundary', 's')
  btnCerrar.addEventListener('click', () => modal.remove())
  opciones.appendChild(btnCerrar)

  await mostrarAsistentes(eventoId, lista)
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

const mostrarAsistentes = async (eventoId, contenedor) => {
  const eventos = await apiCatch(`${API_BASE}/api/v2/eventos`)
  const evento = eventos.find((e) => e._id === eventoId)

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

export const editarEvento = async (evento) => {
  const container = document.createElement('div')
  container.className = 'modal-edicion'

  const form = document.createElement('form')
  const inputTitulo = document.createElement('input')
  const inputFecha = document.createElement('input')
  const inputLugar = document.createElement('input')
  const inputImg = document.createElement('input')
  const vistaImg = document.createElement('img')
  const selectTipo = document.createElement('select')

  inputTitulo.value = evento.titulo
  inputTitulo.placeholder = 'Título'

  inputFecha.value = evento.fecha
  inputFecha.placeholder = 'Fecha'

  inputLugar.value = evento.lugar
  inputLugar.placeholder = 'Lugar'

  inputImg.type = 'file'
  vistaImg.src = evento.img

  const tipos = await obtenerTipos()
  tipos.forEach((tipo) => {
    const option = document.createElement('option')
    option.value = tipo
    option.textContent = tipo
    if (tipo === evento.tipo) option.selected = true
    selectTipo.appendChild(option)
  })

  const btnGuardar = document.createElement('button')
  btnGuardar.textContent = 'Guardar'
  btnGuardar.type = 'submit'

  const btnCancelar = document.createElement('button')
  btnCancelar.textContent = 'Cerrar'
  btnCancelar.type = 'button'
  btnCancelar.addEventListener('click', () => container.remove())

  form.append(
    inputTitulo,
    inputFecha,
    inputLugar,
    vistaImg,
    inputImg,
    selectTipo,
    btnGuardar,
    btnCancelar
  )
  container.appendChild(form)

  const listaEventos = document.getElementById('lista-eventos') || document.body
  listaEventos.appendChild(container)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      if (inputImg.files.length > 0) {
        const file = inputImg.files[0]
        const formData = new FormData()
        formData.append('img', file)
        formData.append('titulo', inputTitulo.value)
        formData.append('fecha', inputFecha.value)
        formData.append('lugar', inputLugar.value)
        formData.append('tipo', selectTipo.value)

        await fetch(`${API_BASE}/api/v2/eventos/${evento._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
      } else {
        const actualizado = {
          titulo: inputTitulo.value,
          fecha: inputFecha.value,
          lugar: inputLugar.value,
          img: evento.img,
          tipo: selectTipo.value
        }

        await fetch(`${API_BASE}/api/v2/eventos/${evento._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(actualizado)
        })
      }

      container.remove()
      await Admin()
    } catch (error) {
      console.error(error)
    }
  })
}

const obtenerTipos = async () => {
  try {
    const tipos = await apiCatch(`${API_BASE}/api/v2/eventos/tipos`)
    return tipos
  } catch {
    return ['Entrenamiento', 'Partido', 'Otro']
  }
}
