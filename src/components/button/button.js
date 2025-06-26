import './button.css'

//! funcion componente button

export const Button = (nodoPadre, texto, importance, size, type = 'button') => {
  const button = document.createElement('button')
  button.classList = 'main-button'
  button.classList.add(importance)
  button.classList.add(size)
  button.textContent = texto

  if (nodoPadre) nodoPadre.append(button)
  return button
}
 