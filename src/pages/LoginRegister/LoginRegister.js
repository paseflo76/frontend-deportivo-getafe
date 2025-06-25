import './LoginRegister.css'
import { navigate } from '../../main'
import { Header } from '../../components/Header/Header'
import { loader } from '../../utils/loader/loader'
import { API_BASE, apiCatch } from '../../utils/fetch/fech'
import { Button } from '../../components/button/button'

export const LoginRegister = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const token = localStorage.getItem('token')
  if (token) {
    try {
      const res = await fetch(`${API_BASE}/api/v2/users/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        await navigate('home')
        Header()
        return
      } else {
        localStorage.removeItem('token')
      }
    } catch {
      localStorage.removeItem('token')
    }
  }

  const container = document.createElement('div')
  container.id = 'login'

  const form = document.createElement('form')
  const inputUserName = document.createElement('input')
  const inputPassword = document.createElement('input')

  inputUserName.placeholder = 'User Name'
  inputPassword.type = 'password'
  inputPassword.placeholder = '******'

  form.append(inputUserName, inputPassword)

  const buttonsDiv = document.createElement('div')
  buttonsDiv.className = 'buttons'

  const loginButton = Button(form, 'Login', 'primary', 'medium')
  loginButton.type = 'button'

  const registerText = document.createElement('p')
  registerText.textContent = '¿No estás registrado? Regístrate aquí'
  registerText.className = 'register-link'

  registerText.style.cursor = 'pointer'
  registerText.style.textDecoration = 'underline'

  buttonsDiv.append(loginButton)
  container.append(form, buttonsDiv, registerText)
  main.append(container)

  loginButton.addEventListener('click', () => {
    submitLogin(inputUserName.value.trim(), inputPassword.value, form)
  })

  registerText.addEventListener('click', () => {
    renderRegisterForm(main)
  })
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

const submitLogin = async (userName, password, form) => {
  if (!userName || !password) {
    showError(form, 'Por favor completa todos los campos.')
    return
  }

  loader(true)
  try {
    const data = await apiCatch('/api/v2/users/login', 'POST', {
      userName,
      password
    })
    localStorage.setItem('token', data.token)
    await navigate('home')
    Header()
  } catch (err) {
    if (err.status === 400) {
      showError(form, 'Usuario o Contraseña Incorrectos')
    } else {
      showError(form, 'Error de red o servidor.')
    }
  } finally {
    loader(false)
  }
}

const renderRegisterForm = (main) => {
  main.innerHTML = ''
  const container = document.createElement('div')
  container.id = 'login'

  const form = document.createElement('form')
  const inputUserName = document.createElement('input')
  const inputEmail = document.createElement('input')
  const inputPassword = document.createElement('input')

  inputUserName.placeholder = 'User Name'
  inputEmail.placeholder = 'Email'
  inputPassword.type = 'password'
  inputPassword.placeholder = '******'

  form.append(inputUserName, inputEmail, inputPassword)

  const buttonsDiv = document.createElement('div')
  buttonsDiv.className = 'buttons'

  const registerButton = Button(null, 'Register', 'secondary', 'medium')
  registerButton.type = 'button'

  buttonsDiv.append(registerButton)
  container.append(form, buttonsDiv)
  main.append(container)

  registerButton.addEventListener('click', () => {
    submitRegister(
      inputUserName.value.trim(),
      inputEmail.value.trim(),
      inputPassword.value,
      form
    )
  })
}

const submitRegister = async (userName, email, password, form) => {
  if (!userName || !email || !password) {
    showError(form, 'Por favor completa todos los campos.')
    return
  }

  loader(true)
  try {
    const data = await apiCatch('/api/v2/users/register', 'POST', {
      userName,
      email,
      password
    })
    localStorage.setItem('token', data.token)
    await navigate('home')
    Header()
  } catch (err) {
    if (err.status === 400) {
      const msg = err.body?.message || 'Error'
      if (msg === 'User already exists') {
        showError(form, 'El usuario ya existe')
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
