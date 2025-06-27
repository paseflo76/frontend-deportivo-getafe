// src/main.js
import './style.css'
import { loader } from './utils/loader/loader'
import { Header } from './components/Header/Header'
import { Admin } from './pages/admin/admin'
import { Home } from './pages/Home/Home'
import { LoginRegister } from './pages/LoginRegister/LoginRegister'
import { Footer } from './components/footer/footer'
import { Perfil } from './pages/perfil/perfil'

const routes = {
  home: Home,
  login: LoginRegister,
  admin: Admin,
  perfil: Perfil
}

export const navigate = async (path) => {
  document.querySelectorAll('.modal-edicion')?.forEach((el) => el.remove())

  const main = document.querySelector('main')
  if (main) main.innerHTML = '' // Limpiar main antes de renderizar la nueva vista

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  if ((!token || !userId) && path !== 'login') {
    path = 'login'
    location.hash = '#login'
  }

  const view = routes[path]
  if (view) {
    loader(true)
    await view()
    location.hash = `#${path}`
    Header()
    Footer()
    loader(false)
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
  Main()
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  if (!token || !userId) {
    await navigate('login')
  } else {
    await navigate('home')
  }
})

window.addEventListener('hashchange', async () => {
  const path = location.hash.replace('#', '')
  await navigate(path)
})
