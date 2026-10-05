import './cronicas.css'

import {
  calendario,
  getResultados,
  getCronicas,
  getJornadaActual,
  setJornadaActual,
  parseJwt
} from '../../utils/data.js'

import { apiCatch } from '../../utils/fetch/fech.js'

// ======================================================
// ESCUDOS
// ======================================================

const escudos = {
  'ARSENAL GETAFE': '/assets/escudos/arsenal-getafe.png',
  'BRAVO GETAFE': '/assets/escudos/bravo-getafe.png',
  'CELTIC DE ESPARTA': '/assets/escudos/celtic-de-esparta.png',
  'CHACARITAS GETAFE': '/assets/escudos/chacaritas-getafe.png',
  'DEPORTIVO GETAFE': '/assets/escudos/deportivo-getafe.png',
  'G.E AIRBUS': '/assets/escudos/ge-airbus.png',
  'LOS BRASAS': '/assets/escudos/los-brasas.png',
  'OLIMPIC DE UCRANIA': '/assets/escudos/olimpic-de-ucrania.png',
  'SAN FRANCIS FC': '/assets/escudos/san-francis-fc.png',
  'CAFETEROS FC': '/assets/escudos/cafeteros-fc.png',
  'CERVEZAS CLUB': '/assets/escudos/cervezas-club.png'
}

