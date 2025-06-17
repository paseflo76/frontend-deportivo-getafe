import './LoginRegister.css'
import { navigate } from '../../main'
import { Header } from '../../components/Header/Header'
import { loader } from '../../utils/loader/loader'
import { API_BASE, apiCatch } from '../../utils/fetch/fech'

//!

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

const login = (e) => {
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
  button.textContent = 'login'

  let islogin = true

  toggleText.textContent = '¿No tienes cuenta? Regístrate aquí.'
  toggleText.addEventListener('click', () => {
    islogin = !islogin
    button.textContent = islogin ? 'login' : 'register'
    toggleText.textContent = islogin
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
      islogin
    )
  })
}

const submit = async (userName, email, password, form, islogin) => {
  if (!email || !password || (!islogin && !userName)) {
    showError(form, 'Por favor completa todos los campos.')
    return
  }

  const loadOut = islogin ? { email, password } : { userName, email, password }

  const url = islogin
    ? `${API_BASE}/api/v2/users/login`
    : `${API_BASE}/api/v2/users/register`

  loader(true)
  try {
    const data = await apiCatch(url, 'POST', loadOut)
    localStorage.setItem('token', data.token)
    await navigate('home')
    Header()
  } catch (err) {
    if (err.status === 400) {
      const msg = err.body?.message || 'Error'
      if (islogin) {
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
