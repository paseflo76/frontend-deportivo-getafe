export const Avatar = ({ src, alt }) => {
  const img = document.createElement('img')
  img.className = 'perfil-avatar'
  img.src = src || '/assets/avatar.png'
  img.alt = alt || 'Avatar de usuario'
  return img
}
