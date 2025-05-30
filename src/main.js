import './style.css'
import { loader } from './utils/loader/loader'
import { Header } from './components/Header/Header'
import { Admin } from './pages/admin/admin'
import { Home } from './pages/Home/Home'
import { LoginRegister } from './pages/LoginRegister/LoginRegister'
import { Footer } from './components/footer/footer'

const routes = {
  home: Home,
  login: LoginRegister,
  admin: Admin
}

export const navigate = async (path) => {
  document.querySelectorAll('.modal-edicion')?.forEach((el) => el.remove())
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
  const path = location.hash.replace('#', '') || 'home'
  await navigate(path)
})

window.addEventListener('hashchange', async () => {
  const path = location.hash.replace('#', '')
  await navigate(path)
})
