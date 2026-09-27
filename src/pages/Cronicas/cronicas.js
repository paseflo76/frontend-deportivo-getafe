import './cronicas.css'

import {
  calendario,
  getResultados,
  getJornadaActual,
  setJornadaActual,
  getCronica,
  saveCronica,
  updateCronica,
  deleteCronica,
  parseJwt
} from '../../utils/data.js'

export async function Cronicas() {
  const main = document.querySelector('main')

  if (!main) return

  main.innerHTML = ''

  const token = localStorage.getItem('token')
  const user = parseJwt(token)

  const esAdmin = user?.rol === 'admin'

  let jornada = getJornadaActual()

  const container = document.createElement('div')
  container.className = 'cronicas-container'

  main.appendChild(container)

  let resultados = []

  try {
    resultados = await getResultados()
  } catch (error) {
    console.error('Error al obtener resultados:', error)
  }

  async function render() {
    container.innerHTML = ''

    const partidosCalendario = calendario[jornada - 1] || []

    let cronica = null

    try {
      cronica = await getCronica(jornada)
    } catch (error) {
      cronica = null
    }

    const partidos = partidosCalendario.filter(
      (partido) => partido.local && partido.visitante
    )

    const descansan = partidosCalendario.filter((partido) => partido.descansa)

    const resultadosJornada = resultados.filter(
      (resultado) => Number(resultado.jornada) === Number(jornada)
    )
    console.log('RESULTADOS JORNADA:', resultadosJornada)
    console.log('PARTIDOS CALENDARIO:', partidos)

    const titulo = document.createElement('h1')
    titulo.textContent = 'CRÓNICAS'

    container.appendChild(titulo)

    // ==================================================
    // NAVEGACIÓN
    // ==================================================

    const navegacion = document.createElement('div')
    navegacion.className = 'cronicas-navegacion'

    const anterior = document.createElement('button')
    anterior.textContent = '←'
    anterior.disabled = jornada <= 1

    anterior.addEventListener('click', async () => {
      if (jornada <= 1) return

      jornada--
      setJornadaActual(jornada)

      await render()
    })

    const textoJornada = document.createElement('span')
    textoJornada.textContent = `JORNADA ${jornada}`

    const siguiente = document.createElement('button')
    siguiente.textContent = '→'
    siguiente.disabled = jornada >= calendario.length

    siguiente.addEventListener('click', async () => {
      if (jornada >= calendario.length) return

      jornada++
      setJornadaActual(jornada)

      await render()
    })

    navegacion.appendChild(anterior)
    navegacion.appendChild(textoJornada)
    navegacion.appendChild(siguiente)

    container.appendChild(navegacion)

    // ==================================================
    // CABECERA DE LA JORNADA
    // ==================================================

    const cabecera = document.createElement('section')
    cabecera.className = 'cronica-cabecera'

    const fecha = partidosCalendario.find((partido) => partido.fecha)

    const fechaTexto = fecha ? formatearFecha(fecha.fecha) : ''

    cabecera.innerHTML = `
      <span class="cronica-jornada">JORNADA ${jornada}</span>

      <h2>
        ${cronica?.titular || 'Crónica de la jornada'}
      </h2>

      ${fechaTexto ? `<p class="cronica-fecha">${fechaTexto}</p>` : ''}

      ${
        cronica?.resumen
          ? `<p class="cronica-resumen">${escapeHtml(cronica.resumen)}</p>`
          : ''
      }
    `

    container.appendChild(cabecera)

    // ==================================================
    // PARTIDOS
    // ==================================================

    const partidosContainer = document.createElement('section')
    partidosContainer.className = 'cronicas-partidos'

    for (const partido of partidos) {
      const resultado = encontrarResultado(
        resultadosJornada,
        partido.local,
        partido.visitante
      )

      const textoCronica =
        cronica?.cronicas?.find(
          (item) => item.partido === `${partido.local}-${partido.visitante}`
        )?.texto || ''

      const card = document.createElement('article')
      card.className = 'cronica-partido'

      card.innerHTML = `
        <div class="cronica-equipos">
          <span>${partido.local}</span>

          <strong>
            ${
              resultado
                ? `${resultado.golesLocal} - ${resultado.golesVisitante}`
                : '-'
            }
          </strong>

          <span>${partido.visitante}</span>
        </div>

        ${
          textoCronica
            ? `<p>${escapeHtml(textoCronica)}</p>`
            : '<p class="sin-cronica">Sin crónica todavía.</p>'
        }
      `

      partidosContainer.appendChild(card)
    }

    container.appendChild(partidosContainer)

    // ==================================================
    // DESCANSA
    // ==================================================

    if (descansan.length) {
      const descanso = document.createElement('div')

      descanso.className = 'equipo-descansa'

      descanso.innerHTML = `
        <span>DESCANSA</span>
        <strong>${descansan[0].descansa}</strong>
      `

      container.appendChild(descanso)
    }

    // ==================================================
    // DATOS DE LA JORNADA
    // ==================================================

    if (resultadosJornada.length) {
      const datos = calcularDatosJornada(resultadosJornada)

      const datosSection = document.createElement('section')

      datosSection.className = 'datos-jornada'

      datosSection.innerHTML = `
        <h2>DATOS DE LA JORNADA</h2>

        <div class="datos-grid">

          <div>
            <strong>${datos.goles}</strong>
            <span>Goles</span>
          </div>

          <div>
            <strong>${datos.empates}</strong>
            <span>Empates</span>
          </div>

          <div>
            <strong>${datos.locales}</strong>
            <span>Victorias locales</span>
          </div>

          <div>
            <strong>${datos.visitantes}</strong>
            <span>Victorias visitantes</span>
          </div>

        </div>
      `

      container.appendChild(datosSection)
    }

    // ==================================================
    // ADMINISTRACIÓN
    // ==================================================

    if (esAdmin) {
      const admin = document.createElement('section')

      admin.className = 'cronica-admin'

      admin.innerHTML = `
        <h2>
          ${cronica ? 'EDITAR CRÓNICA' : 'CREAR CRÓNICA'}
        </h2>

        <label>Titular</label>

        <input
          id="cronica-titular"
          type="text"
          value="${escapeAttribute(cronica?.titular || '')}"
        >

        <label>Resumen</label>

        <textarea
          id="cronica-resumen"
          rows="4"
        >${escapeHtml(cronica?.resumen || '')}</textarea>

        <div id="editor-partidos"></div>

        <button id="guardar-cronica">
          ${cronica ? 'ACTUALIZAR CRÓNICA' : 'GUARDAR CRÓNICA'}
        </button>

        ${
          cronica
            ? `
              <button id="eliminar-cronica" class="btn-eliminar">
                ELIMINAR CRÓNICA
              </button>
            `
            : ''
        }
      `

      container.appendChild(admin)

      const editor = admin.querySelector('#editor-partidos')

      partidos.forEach((partido) => {
        const clave = `${partido.local}-${partido.visitante}`

        const texto =
          cronica?.cronicas?.find((item) => item.partido === clave)?.texto || ''

        const bloque = document.createElement('div')

        bloque.className = 'editor-partido'

        bloque.innerHTML = `
          <h3>
            ${partido.local}
            -
            ${partido.visitante}
          </h3>

          <textarea
            data-partido="${escapeAttribute(clave)}"
            rows="6"
            placeholder="Escribe la crónica de este partido..."
          >${escapeHtml(texto)}</textarea>
        `

        editor.appendChild(bloque)
      })

      const guardar = admin.querySelector('#guardar-cronica')

      guardar.addEventListener('click', async () => {
        const titular = admin.querySelector('#cronica-titular').value.trim()

        const resumen = admin.querySelector('#cronica-resumen').value.trim()

        const cronicas = [
          ...editor.querySelectorAll('textarea[data-partido]')
        ].map((textarea) => ({
          partido: textarea.dataset.partido,
          texto: textarea.value.trim()
        }))

        const datos = {
          jornada,
          titular,
          resumen,
          cronicas
        }

        try {
          if (cronica) {
            await updateCronica(jornada, datos)
          } else {
            await saveCronica(datos)
          }

          await render()
        } catch (error) {
          console.error(error)

          alert('Error al guardar la crónica')
        }
      })

      const eliminar = admin.querySelector('#eliminar-cronica')

      if (eliminar) {
        eliminar.addEventListener('click', async () => {
          try {
            await deleteCronica(jornada)

            await render()
          } catch (error) {
            console.error(error)

            alert('Error al eliminar la crónica')
          }
        })
      }
    }
  }

  await render()
}

// ======================================================
// BUSCAR RESULTADO
// ======================================================

function encontrarResultado(resultados, local, visitante) {
  return resultados.find((resultado) => {
    return resultado.local === local && resultado.visitante === visitante
  })
}

// ======================================================
// DATOS DE LA JORNADA
// ======================================================

function calcularDatosJornada(resultados) {
  let goles = 0
  let empates = 0
  let locales = 0
  let visitantes = 0

  resultados.forEach((resultado) => {
    const local = Number(resultado.golesLocal)
    const visitante = Number(resultado.golesVisitante)

    goles += local + visitante

    if (local === visitante) {
      empates++
    } else if (local > visitante) {
      locales++
    } else {
      visitantes++
    }
  })

  return {
    goles,
    empates,
    locales,
    visitantes
  }
}

// ======================================================
// FECHA
// ======================================================

function formatearFecha(fecha) {
  const partes = fecha.split('-')

  if (partes.length !== 3) {
    return fecha
  }

  return `${partes[0]}/${partes[1]}/20${partes[2]}`
}

// ======================================================
// SEGURIDAD HTML
// ======================================================

function escapeHtml(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function escapeAttribute(texto) {
  return escapeHtml(texto)
}
