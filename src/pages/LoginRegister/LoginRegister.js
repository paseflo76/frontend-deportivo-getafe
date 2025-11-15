import './LoginRegister.css'
import { navigate } from '../../main'
import { Header } from '../../components/Header/Header'
import { loader } from '../../utils/loader/loader'
import { apiCatch } from '../../utils/fetch/fech'
import { Button } from '../../components/button/button'

const createInput = (type = 'text', placeholder = '') => {
  const input = document.createElement('input')
  input.type = type
  input.placeholder = placeholder
  return input
}

const createFormWithInputs = (placeholders) => {
  const form = document.createElement('form')
  const inputs = placeholders.map(([type, text]) => createInput(type, text))
  inputs.forEach((i) => form.append(i))
  return { form, inputs }
}

// --- NUEVO: banner flash para avisar que requiere login ---
const renderFlashBanner = (parent) => {
  try {
    const raw = sessionStorage.getItem('flash')
    if (!raw) return
    const { type = 'info', text = 'Necesitas iniciar sesión para continuar.' } =
      JSON.parse(raw) || {}
    const banner = document.createElement('div')
    banner.id = 'flash-banner'
    banner.className = `flash ${type}`
    banner.textContent = text
    parent.prepend(banner)
  } catch {}
  try {
    sessionStorage.removeItem('flash')
  } catch {}
}

export const LoginRegister = async () => {
  const main = document.querySelector('main')
  main.innerHTML = ''
  const old = document.querySelector('#login')
  if (old) old.remove()

  const token = localStorage.getItem('token')
  if (token) {
    try {
      await apiCatch('/api/v2/users/validate', 'GET', null, token)
      await navigate('home')
      Header()
      return
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    }
  }

  const container = document.createElement('div')
  container.id = 'login'

  // --- mostrar aviso si viene de redirección ---
  renderFlashBanner(container)

  const { form, inputs } = createFormWithInputs([
    ['text', 'User Name'],
    ['password', '******']
  ])
  const [inputUserName, inputPassword] = inputs

  const loginButton = Button(null, 'Login', 'secondary', 's')
  loginButton.type = 'submit'
  form.appendChild(loginButton)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    submitLogin(inputUserName.value.trim(), inputPassword.value, form)
  })

  if (!token) {
    const registerText = document.createElement('p')
    registerText.textContent = '¿No estás registrado? Regístrate Aquí'
    registerText.className = 'register-link'
    registerText.addEventListener('click', () => {
      renderRegisterForm(main)
    })
    container.appendChild(registerText)
  }

  container.append(form)
  main.append(container)
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
    localStorage.setItem('userId', data.user._id)
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
  const prev = document.querySelector('#login')
  if (prev) prev.remove()

  const container = document.createElement('div')
  container.id = 'login'

  // --- mostrar aviso si se quisiera usar también aquí ---
  renderFlashBanner(container)

  const { form, inputs } = createFormWithInputs([
    ['text', 'User Name (sin puntos)'],
    ['text', 'Email'],
    ['password', 'Contraseña (mínimo 6 caracteres)']
  ])
  const [inputUserName, inputEmail, inputPassword] = inputs

  const registerButton = Button(null, 'Register', 'secondary', 's')
  registerButton.type = 'submit'
  form.appendChild(registerButton)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    submitRegister(
      inputUserName.value.trim(),
      inputEmail.value.trim(),
      inputPassword.value,
      form
    )
  })

  container.append(form)
  main.append(container)
}

const submitRegister = async (userName, email, password, form) => {
  if (!userName || !email || !password) {
    showError(form, 'Por favor completa todos los campos.')
    return
  }

  if (userName.includes('.')) {
    showError(form, 'El nombre de usuario no puede contener puntos.')
    return
  }

  if (password.length < 6) {
    showError(form, 'La contraseña debe tener al menos 6 caracteres.')
    return
  }

  loader(true)
  try {
    const data = await apiCatch('/api/v2/users/register', 'POST', {
      userName,
      email,
      password
    })

    if (!data || !data.token || !data.user) {
      throw new Error('Registro fallido')
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.user._id)
    await navigate('home')
    Header()
  } catch (err) {
    if (err.status === 400) {
      const msg = err.body?.message || 'Error'
      if (msg === 'Nombre de usuario ya existe') {
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
