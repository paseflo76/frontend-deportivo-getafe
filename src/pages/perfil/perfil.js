import { apiCatch } from '../../utils/fetch/fech'
import { navigate } from '../../main'
import './perfil.css'

export const Perfil = () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const container = document.createElement('div')
  const title = document.createElement('h2')
  title.textContent = 'Perfil de usuario'

  const btnEliminar = document.createElement('button')
  btnEliminar.textContent = 'Eliminar cuenta'
  btnEliminar.addEventListener('click', async () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    await apiCatch(`/api/v2/users/${user._id}`, 'DELETE', null, token)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('home')
  })

  container.append(title, btnEliminar)
  main.appendChild(container)
}
