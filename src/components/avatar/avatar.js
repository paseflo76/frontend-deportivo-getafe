export const Avatar = ({ src, alt }) => {
  const img = document.createElement('img')
  img.className = 'perfil-avatar'
  img.src = src || '/default-avatar.png'
  img.alt = alt || 'Avatar de usuario'
  return img
}
