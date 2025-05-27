import './button.css'

//! funcion componente button

export const Button = (nodoPadre, texto, importance, size) => {
  const button = document.createElement('button')
  button.classList = 'main-button'
  button.classList.add(importance)
  button.classList.add(size)
  button.textContent = texto

  nodoPadre.append(button)
  return button
} 