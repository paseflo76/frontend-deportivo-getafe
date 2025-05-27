import './loginRegister.css'
import { navigate } from '../../main'
import { Header } from '../../components/Header/Header'
import { apiCatch } from '../../utils/fetch/fech'
import { loader } from '../../utils/loader/loader'

//!

export const LoginRegister = () => {
  const main = document.querySelector('main')

  main.innerHTML = ''

  const loginDiv = document.createElement('div')
  loginDiv.id = 'login'

  Login(loginDiv)

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

const Login = (e) => {
  const form = document.createElement('form')
  const toggleText = document.createElement('p')
  const inputUserName = document.createElement('input')
  const inputEmail = document.createElement('input')
  const inputPassword = document.createElement('input')
  const button = document.createElement('button')

  inputPassword.type = 'password'
  inputUserName.placeholder = 'User Name'
  inputEmail.placeholder = 'Email'
  inputPassword.placeholder = '******'
  button.textContent = 'Login'

  let isLogin = true

  toggleText.textContent = '¿No tienes cuenta? Regístrate aquí.'
  toggleText.addEventListener('click', () => {
    isLogin = !isLogin
    button.textContent = isLogin ? 'Login' : 'Register'
    toggleText.textContent = isLogin
      ? '¿No tienes cuenta? Regístrate aquí.'
      : '¿Ya tienes cuenta? Inicia sesión aquí.'
  })

  e.append(form)
  form.append(toggleText, inputUserName, inputEmail, inputPassword, button)

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submit(
      inputUserName.value,
      inputEmail.value,
      inputPassword.value,
      form,
      isLogin
    )
  })
}

const submit = async (userName, email, password, form, isLogin) => {
  if (!userName || !email || !password) {
    showError(form, 'Por favor completa todos los campos.')
    return
  }

  const loadOut = { userName, email, password }
  const url = isLogin
    ? 'http://localhost:3000/api/v2/users/Login'
    : 'http://localhost:3000/api/v2/users/Register'

  loader(true)
  try {
    const data = await apiCatch(url, 'POST', loadOut)
    localStorage.setItem('token', data.token)
    await navigate('home')
    Header()
  } catch (err) {
    if (err.status === 400) {
      const msg = err.body?.message || 'Error'
      if (isLogin) {
        showError(form, 'Usuario o Contraseña Incorrectos')
      } else if (msg === 'User already exists') {
        return submit(userName, email, password, form, true)
      } else {
        showError(form, msg)
      }
    } else {
      showError(form, 'Error de red o servidor.')
    }
  } finally {
    loader(false)
  }
}
