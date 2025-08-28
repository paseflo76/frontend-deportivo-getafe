// utils/jornadas/jornadas.js
import { apiCatch } from '../fetch/fech.js'

export async function renderJornadas(container) {
  container.innerHTML = ''
  const data = await apiCatch('/api/v2/match/matches')

  let current = null
  const token = localStorage.getItem('token')
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null

  data.forEach((m) => {
    if (m.jornada !== current) {
      current = m.jornada
      const h2 = document.createElement('h2')
      h2.textContent = `Jornada ${current}`
      container.appendChild(h2)
    }

    const div = document.createElement('div')
    const score = (m.golesLocal ?? '-') + ' - ' + (m.golesVisitante ?? '-')
    div.textContent = `${m.local} ${score} ${m.visitante}`

    // Si es admin, mostrar inputs para actualizar resultado
    if (user?.rol === 'admin') {
      const inputLocal = document.createElement('input')
      inputLocal.type = 'number'
      inputLocal.value = m.golesLocal ?? ''

      const inputVisit = document.createElement('input')
      inputVisit.type = 'number'
      inputVisit.value = m.golesVisitante ?? ''

      const btn = document.createElement('button')
      btn.textContent = 'Guardar'
      btn.addEventListener('click', async () => {
        await fetch(`/api/v2/match/match/${m._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            golesLocal: parseInt(inputLocal.value),
            golesVisitante: parseInt(inputVisit.value)
          })
        })
      })

      div.appendChild(inputLocal)
      div.appendChild(inputVisit)
      div.appendChild(btn)
    }

    container.appendChild(div)
  })
}
