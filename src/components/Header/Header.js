import { navigate } from '../../main'
import { Admin } from '../../pages/admin/admin'
import { Clasificacion } from '../../pages/clasificacion/Clasificacion'
import { Home } from '../../pages/Home/Home'
import { Jornadas } from '../../pages/Jornadas/Jornadas'
import { LoginRegister } from '../../pages/LoginRegister/LoginRegister'
import { Perfil } from '../../pages/perfil/perfil'

import './Header.css'

const parseJwt = (token) => {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export const Header = () => {
  const header = document.querySelector('header')
  if (!header) return

  header.innerHTML = ''

  const divContainer = document.createElement('div')
  divContainer.className = 'divContainer'

  const divNav = document.createElement('div')
  divNav.className = 'nav-Header'

  const nav = document.createElement('nav')
  nav.className = 'nav hidden'

  const divDepor = document.createElement('div')
  divDepor.className = 'iconDepor'
  const img = document.createElement('img')
  img.src = 'assets/deportivo.png'
  img.alt = 'Logo'
  divDepor.appendChild(img)

  const divMenu = document.createElement('div')
  divMenu.className = 'menu-icon'
  const imgMenu = document.createElement('img')
  imgMenu.src = 'assets/menu.png'
  imgMenu.alt = 'Menu'
  divMenu.appendChild(imgMenu)

  const divDecoracion = document.createElement('div')
  divDecoracion.className = 'decoration'

  const imgPortero = document.createElement('img')
  const imgJugador1 = document.createElement('img')
  const imgJugador2 = document.createElement('img')
  imgPortero.src = 'assets/portero.png'
  imgPortero.alt = 'portero'
  imgJugador1.src = 'assets/jugador-de-futbol1.png'
  imgJugador1.alt = 'jugador futbol'
  imgJugador2.src = 'assets/jugador-de-futbol2.png'
  imgJugador2.alt = 'jugador futbol2'

  divDecoracion.appendChild(imgJugador1)
  divDecoracion.appendChild(imgJugador2)
  divDecoracion.appendChild(imgPortero)

  const token = localStorage.getItem('token')
  const user = parseJwt(token)

  const routes = [
    { texto: 'Home', path: 'home', function: Home },
    { texto: 'Clasificación', path: 'clasificacion', function: Clasificacion },
    { texto: 'Calendario', path: 'jornadas', function: Jornadas },
    { texto: 'Editar', path: 'admin', function: Admin },
    { texto: 'Login', path: 'login', function: LoginRegister },
    { texto: 'Perfil', path: 'perfil', function: Perfil }
  ]

  if (user?.rol !== 'admin') {
    const index = routes.findIndex((r) => r.texto === 'Editar')
    if (index !== -1) routes.splice(index, 1)
  }

  for (const route of routes) {
    const a = document.createElement('a')

    if (route.texto === 'Login' && token) {
      a.textContent = 'Logout'
      a.href = '#home'
      a.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        Header()
        navigate('home')
      })
    } else {
      a.textContent = route.texto
      a.href = `#${route.path}`
      a.addEventListener('click', (e) => {
        e.preventDefault()
        navigate(route.path)
      })
    }

    nav.append(a)
  }

  divMenu.addEventListener('click', () => {
    nav.classList.toggle('show')
  })

  divNav.appendChild(divMenu)
  divNav.appendChild(nav)
  divContainer.appendChild(divDepor)
  divContainer.appendChild(divDecoracion)
  divContainer.appendChild(divNav)
  header.appendChild(divContainer)
}
