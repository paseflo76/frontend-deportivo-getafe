import './loader.css'

export const loader = (show = true) => {
  const loaderId = 'global-loader'
  let loader = document.getElementById(loaderId)

  if (show) {
    if (!loader) {
      loader = document.createElement('div')
      loader.id = loaderId
      loader.innerHTML = `<img src="/assets/ciculo-carga.gif" alt="" class="loader-gif" />`
      document.body.appendChild(loader)
    }
  } else {
    loader?.remove()
  }
}
