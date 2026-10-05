// clasificacion.js corregido para estructura de partidos horizontal

const mongoose = require('mongoose')
const Match = require('../models/Match')

// ======================================================
// OBTENER TODOS LOS PARTIDOS
// ======================================================

const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({
      jornada: 1,
      fecha: 1
    })

    res.status(200).json(matches)
  } catch (err) {
    console.error('Error obteniendo partidos:', err)

    res.status(500).json({
      message: 'Error obteniendo partidos',
      error: err.message
    })
  }
}

// ======================================================
// OBTENER PARTIDOS DE UNA JORNADA
// ======================================================

const getMatchesByJornada = async (req, res) => {
  try {
    const { jornada } = req.params

    const matches = await Match.find({
      jornada: Number(jornada)
    }).sort({
      fecha: 1
    })

    res.status(200).json(matches)
  } catch (err) {
    console.error('Error obteniendo jornada:', err)

    res.status(500).json({
      message: 'Error obteniendo jornada',
      error: err.message
    })
  }
}

// ======================================================
// CREAR PARTIDO
// ======================================================

const createMatch = async (req, res) => {
  try {
    const payload = {
      jornada: Number(req.body.jornada),
      fecha: req.body.fecha,
      local: req.body.local,
      visitante: req.body.visitante,
      golesLocal: req.body.golesLocal ?? null,
      golesVisitante: req.body.golesVisitante ?? null
    }

    // Evitar partidos duplicados
    const exists = await Match.findOne({
      jornada: payload.jornada,
      local: payload.local,
      visitante: payload.visitante
    })

    if (exists) {
      return res.status(409).json({
        message: 'El partido ya existe',
        partido: exists
      })
    }

    const match = new Match(payload)

    const saved = await match.save()

    res.status(201).json(saved)
  } catch (err) {
    console.error('Error creando partido:', err)

    res.status(500).json({
      message: 'Error creando partido',
      error: err.message
    })
  }
}

// ======================================================
// ACTUALIZAR PARTIDO
// ======================================================

const updateMatch = async (req, res) => {
  try {
    const { id } = req.params

    const payload = {
      jornada:
        req.body.jornada !== undefined ? Number(req.body.jornada) : undefined,

      fecha: req.body.fecha,

      local: req.body.local,

      visitante: req.body.visitante,

      golesLocal:
        req.body.golesLocal !== undefined ? req.body.golesLocal : null,

      golesVisitante:
        req.body.golesVisitante !== undefined ? req.body.golesVisitante : null
    }

    // Evitar duplicados al modificar
    if (payload.jornada && payload.local && payload.visitante) {
      const duplicate = await Match.findOne({
        _id: { $ne: id },
        jornada: payload.jornada,
        local: payload.local,
        visitante: payload.visitante
      })

      if (duplicate) {
        return res.status(409).json({
          message: 'Ya existe otro partido con esos datos'
        })
      }
    }

    const updated = await Match.findByIdAndUpdate(id, payload, {
      new: true
    })

    if (!updated) {
      return res.status(404).json({
        message: 'Partido no encontrado'
      })
    }

    res.status(200).json(updated)
  } catch (err) {
    console.error('Error actualizando partido:', err)

    res.status(500).json({
      message: 'Error actualizando partido',
      error: err.message
    })
  }
}

// ======================================================
// BORRAR PARTIDO
// ======================================================

const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params

    const deleted = await Match.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({
        message: 'Partido no encontrado'
      })
    }

    res.status(200).json({
      message: 'Partido eliminado correctamente'
    })
  } catch (err) {
    console.error('Error eliminando partido:', err)

    res.status(500).json({
      message: 'Error eliminando partido',
      error: err.message
    })
  }
}

// ======================================================
// BORRAR RESULTADOS DE UNA JORNADA
// ======================================================

const clearJornadaResults = async (req, res) => {
  try {
    const jornada = Number(req.params.jornada)

    if (!Number.isInteger(jornada) || jornada < 1) {
      return res.status(400).json({
        message: 'Jornada no válida'
      })
    }

    const result = await Match.updateMany(
      {
        jornada
      },
      {
        $set: {
          golesLocal: null,
          golesVisitante: null
        }
      }
    )

    res.status(200).json({
      message: `Resultados de la jornada ${jornada} borrados`,
      modificados: result.modifiedCount
    })
  } catch (err) {
    console.error('Error borrando resultados de jornada:', err)

    res.status(500).json({
      message: 'Error borrando resultados',
      error: err.message
    })
  }
}

// ======================================================
// REINICIAR TODA LA LIGA
// ======================================================

const resetLeague = async (req, res) => {
  try {
    const result = await Match.updateMany(
      {},
      {
        $set: {
          golesLocal: null,
          golesVisitante: null
        }
      }
    )

    res.status(200).json({
      message: 'Liga reiniciada correctamente',
      modificados: result.modifiedCount
    })
  } catch (err) {
    console.error('Error reiniciando liga:', err)

    res.status(500).json({
      message: 'Error reiniciando liga',
      error: err.message
    })
  }
}

// ======================================================
// SINCRONIZAR CALENDARIO
// ======================================================