// ======================================================
// PÁGINA
// ======================================================

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

  // ======================================================
  // RESULTADOS
  // ======================================================

  let resultados = []

  try {
    resultados = await getResultados()
  } catch (error) {
    console.error('Error al obtener resultados:', error)
  }

  // ======================================================
  // CRÓNICAS
  // ======================================================

  let cronicas = []

  try {
    cronicas = await getCronicas()
  } catch (error) {
    console.error('Error al obtener las crónicas:', error)
  }

  // ======================================================
  // RENDER
  // ======================================================

  async function render() {
    container.innerHTML = ''

    const partidosCalendario = calendario[jornada - 1] || []

    const cronica =
      cronicas.find((item) => Number(item.jornada) === Number(jornada)) || null

    const partidos = partidosCalendario.filter(
      (partido) => partido.local && partido.visitante
    )

    const descansan = partidosCalendario.filter((partido) => partido.descansa)

    const resultadosJornada = resultados.filter(
      (resultado) => Number(resultado.jornada) === Number(jornada)
    )

    // ==================================================
    // CABECERA PRINCIPAL
    // ==================================================

    const cabeceraPrincipal = document.createElement('header')
    cabeceraPrincipal.className = 'periodico-header'

    cabeceraPrincipal.innerHTML = `
      <div class="periodico-header-inner">

        <div class="periodico-balón">
          ⚽
        </div>

        <div class="periodico-marca">
          <span>DEPORTIVO GETAFE</span>
          <h1>PASIÓN FÚTBOL GETAFE</h1>
          <small>LA LIGA LOCAL DE GETAFE</small>
        </div>

        <div class="periodico-jornada">
          <span>JORNADA</span>
          <strong>${jornada}</strong>
        </div>

      </div>
    `

    container.appendChild(cabeceraPrincipal)

    // ==================================================
    // NAVEGACIÓN
    // ==================================================

    const navegacion = document.createElement('div')
    navegacion.className = 'cronicas-navegacion'

    const anterior = document.createElement('button')

    anterior.className = 'btn-jornada'

    anterior.innerHTML = `
      <span>←</span>
      <small>ANTERIOR</small>
    `

    anterior.disabled = jornada <= 1

    anterior.addEventListener('click', async () => {
      if (jornada <= 1) return

      jornada--

      setJornadaActual(jornada)

      await render()

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })

    const centroJornada = document.createElement('div')

    centroJornada.className = 'jornada-centro'

    centroJornada.innerHTML = `
      <span>JORNADA</span>
      <strong>${jornada}</strong>
    `

    const siguiente = document.createElement('button')

    siguiente.className = 'btn-jornada'

    siguiente.innerHTML = `
      <small>SIGUIENTE</small>
      <span>→</span>
    `

    siguiente.disabled = jornada >= calendario.length

    siguiente.addEventListener('click', async () => {
      if (jornada >= calendario.length) return

      jornada++

      setJornadaActual(jornada)

      await render()

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })

    navegacion.appendChild(anterior)
    navegacion.appendChild(centroJornada)
    navegacion.appendChild(siguiente)

    container.appendChild(navegacion)

    // ==================================================
    // FECHA
    // ==================================================

    const partidoConFecha = partidosCalendario.find((partido) => partido.fecha)

    const fechaTexto = partidoConFecha
      ? formatearFecha(partidoConFecha.fecha)
      : ''

    // ==================================================
    // TITULAR DE LA JORNADA
    // ==================================================

    const titularSection = document.createElement('section')

    titularSection.className = 'titular-jornada'

    titularSection.innerHTML = `
      <div class="titular-linea"></div>

      <div class="trofeo-titular">
        🏆
      </div>

      <span class="etiqueta-seccion">
        TITULAR DE LA JORNADA
      </span>

      <h2>
        ${escapeHtml(
          cronica?.titular || `Jornada ${jornada}: fútbol y emoción en Getafe`
        )}
      </h2>

      ${
        cronica?.resumen
          ? `
            <p>
              ${escapeHtml(cronica.resumen)}
            </p>
          `
          : ''
      }

      ${fechaTexto ? `<span class="fecha-jornada">${fechaTexto}</span>` : ''}

      <div class="titular-linea"></div>
    `

    container.appendChild(titularSection)

    // ==================================================
    // PARTIDO ESTRELLA
    // ==================================================

    const partidoEstrella = partidos.find(
      (partido) =>
        normalizarEquipo(partido.local) === 'DEPORTIVO GETAFE' ||
        normalizarEquipo(partido.visitante) === 'DEPORTIVO GETAFE'
    )

    if (partidoEstrella) {
      const resultadoEstrella = encontrarResultado(
        resultadosJornada,
        partidoEstrella.local,
        partidoEstrella.visitante
      )

      const claveEstrella = `${partidoEstrella.local}-${partidoEstrella.visitante}`

      const textoEstrella =
        cronica?.cronicas?.find((item) => item.partido === claveEstrella)
          ?.texto || ''

      const estrella = document.createElement('section')

      estrella.className = 'partido-estrella'

      estrella.innerHTML = `
        <div class="seccion-cabecera">
          <span>⚽</span>
          <h2>PARTIDO ESTRELLA</h2>
          <span>⚽</span>
        </div>

        <div class="estrella-contenido">

          <div class="estrella-titulo">
            <span>JORNADA ${jornada}</span>

            <h3>
              ${escapeHtml(partidoEstrella.local)}
              <b>VS</b>
              ${escapeHtml(partidoEstrella.visitante)}
            </h3>
          </div>

          <div class="marcador-estrella">

            <div class="equipo-estrella">
              ${crearEscudo(partidoEstrella.local, 'escudo-estrella')}

              <strong>
                ${escapeHtml(partidoEstrella.local)}
              </strong>
            </div>

            <div class="resultado-estrella">

              <span>
                ${resultadoEstrella ? resultadoEstrella.golesLocal : '-'}
              </span>

              <b>:</b>

              <span>
                ${resultadoEstrella ? resultadoEstrella.golesVisitante : '-'}
              </span>

            </div>

            <div class="equipo-estrella">

              ${crearEscudo(partidoEstrella.visitante, 'escudo-estrella')}

              <strong>
                ${escapeHtml(partidoEstrella.visitante)}
              </strong>

            </div>

          </div>

          ${
            cronica?.imagenEstrella
              ? `
                <div class="imagen-estrella">
                  <img
                    src="${escapeAttribute(cronica.imagenEstrella)}"
                    alt="Partido estrella jornada ${jornada}"
                  >
                </div>
              `
              : ''
          }

          <div class="cronica-estrella-texto">

            <h3>LA CRÓNICA</h3>

            ${
              textoEstrella
                ? `<p>${escapeHtml(textoEstrella)}</p>`
                : `
                  <p class="sin-cronica">
                    La crónica de este partido todavía no está disponible.
                  </p>
                `
            }

          </div>

        </div>
      `

      container.appendChild(estrella)
    }

    // ==================================================
    // RESULTADOS
    // ==================================================

    const resultadosSection = document.createElement('section')

    resultadosSection.className = 'resultados-jornada'

    resultadosSection.innerHTML = `
      <div class="seccion-cabecera">
        <span>⚽</span>
        <h2>RESULTADOS</h2>
        <span>⚽</span>
      </div>
    `

    if (cronica?.imagenResultados) {
      const imagenResultados = document.createElement('div')

      imagenResultados.className = 'imagen-resultados'

      imagenResultados.innerHTML = `
        <img
          src="${escapeAttribute(cronica.imagenResultados)}"
          alt="Resultados jornada ${jornada}"
        >
      `

      resultadosSection.appendChild(imagenResultados)
    }

    const listaResultados = document.createElement('div')

    listaResultados.className = 'lista-resultados'

    for (const partido of partidos) {
      const resultado = encontrarResultado(
        resultadosJornada,
        partido.local,
        partido.visitante
      )

      const clave = `${partido.local}-${partido.visitante}`

      const texto =
        cronica?.cronicas?.find((item) => item.partido === clave)?.texto || ''

      const esPartidoEstrella =
        normalizarEquipo(partido.local) === 'DEPORTIVO GETAFE' ||
        normalizarEquipo(partido.visitante) === 'DEPORTIVO GETAFE'

      if (esPartidoEstrella) continue

      const tarjeta = document.createElement('article')

      tarjeta.className = 'resultado-card'

      tarjeta.innerHTML = `
        <div class="resultado-equipos">

          <div class="resultado-equipo">
            ${crearEscudo(partido.local)}

            <span>
              ${escapeHtml(partido.local)}
            </span>
          </div>

          <div class="resultado-marcador">
            ${
              resultado
                ? `${resultado.golesLocal} - ${resultado.golesVisitante}`
                : '-'
            }
          </div>

          <div class="resultado-equipo visitante">
            <span>
              ${escapeHtml(partido.visitante)}
            </span>

            ${crearEscudo(partido.visitante)}
          </div>

        </div>

        ${
          texto
            ? `
              <p>
                ${escapeHtml(texto)}
              </p>
            `
            : ''
        }
      `

      listaResultados.appendChild(tarjeta)
    }

    resultadosSection.appendChild(listaResultados)

    container.appendChild(resultadosSection)

    // ==================================================
    // DESCANSA
    // ==================================================

    if (descansan.length) {
      const descanso = document.createElement('div')

      descanso.className = 'equipo-descansa'

      descanso.innerHTML = `
        <span>DESCANSA</span>

        ${crearEscudo(descansan[0].descansa)}

        <strong>
          ${escapeHtml(descansan[0].descansa)}
        </strong>
      `

      container.appendChild(descanso)
    }

    // ==================================================
    // DATOS
    // ==================================================

    if (resultadosJornada.length) {
      const datos = calcularDatosJornada(resultadosJornada)

      const datosSection = document.createElement('section')

      datosSection.className = 'datos-jornada'

      datosSection.innerHTML = `
        <div class="seccion-cabecera">
          <span>📊</span>
          <h2>DATOS DE LA JORNADA</h2>
          <span>📊</span>
        </div>

        <div class="datos-grid">

          <div>
            <strong>${datos.goles}</strong>
            <span>GOLES</span>
          </div>

          <div>
            <strong>${datos.empates}</strong>
            <span>EMPATES</span>
          </div>

          <div>
            <strong>${datos.locales}</strong>
            <span>VICTORIAS LOCALES</span>
          </div>

          <div>
            <strong>${datos.visitantes}</strong>
            <span>VICTORIAS VISITANTES</span>
          </div>

        </div>
      `

      container.appendChild(datosSection)
    }

    // ==================================================
    // ADMINISTRACIÓN
    // ==================================================

    if (esAdmin) {
      crearPanelAdmin(container, jornada, partidos, cronica)
    }
  }

  await render()
}

