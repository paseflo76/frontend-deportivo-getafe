import './Admin.css'
import { navigate } from '../../main'
import { apiCatch } from '../../utils/fetch/fech'
import { Button } from '../../components/button/button'
import { loader } from '../../utils/loader/loader'

const API_BASE = 'https://backend-deportivo-getafe.onrender.com'

export const Admin = async () => {
  const main = document.querySelector('main')
  const body = document.querySelector('body')
  if (!body) return console.error('body no encontrado')

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
    return await apiCatch(
      `${API_BASE}/api/v2/eventos/tipos`,
      'GET',
      null,
      token
    )
  } catch (err) {
    console.error(err)
    return []
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

  const btn = Button(form, 'Crear Evento', 'secundary', 's')
  form.append(inputTitulo, inputFecha, inputLugar, selectTipo, inputImg, btn)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('titulo', inputTitulo.value)
    formData.append('fecha', inputFecha.value)
    formData.append('lugar', inputLugar.value)
    formData.append('tipo', selectTipo.value)
    formData.append('img', inputImg.files[0])

    loader(true)
    try {
      const token = localStorage.getItem('token')
      await apiCatch(`${API_BASE}/api/v2/eventos`, 'POST', formData, token)
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

  try {
    const eventos = await apiCatch(
      `${API_BASE}/api/v2/eventos`,
      'GET',
      null,
      token
    )

    for (const evento of eventos) {
      const divAdminEvent = document.createElement('div')
      divAdminEvent.className = 'admin-evento'

      const h3 = document.createElement('h3')
      const imgEvent = document.createElement('img')
      const pFecha = document.createElement('p')
      const pLugar = document.createElement('p')
      const pTipo = document.createElement('p')

      h3.textContent = evento.titulo
      imgEvent.src = evento.img
      pFecha.textContent = evento.fecha
      pLugar.textContent = evento.lugar
      pTipo.textContent = evento.tipo

      const editBtn = Button(divAdminEvent, 'Editar', 'secundary', 's')
      editBtn.addEventListener('click', () => {
        // Evitar múltiples modales de edición simultáneos
        if (document.querySelector('.modal-edicion')) return
        editarEvento(evento)
      })

      const deleteBtn = Button(divAdminEvent, 'Borrar', 'secundary', 's')
      deleteBtn.addEventListener('click', async () => {
        loader(true)
        await apiCatch(
          `${API_BASE}/api/v2/eventos/${evento._id}`,
          'DELETE',
          null,
          token
        )
        await renderEventos(container)
        loader(false)
      })

      divAdminEvent.append(
        h3,
        pFecha,
        imgEvent,
        pLugar,
        pTipo,
        editBtn,
        deleteBtn
      )
      container.append(divAdminEvent)
    }
  } catch (err) {
    console.error(err)
  }
}

const editarEvento = async (evento) => {
  const container = document.createElement('div')
  const form = document.createElement('form')
  const inputTitulo = document.createElement('input')
  const inputFecha = document.createElement('input')
  const inputLugar = document.createElement('input')
  const inputImg = document.createElement('input')
  const vistaImg = document.createElement('img')
  const selectTipo = document.createElement('select')
  container.className = 'modal-edicion'

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

  const listaEventos = document.getElementById('lista-eventos')
  listaEventos.appendChild(container)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (inputImg.files.length > 0) {
      const file = inputImg.files[0]
      const formData = new FormData()
      formData.append('img', file)
      formData.append('titulo', inputTitulo.value)
      formData.append('fecha', inputFecha.value)
      formData.append('lugar', inputLugar.value)
      formData.append('tipo', selectTipo.value)

      try {
        await fetch(`${API_BASE}/api/v2/eventos/${evento._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
        container.remove()
        await Admin()
      } catch (error) {
        console.error(error)
      }
    } else {
      const actualizado = {
        titulo: inputTitulo.value,
        fecha: inputFecha.value,
        lugar: inputLugar.value,
        img: evento.img,
        tipo: selectTipo.value
      }

      try {
        await fetch(`http://localhost:3000/api/v2/eventos/${evento._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(actualizado)
        })
        container.remove()
        navigate('Admin')
      } catch (error) {
        console.error(error)
      }
    }
  })
}
