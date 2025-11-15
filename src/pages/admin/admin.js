import './admin.css'
import { apiCatch } from '../../utils/fetch/fech'
import { Button } from '../../components/button/button'
import { loader } from '../../utils/loader/loader'

export const Admin = async () => {
  const main = document.querySelector('main')
  if (!main) return
  main.innerHTML = ''

  const container = document.createElement('div')
  container.id = 'admin-panel'

  const form = await crearFormularioEvento()
  const lista = document.createElement('div')
  lista.id = 'lista-eventos'

  container.append(form, lista)
  main.append(container)

  loader(true)
  await renderEventos(lista)
  loader(false)
}

const obtenerTipos = async () => {
  const token = localStorage.getItem('token')
  try {
    return await apiCatch('/eventos/tipos', 'GET', null, token)
  } catch {
    return ['Entrenamiento', 'Partido', 'Otro']
  }
}

const crearFormularioEvento = async () => {
  const form = document.createElement('form')
  const inputTitulo = document.createElement('input')
  const inputFecha = document.createElement('input')
  const inputLugar = document.createElement('input')
  const selectTipo = document.createElement('select')
  const inputImg = document.createElement('input')

  inputTitulo.placeholder = 'Título'
  inputFecha.placeholder = 'Fecha'
  inputLugar.placeholder = 'Lugar'
  inputImg.type = 'file'
  inputImg.accept = 'image/*'

  const tipos = await obtenerTipos()
  tipos.forEach((tipo) => {
    const option = document.createElement('option')
    option.value = tipo
    option.textContent = tipo
    selectTipo.appendChild(option)
  })

  const btn = Button(form, 'Crear Evento', 'secundary', 's', 'submit')
  form.append(inputTitulo, inputFecha, inputLugar, selectTipo, inputImg, btn)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('titulo', inputTitulo.value)
    formData.append('fecha', inputFecha.value)
    formData.append('lugar', inputLugar.value)
    formData.append('tipo', selectTipo.value)
    if (inputImg.files[0]) formData.append('img', inputImg.files[0])

    loader(true)
    const token = localStorage.getItem('token')
    try {
      await apiCatch('/eventos', 'POST', formData, token)
      await Admin()
    } catch (err) {
      console.error(err)
    } finally {
      loader(false)
    }
  })

  return form
}

const renderEventos = async (container) => {
  container.innerHTML = ''
  const token = localStorage.getItem('token')
  const eventos = await apiCatch('/eventos', 'GET', null, token)

  eventos.forEach((evento) => {
    const divadminEvent = document.createElement('div')
    divadminEvent.className = 'admin-evento'

    divadminEvent.innerHTML = `
      <h3>${evento.titulo}</h3>
      <img src="${evento.img || ''}" alt="${evento.titulo}" />
      <p>Fecha: ${evento.fecha}</p>
      <p>Lugar: ${evento.lugar}</p>
      <p>Tipo: ${evento.tipo}</p>
    `

    const editBtn = Button(divadminEvent, 'Editar', 'secundary', 's')
    editBtn.addEventListener('click', () => {
      if (document.querySelector('.modal-edicion')) return
      editarEvento(evento)
    })

    const deleteBtn = Button(divadminEvent, 'Borrar', 'secundary', 's')
    deleteBtn.addEventListener('click', async () => {
      loader(true)
      await apiCatch(`/eventos/${evento._id}`, 'DELETE', null, token)
      await renderEventos(container)
      loader(false)
    })

    divadminEvent.append(editBtn, deleteBtn)
    container.append(divadminEvent)
  })
}

// Mantener la función editarEvento igual, solo cambiar las rutas para eliminar /api/v2 duplicado.
