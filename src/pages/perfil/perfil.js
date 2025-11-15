import './perfil.css'
import { navigate } from '../../main.js'
import { Button } from '../../components/button/button.js'
import { Avatar } from '../../components/avatar/avatar.js'
import { AvatarForm } from '../../components/avatarForm/avatarForm.js'
import { UserInfo } from '../../components/userInfo/userInfo.js'
import { apiCatch } from '../../utils/fetch/fech.js'

const DeleteButton = (userId, token) => {
  const btn = Button(null, 'Eliminar cuenta', 'secondary', 's')
  btn.classList.add('perfil-btn')
  btn.addEventListener('click', async () => {
    await apiCatch(`/users/${userId}`, 'DELETE', null, token)
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate('home')
  })
  return btn
}

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

  let isAdmin = false
  try {
    const validateRes = await apiCatch(
      '/api/v2/users/validate',
      'GET',
      null,
      token
    )
    isAdmin = validateRes.user.rol === 'admin'
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate('login')
    return
  }

  let user
  try {
    user = await apiCatch(`/api/v2/users/${userId}`, 'GET', null, token)
  } catch {
    container.textContent = 'Error al cargar perfil'
    main.appendChild(container)
    return
  }

  const title = document.createElement('h2')
  title.className = 'perfil-title'
  title.textContent = isAdmin ? 'Mi Perfil' : 'Perfil de usuario'

  const avatarImg = Avatar({ src: user.avatar })
  const formAvatar = await AvatarForm(userId, token, avatarImg)
  const info = UserInfo(user)
  const btnEliminar = DeleteButton(userId, token)

  container.append(title, avatarImg, formAvatar, info, btnEliminar)

  if (isAdmin) {
    let users
    try {
      users = await apiCatch('/api/v2/users', 'GET', null, token)
    } catch {
      container.textContent = 'Error al cargar usuarios'
      main.appendChild(container)
      return
    }

    const allUsersTitle = document.createElement('h2')
    allUsersTitle.textContent = 'Todos los usuarios'
    allUsersTitle.className = 'perfil-title'
    container.appendChild(allUsersTitle)

    users.forEach((u) => {
      if (u._id === userId) return

      const userBox = document.createElement('div')
      userBox.className = 'perfil-box'

      const avatar = Avatar({ src: u.avatar })
      const info = document.createElement('div')
      info.className = 'perfil-info'

      const name = document.createElement('p')
      name.textContent = `Usuario: ${u.userName}`
      const email = document.createElement('p')
      email.textContent = `Email: ${u.email}`
      const rol = document.createElement('p')
      rol.textContent = `Rol: ${u.rol}`

      info.append(name, email, rol)
      userBox.append(avatar, info)
      container.appendChild(userBox)
    })
  }

  main.appendChild(container)
}
