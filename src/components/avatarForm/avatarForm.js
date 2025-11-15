import { Button } from '../button/button.js'
import { apiCatch } from '../../utils/fetch/fech.js'

export const AvatarForm = async (userId, token, avatarImg) => {
  const form = document.createElement('form')
  form.enctype = 'multipart/form-data'

  const input = document.createElement('input')
  input.type = 'file'
  input.name = 'avatar'
  input.accept = 'image/*'

  const btn = Button(null, 'Cambiar Avatar', 'secundary', 's')
  btn.type = 'submit'

  const loader = document.createElement('span')
  loader.className = 'loader'
  loader.style.display = 'none'

  form.append(input, btn, loader)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (!input.files[0]) return

    btn.disabled = true
    input.disabled = true
    loader.style.display = 'inline'

    const formData = new FormData()
    formData.append('avatar', input.files[0])

    try {
      const res = await apiCatch(
        `/users/${userId}/avatar`,
        'POST',
        formData,
        token,
        true
      )
      if (res && res.avatar) {
        avatarImg.src = res.avatar
        input.value = ''
      }
    } finally {
      btn.disabled = false
      input.disabled = false
      loader.style.display = 'none'
    }
  })

  return form
}
