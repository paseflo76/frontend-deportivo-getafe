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
    await apiCatch('/api/v2/users/me', 'DELETE', null, token)
    localStorage.removeItem('token')
    navigate('home')
  })

  container.append(title, btnEliminar)
  main.appendChild(container)
}
