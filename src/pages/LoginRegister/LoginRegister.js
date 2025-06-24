import './LoginRegister.css'
import { navigate } from '../../main'
import { Header } from '../../components/Header/Header'
import { loader } from '../../utils/loader/loader'
import { API_BASE, apiCatch } from '../../utils/fetch/fech'
import { Button } from '../../components/button/button'

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
  /*  const inputEmail = document.createElement('input') */
  const inputPassword = document.createElement('input')

  inputUserName.placeholder = 'User Name'
  /* inputEmail.placeholder = 'Email' */
  inputPassword.type = 'password'
  inputPassword.placeholder = '******'

  form.append(inputUserName, inputEmail, inputPassword)
  container.append(form)

  const loginButton = Button(form, 'Login', 'primary', 'medium')
  const registerButton = Button(form, 'Register', 'secondary', 'medium')

  loginButton.type = 'button'
  registerButton.type = 'button'

  loginButton.addEventListener('click', () => {
    submit(
      inputUserName.value.trim(),
      inputEmail.value.trim(),
      inputPassword.value,
      form,
      true
    )
  })

  registerButton.addEventListener('click', () => {
    submit(
      inputUserName.value.trim(),
      inputEmail.value.trim(),
      inputPassword.value,
      form,
      false
    )
  })
}

const submit = async (userName, email, password, form, isLogin) => {
  if (
    (isLogin && (!userName || !password)) ||
    (!isLogin && (!userName || !email || !password))
  ) {
    showError(form, 'Por favor completa todos los campos.')
    return
  }

  const payload = isLogin
    ? { userName, password }
    : { userName, email, password }

  const url = isLogin ? '/api/v2/users/login' : '/api/v2/users/register'

  loader(true)
  try {
    const data = await apiCatch(url, 'POST', payload)
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