// ======================================================
// PANEL ADMIN
// ======================================================

function crearPanelAdmin(container, jornada, partidos, cronica) {
  const admin = document.createElement('section')

  admin.className = 'cronica-admin'

  admin.innerHTML = `
    <div class="admin-titulo">
      <span>⚙</span>

      <div>
        <small>ADMINISTRACIÓN</small>

        <h2>
          ${cronica ? 'EDITAR CRÓNICA' : 'CREAR CRÓNICA'}
        </h2>
      </div>
    </div>

    <label>Titular de la jornada</label>

    <input
      id="cronica-titular"
      type="text"
      value="${escapeAttribute(cronica?.titular || '')}"
      placeholder="Ej: Deportivo Getafe firma una jornada para recordar"
    >

    <label>Resumen de la jornada</label>

    <textarea
      id="cronica-resumen"
      rows="4"
      placeholder="Escribe un breve resumen de la jornada..."
    >${escapeHtml(cronica?.resumen || '')}</textarea>

    <div class="imagenes-admin">

      <div class="imagen-admin-campo">

        <label>Foto Partido Estrella</label>

        <input
          id="imagen-estrella"
          type="file"
          accept="image/*"
        >

        ${
          cronica?.imagenEstrella
            ? `
              <img
                id="preview-estrella"
                class="preview-admin"
                src="${escapeAttribute(cronica.imagenEstrella)}"
                alt="Imagen actual"
              >
            `
            : `
              <div
                id="preview-estrella"
                class="preview-admin vacio"
              >
                SIN IMAGEN
              </div>
            `
        }

      </div>

      <div class="imagen-admin-campo">

        <label>Foto Resultados</label>

        <input
          id="imagen-resultados"
          type="file"
          accept="image/*"
        >

        ${
          cronica?.imagenResultados
            ? `
              <img
                id="preview-resultados"
                class="preview-admin"
                src="${escapeAttribute(cronica.imagenResultados)}"
                alt="Imagen actual"
              >
            `
            : `
              <div
                id="preview-resultados"
                class="preview-admin vacio"
              >
                SIN IMAGEN
              </div>
            `
        }

      </div>

    </div>

    <div class="editor-partidos">

      <h3>CRÓNICAS DE LOS PARTIDOS</h3>

      <div id="editor-partidos"></div>

    </div>

    <div class="admin-botones">

      <button
        id="guardar-cronica"
        class="btn-guardar"
      >
        ${cronica ? 'ACTUALIZAR CRÓNICA' : 'GUARDAR CRÓNICA'}
      </button>

      ${
        cronica
          ? `
            <button
              id="eliminar-cronica"
              class="btn-eliminar"
            >
              ELIMINAR CRÓNICA
            </button>
          `
          : ''
      }

    </div>
  `

  container.appendChild(admin)

  // ======================================================
  // EDITOR PARTIDOS
  // ======================================================

  const editor = admin.querySelector('#editor-partidos')

  partidos.forEach((partido) => {
    const clave = `${partido.local}-${partido.visitante}`

    const texto =
      cronica?.cronicas?.find((item) => item.partido === clave)?.texto || ''

    const bloque = document.createElement('div')

    bloque.className = 'editor-partido'

    bloque.innerHTML = `
      <div class="editor-partido-cabecera">

        ${crearEscudo(partido.local, 'escudo-editor')}

        <h4>
          ${escapeHtml(partido.local)}
          <span>VS</span>
          ${escapeHtml(partido.visitante)}
        </h4>

        ${crearEscudo(partido.visitante, 'escudo-editor')}

      </div>

      <textarea
        data-partido="${escapeAttribute(clave)}"
        rows="6"
        placeholder="Escribe la crónica de este partido..."
      >${escapeHtml(texto)}</textarea>
    `

    editor.appendChild(bloque)
  })

  // ======================================================
  // PREVIEWS
  // ======================================================

  const inputEstrella = admin.querySelector('#imagen-estrella')

  const inputResultados = admin.querySelector('#imagen-resultados')

  inputEstrella.addEventListener('change', () => {
    mostrarPreview(inputEstrella, admin.querySelector('#preview-estrella'))
  })

  inputResultados.addEventListener('change', () => {
    mostrarPreview(inputResultados, admin.querySelector('#preview-resultados'))
  })

  // ======================================================
  // GUARDAR
  // ======================================================

  const guardar = admin.querySelector('#guardar-cronica')

  guardar.addEventListener('click', async () => {
    const titular = admin.querySelector('#cronica-titular').value.trim()

    const resumen = admin.querySelector('#cronica-resumen').value.trim()

    const cronicas = [...editor.querySelectorAll('textarea[data-partido]')].map(
      (textarea) => ({
        partido: textarea.dataset.partido,
        texto: textarea.value.trim()
      })
    )

    const formData = new FormData()

    formData.append('jornada', jornada)
    formData.append('titular', titular)
    formData.append('resumen', resumen)
    formData.append('cronicas', JSON.stringify(cronicas))

    if (inputEstrella.files[0]) {
      formData.append('imagenEstrella', inputEstrella.files[0])
    }

    if (inputResultados.files[0]) {
      formData.append('imagenResultados', inputResultados.files[0])
    }

    guardar.disabled = true
    guardar.textContent = 'GUARDANDO...'

    try {
      const token = localStorage.getItem('token')

      const metodo = cronica ? 'PUT' : 'POST'

      const endpoint = cronica ? `/cronicas/${jornada}` : '/cronicas'

      await apiCatch(endpoint, metodo, formData, token)

      alert('Crónica guardada correctamente')

      window.location.reload()
    } catch (error) {
      console.error(error)

      alert(error?.body?.message || 'Error al guardar la crónica')

      guardar.disabled = false

      guardar.textContent = cronica ? 'ACTUALIZAR CRÓNICA' : 'GUARDAR CRÓNICA'
    }
  })

  // ======================================================
  // ELIMINAR
  // ======================================================

  const eliminar = admin.querySelector('#eliminar-cronica')

  if (eliminar) {
    eliminar.addEventListener('click', async () => {
      const confirmar = confirm(
        `¿Seguro que quieres eliminar la crónica de la jornada ${jornada}?`
      )

      if (!confirmar) return

      try {
        const token = localStorage.getItem('token')

        await apiCatch(`/cronicas/${jornada}`, 'DELETE', null, token)

        alert('Crónica eliminada correctamente')

        window.location.reload()
      } catch (error) {
        console.error(error)

        alert(error?.body?.message || 'Error al eliminar la crónica')
      }
    })
  }
}

