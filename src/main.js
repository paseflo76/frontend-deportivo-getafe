import './style.css'
import { loader } from './utils/loader/loader'
import { Header } from './components/Header/Header'
import { Admin } from './pages/admin/admin'
import { Home } from './pages/Home/Home'
import { LoginRegister } from './pages/LoginRegister/LoginRegister'
import { Footer } from './components/footer/footer'
import { Perfil } from './pages/perfil/perfil'
import { Calendario } from './pages/Jornadas/Jornadas'
import { Clasificacion } from './pages/clasificacion/Clasificacion'
import { Stats } from './pages/stats'

const routes = {
  home: Home,
  login: LoginRegister,
  admin: Admin,
  perfil: Perfil,
  clasificacion: Clasificacion,
  jornadas: Calendario,
  stats: Stats
}

export const navigate = async (path) => {
  document.querySelectorAll('.modal-edicion')?.forEach((el) => el.remove())

  const main = document.querySelector('main')
  if (main) main.innerHTML = ''

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  if ((!token || !userId) && path !== 'login') {
    try {
      sessionStorage.setItem(
        'flash',
        JSON.stringify({
          type: 'info',
          text: 'Necesitas iniciar sesión para continuar.'
        })
      )
    } catch {}
    path = 'login'
    location.hash = '#login'
  }

  const view = routes[path]
  if (view) {
    loader(true)
    try {
      await view()
      location.hash = `#${path}`
      Header()
      Footer()
    } catch (e) {
      console.error(e)
    } finally {
      loader(false)
    }
  }
}

const Main = () => {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <header></header>
    <main></main>
    <footer></footer>
  `
  Header()
  Footer()
}

window.addEventListener('load', async () => {
  // inicializar estructura de resultados antes de renderizar nada

  Main()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  if (!token || !userId) {
    try {
      sessionStorage.setItem(
        'flash',
        JSON.stringify({
          type: 'info',
          text: 'Necesitas iniciar sesión para continuar.'
        })
      )
    } catch {}
    await navigate('login')
  } else {
    await navigate('home')
  }
})

window.addEventListener('hashchange', async () => {
  const path = location.hash.replace('#', '')
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const publicRoutes = ['login']
  if ((!token || !userId) && !publicRoutes.includes(path)) {
    try {
      sessionStorage.setItem(
        'flash',
        JSON.stringify({
          type: 'info',
          text: 'Necesitas iniciar sesión para continuar.'
        })
      )
    } catch {}
    await navigate('login')
    return
  }
  await navigate(path)
})
