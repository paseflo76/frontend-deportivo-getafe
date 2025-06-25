import './button.css'

//! funcion componente button

export const Button = (texto, importance, size, type = 'button') => {
  const button = document.createElement('button')
  button.type = type
  button.classList = 'main-button'
  button.classList.add(importance)
  button.classList.add(size)
  button.textContent = texto
  return button
}
