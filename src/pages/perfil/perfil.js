import './perfil.css'
import { apiCatch } from '../../utils/fetch/fech'
import { navigate } from '../../main'
import { Button } from '../../components/button/button'

export const Perfil = () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const container = document.createElement('section')
  container.className = 'perfil-container'

  const title = document.createElement('h2')
  title.textContent = 'Perfil de usuario'
  title.className = 'perfil-title'

  const btnEliminar = Button(null, 'Eliminar cuenta', 'secondary', 's')
  btnEliminar.classList.add('perfil-btn')
  btnEliminar.addEventListener('click', async () => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    await apiCatch(`/api/v2/users/${userId}`, 'DELETE', null, token)
    localStorage.removeItem('token')
    navigate('home')
  })

  container.append(title, btnEliminar)
  main.appendChild(container)
}
