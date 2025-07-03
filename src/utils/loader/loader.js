import './loader.css'

export const loader = (show = true) => {
  const loaderId = 'global-loader'
  let loader = document.getElementById(loaderId)

  if (show) {
    if (!loader) {
      loader = document.createElement('div')
      loader.id = loaderId

      const img = document.createElement('img')
      img.src = '/assets/ciculo-carga.gif'
      img.alt = ''
      img.className = 'loader-gif'

      loader.appendChild(img)
      document.body.appendChild(loader)
    }
  } else {
    loader?.remove()
  }
}
