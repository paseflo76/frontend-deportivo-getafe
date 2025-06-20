import './LoginRegister.css'
import { navigate } from '../../main'
import { Header } from '../../components/Header/Header'
import { loader } from '../../utils/loader/loader'
import { API_BASE, apiCatch } from '../../utils/fetch/fech'

export const LoginRegister = () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const loginDiv = document.createElement('div')
  loginDiv.id = 'login'

  login(loginDiv)

  main.append(loginDiv)
}

const showError = (form, message) => {
  let pError = form.querySelector('.pError')
  if (!pError) {
    pError = document.createElement('p')
    pError.classList.add('pError')
    form.append(pError)
  }
  pError.textContent = message
  setTimeout(() => pError.remove(), 3000)
}

const login = (container) => {
  const form = document.createElement('form')
  const inputUserName = document.createElement('input')
  const inputEmail = document.createElement('input')
  const inputPassword = document.createElement('input')
  const button = document.createElement('button')

  inputUserName.placeholder = 'User Name'
  inputEmail.placeholder = 'Email'
  inputPassword.type = 'password'
  inputPassword.placeholder = '******'
  button.textContent = 'Login'

  container.append(form)
  form.append(inputUserName, inputEmail, inputPassword, button)

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submit(
      inputUserName.value.trim(),
      inputEmail.value.trim(),
      inputPassword.value,
      form
    )
  })
}

const submit = async (userName, email, password, form) => {
  if (!userName || !email || !password) {
    showError(form, 'Por favor completa todos los campos.')
    return
  }

  const payload = { userName, email, password }
  const url = '/api/v2/users/login'

  loader(true)
  try {
    const data = await apiCatch(url, 'POST', payload)
    localStorage.setItem('token', data.token)
    await navigate('home')
    Header()
  } catch (err) {
    const msg = err.body?.message || 'Error'
    showError(form, msg)
  } finally {
    loader(false)
  }
}
