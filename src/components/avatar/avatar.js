/* export const Avatar = ({ src, alt }) => {
  const img = document.createElement('img')
  img.className = 'perfil-avatar'
  img.src = src || '/assets/avatar.png'
  img.alt = alt || 'Avatar de usuario'
  return img
}
 */
export const Avatar = ({ src, alt }) => {
  const wrapper = document.createElement('div')
  wrapper.className = 'avatar-wrapper'

  const loader = document.createElement('div')
  loader.className = 'avatar-loader'
  loader.innerHTML = '<div class="spinner"></div>'
  wrapper.appendChild(loader)

  const img = document.createElement('img')
  img.className = 'perfil-avatar'
  img.src = src || '/assets/avatar.png'
  img.alt = alt || 'Avatar de usuario'
  img.style.opacity = '0'
  img.style.cursor = 'not-allowed'
  img.draggable = false

  img.onload = () => {
    loader.remove()
    img.style.opacity = '1'
    img.style.cursor = 'default'
  }

  wrapper.appendChild(img)
  return wrapper
}
