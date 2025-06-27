// src/pages/perfil/perfil.js
// pages/perfil/perfil.js
import './perfil.css'
import { navigate } from '../../main'
import { Button } from '../../components/button/button'
import { apiCatch } from '../../utils/fetch/fech'

export const Perfil = async () => {
  let main = document.querySelector('main')
  if (!main) {
    main = document.createElement('main')
    document.body.appendChild(main)
  }
  main.innerHTML = ''

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  if (!token || !userId || userId === 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate('login')
    return
  }

  const container = document.createElement('section')
  container.className = 'perfil-container'

  const title = document.createElement('h2')
  title.textContent = 'Perfil de usuario'
  title.className = 'perfil-title'

  let user
  try {
    user = await apiCatch(`/api/v2/users/${userId}`, 'GET', null, token)
  } catch (err) {
    container.textContent = 'Error al cargar perfil'
    main.appendChild(container)
    return
  }

  const avatar = document.createElement('img')
  avatar.className = 'perfil-avatar'
  avatar.src = user.avatar ? user.avatar : '/default-avatar.png'
  avatar.alt = 'Avatar de usuario'

  const formAvatar = document.createElement('form')
  formAvatar.enctype = 'multipart/form-data'

  const inputFile = document.createElement('input')
  inputFile.type = 'file'
  inputFile.name = 'avatar'
  inputFile.id = 'avatar'
  inputFile.accept = 'image/*'

  const btnUpload = Button(null, 'Cambiar Avatar', 'secundary', 's')
  btnUpload.type = 'submit'

  formAvatar.append(inputFile, btnUpload)

  formAvatar.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (!inputFile.files[0]) return
    const formData = new FormData()
    formData.append('avatar', inputFile.files[0])

    const res = await apiCatch(
      `/api/v2/users/${userId}/avatar`,
      'POST',
      formData,
      token,
      true
    )
    if (res && res.avatar) {
      avatar.src = res.avatar
    }
  })

  const info = document.createElement('div')
  info.className = 'perfil-info'

  const userName = document.createElement('p')
  userName.textContent = `Usuario: ${user.userName}`

  const email = document.createElement('p')
  email.textContent = `Email: ${user.email}`

  const btnEliminar = Button(null, 'Eliminar cuenta', 'secondary', 's')
  btnEliminar.classList.add('perfil-btn')
  btnEliminar.addEventListener('click', async () => {
    await apiCatch(`/api/v2/users/${userId}`, 'DELETE', null, token)
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate('home')
  })

  info.append(userName, email)

  container.append(title, avatar, formAvatar, info, btnEliminar)
  main.appendChild(container)
}
