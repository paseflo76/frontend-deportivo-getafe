export const UserInfo = (user) => {
  const info = document.createElement('div')
  info.className = 'perfil-info'

  const userName = document.createElement('p')
  userName.textContent = `Usuario: ${user.userName}`

  const email = document.createElement('p')
  email.textContent = `Email: ${user.email}`

  info.append(userName, email)
  return info
}
