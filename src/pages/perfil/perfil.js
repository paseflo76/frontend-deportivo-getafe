import { apiCatch } from '../../utils/fetch/fech'
import { navigate } from '../../main'

import './perfil.css'
import { Button } from '../../components/button/button'

export const Perfil = () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const container = document.createElement('div')
  const title = document.createElement('h2')
  title.textContent = 'Perfil de usuario'

  const btnEliminar = Button(container, 'Eliminar cuenta', 'secondary', 's')
  btnEliminar.addEventListener('click', async () => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId') // asegúrate de guardar esto al iniciar sesión
    await apiCatch(`/api/v2/users/${userId}`, 'DELETE', null, token)
    localStorage.removeItem('token')
    navigate('home')
  })

  container.appendChild(title)
  main.appendChild(container)
}
