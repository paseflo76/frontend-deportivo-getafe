import './footer.css'

export const Footer = () => {
  const footer = document.querySelector('footer')
  if (!footer) return

  footer.innerHTML = ''
  const divFooter = document.createElement('div')
  const pFooter = document.createElement('p')
  pFooter.textContent = '© Copyright 2025 - Deportivo Getafe - Pablo Serrano'

  divFooter.appendChild(pFooter)
  footer.appendChild(divFooter)
}
