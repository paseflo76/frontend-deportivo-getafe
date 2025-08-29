// pages/jornadas/jornadas.js
import { parseJwt } from '../../components/Header/Header.js'
import { apiCatch } from '../../utils/fetch/fech.js'

import './jornadas.css'

export async function renderJornadas(container, divClasificacion = null) {
  container.innerHTML = ''

  let data = []
  try {
    data = await apiCatch('/api/v2/match/matches')
  } catch (err) {
    container.textContent = 'Error al cargar las jornadas'
    console.error(err)
    return
  }

  if (!data || data.length === 0) {
    container.textContent = 'No hay partidos disponibles'
    return
  }

  data.sort((a, b) => {
    if (a.jornada !== b.jornada) return a.jornada - b.jornada
    return new Date(a.fecha) - new Date(b.fecha)
  })

  const token = localStorage.getItem('token')
  const user = token ? parseJwt(token) : null
  let currentJornada = null

  data.forEach((m) => {
    if (m.jornada !== currentJornada) {
      currentJornada = m.jornada
      const h2 = document.createElement('h2')
      h2.textContent = `Jornada ${currentJornada}`
      container.appendChild(h2)
    }

    const matchDiv = document.createElement('div')
    matchDiv.className = 'match-div'

    const local = m.local ?? 'Local'
    const visitante = m.visitante ?? 'Visitante'

    if (user?.rol === 'admin') {
      const inputLocal = document.createElement('input')
      inputLocal.type = 'number'
      inputLocal.value = m.golesLocal ?? ''
      inputLocal.min = 0

      const inputVisitante = document.createElement('input')
      inputVisitante.type = 'number'
      inputVisitante.value = m.golesVisitante ?? ''
      inputVisitante.min = 0

      const btnSave = document.createElement('button')
      btnSave.textContent = 'Guardar'
      btnSave.addEventListener('click', async () => {
        try {
          await fetch(`/api/v2/league/match/${m._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              golesLocal: Number(inputLocal.value),
              golesVisitante: Number(inputVisitante.value)
            })
          })
          // Re-render jornadas
          await renderJornadas(container, divClasificacion)
          // Re-render clasificación si se pasó el div
          if (divClasificacion) {
            const { renderClasificacion } = await import(
              '../../utils/clasificacion.js/Clasificacion.js'
            )
            await renderClasificacion(divClasificacion)
          }
        } catch (err) {
          console.error(err)
        }
      })

      matchDiv.append(
        `${local} `,
        inputLocal,
        ' - ',
        inputVisitante,
        ` ${visitante} `,
        btnSave
      )
    } else {
      const golesLocal = m.golesLocal ?? '-'
      const golesVisitante = m.golesVisitante ?? '-'
      matchDiv.textContent = `${local} ${golesLocal} - ${golesVisitante} ${visitante}`
    }

    container.appendChild(matchDiv)
  })
}