const syncCalendar = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    const calendario = req.body.calendario

    // ==================================================
    // COMPROBAR CALENDARIO
    // ==================================================

    if (!Array.isArray(calendario) || calendario.length !== 22) {
      return res.status(400).json({
        message: 'El calendario debe contener exactamente 22 jornadas'
      })
    }

    // ==================================================
    // NORMALIZAR EQUIPOS
    // ==================================================

    const normalizarEquipo = (nombre) => {
      if (!nombre) return nombre

      if (nombre === 'G  EMPRESAS AIRBUS' || nombre === 'G EMPRESAS AIRBUS') {
        return 'G.E AIRBUS'
      }

      return nombre
    }

    // ==================================================
    // CONVERTIR FECHA
    // 27-09-26 -> Date
    // ==================================================

    const convertirFecha = (fecha) => {
      if (!fecha) return null

      const partes = fecha.split('-')

      if (partes.length !== 3) {
        return null
      }

      const dia = Number(partes[0])
      const mes = Number(partes[1])
      const anio = Number(partes[2])

      if (
        !Number.isInteger(dia) ||
        !Number.isInteger(mes) ||
        !Number.isInteger(anio)
      ) {
        return null
      }

      return new Date(2000 + anio, mes - 1, dia)
    }

    // ==================================================
    // OBTENER PARTIDOS ANTIGUOS
    // ==================================================

    const partidosExistentes = await Match.find()
      .sort({
        updatedAt: -1,
        createdAt: -1
      })
      .lean()

    // ==================================================
    // CONSERVAR RESULTADOS VÁLIDOS
    //
    // Se utiliza LOCAL + VISITANTE como clave.
    //
    // No utilizamos la jornada porque algunos partidos
    // antiguos estaban guardados en jornadas diferentes.
    // ==================================================

    const resultadosValidos = new Map()

    for (const partido of partidosExistentes) {
      if (!partido.local || !partido.visitante) {
        continue
      }

      if (partido.golesLocal == null || partido.golesVisitante == null) {
        continue
      }

      const local = normalizarEquipo(partido.local)

      const visitante = normalizarEquipo(partido.visitante)

      // No conservar partidos de VILLABETIS
      if (local === 'VILLABETIS' || visitante === 'VILLABETIS') {
        continue
      }

      const key = `${local}|${visitante}`

      // Al estar ordenados por fecha de modificación,
      // conservamos el resultado más reciente.
      if (!resultadosValidos.has(key)) {
        resultadosValidos.set(key, {
          golesLocal: partido.golesLocal,
          golesVisitante: partido.golesVisitante
        })
      }
    }

    // ==================================================
    // CREAR NUEVO CALENDARIO
    // ==================================================

    const nuevosPartidos = []

    for (let i = 0; i < calendario.length; i++) {
      const jornada = i + 1

      const jornadaArray = calendario[i]

      // Buscar fecha de la jornada
      const fechaItem = jornadaArray.find((item) => item.fecha)

      const fecha = convertirFecha(fechaItem?.fecha)

      for (const partido of jornadaArray) {
        // Ignorar elemento de fecha
        if (partido.fecha) {
          continue
        }

        // Ignorar descanso
        if (partido.descansa) {
          continue
        }

        if (!partido.local || !partido.visitante) {
          continue
        }

        const local = normalizarEquipo(partido.local)

        const visitante = normalizarEquipo(partido.visitante)

        // Seguridad adicional
        if (local === 'VILLABETIS' || visitante === 'VILLABETIS') {
          continue
        }

        const key = `${local}|${visitante}`

        const resultado = resultadosValidos.get(key)

        nuevosPartidos.push({
          jornada,
          fecha,
          local,
          visitante,
          golesLocal: resultado?.golesLocal ?? null,
          golesVisitante: resultado?.golesVisitante ?? null
        })
      }
    }

    // ==================================================
    // COMPROBAR QUE HAY 110 PARTIDOS
    // ==================================================

    if (nuevosPartidos.length !== 110) {
      return res.status(400).json({
        message: 'El calendario generado no contiene exactamente 110 partidos',
        partidosGenerados: nuevosPartidos.length
      })
    }

    // ==================================================
    // COMPROBAR DUPLICADOS
    // ==================================================

    const claves = new Set()

    for (const partido of nuevosPartidos) {
      const key =
        `${partido.jornada}|` + `${partido.local}|` + `${partido.visitante}`

      if (claves.has(key)) {
        return res.status(400).json({
          message: 'Se ha detectado un partido duplicado en el calendario',
          partido
        })
      }

      claves.add(key)
    }

    // ==================================================
    // TRANSACCIÓN
    // ==================================================

    session.startTransaction()

    await Match.deleteMany(
      {},
      {
        session
      }
    )

    await Match.insertMany(nuevosPartidos, {
      session,
      ordered: true
    })

    await session.commitTransaction()

    // ==================================================
    // RESULTADOS CONSERVADOS
    // ==================================================

    const resultadosConservados = nuevosPartidos.filter(
      (partido) => partido.golesLocal != null && partido.golesVisitante != null
    ).length

    // ==================================================
    // RESPUESTA
    // ==================================================

    res.status(200).json({
      message: 'Calendario sincronizado correctamente',
      jornadas: calendario.length,
      partidos: nuevosPartidos.length,
      resultadosConservados
    })
  } catch (err) {
    console.error('Error sincronizando calendario:', err)

    try {
      await session.abortTransaction()
    } catch (abortError) {
      console.error('Error abortando la transacción:', abortError)
    }

    res.status(500).json({
      message: 'Error al sincronizar calendario',
      error: err.message
    })
  } finally {
    await session.endSession()
  }
}

// ======================================================
// EXPORTACIONES
// ======================================================

module.exports = {
  getAllMatches,
  getMatchesByJornada,
  createMatch,
  updateMatch,
  deleteMatch,
  clearJornadaResults,
  resetLeague,
  syncCalendar
}