// ======================================================
// PREVIEW
// ======================================================

function mostrarPreview(input, preview) {
  const archivo = input.files[0]

  if (!archivo) return

  const url = URL.createObjectURL(archivo)

  if (preview.tagName === 'IMG') {
    preview.src = url
  } else {
    const img = document.createElement('img')

    img.id = preview.id
    img.className = 'preview-admin'
    img.src = url
    img.alt = 'Vista previa'

    preview.replaceWith(img)
  }
}

// ======================================================
// ESCUDO
// ======================================================

function crearEscudo(nombre, clase = '') {
  const imagen = escudos[normalizarEquipo(nombre)]

  if (!imagen) {
    return `
      <div class="escudo-placeholder ${clase}">
        ⚽
      </div>
    `
  }

  return `
    <img
      class="escudo ${clase}"
      src="${imagen}"
      alt="Escudo ${escapeAttribute(nombre)}"
    >
  `
}

// ======================================================
// NORMALIZAR EQUIPO
// ======================================================

function normalizarEquipo(nombre) {
  return String(nombre || '')
    .trim()
    .toUpperCase()
}

// ======================================================
// BUSCAR RESULTADO
// ======================================================

function encontrarResultado(resultados, local, visitante) {
  return resultados.find((resultado) => {
    return (
      normalizarEquipo(resultado.local) === normalizarEquipo(local) &&
      normalizarEquipo(resultado.visitante) === normalizarEquipo(visitante)
    )
  })
}

// ======================================================
// DATOS
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
  const partes = String(fecha).split('-')

  if (partes.length !== 3) {
    return fecha
  }

  return `${partes[0]}/${partes[1]}/20${partes[2]}`
}

// ======================================================
// SEGURIDAD
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
