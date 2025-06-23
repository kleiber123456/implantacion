// src/models/mecanicoModel.js
const db = require("../config/db")

const MecanicoModel = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT m.*, u.correo, u.password, u.rol_id 
      FROM mecanico m
      LEFT JOIN usuario u ON m.id = u.id
    `)
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT m.*, u.correo, u.password, u.rol_id 
      FROM mecanico m
      LEFT JOIN usuario u ON m.id = u.id
      WHERE m.id = ?
    `,
      [id],
    )
    return rows[0]
  },

  findByEstado: async (estado) => {
    const [rows] = await db.query(
      `
      SELECT m.*, u.correo, u.password, u.rol_id 
      FROM mecanico m
      LEFT JOIN usuario u ON m.id = u.id
      WHERE m.estado = ?
    `,
      [estado],
    )
    return rows
  },

  create: async (data) => {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const {
        nombre,
        apellido,
        tipo_documento,
        documento,
        direccion,
        telefono,
        telefono_emergencia,
        correo,
        estado,
        password,
      } = data

      let mecanicoId

      if (data.id) {
        // Si viene con ID específico (desde usuario)
        mecanicoId = data.id
        await connection.query(
          "INSERT INTO mecanico (id, nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, correo, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            mecanicoId,
            nombre,
            apellido,
            tipo_documento,
            documento,
            direccion,
            telefono,
            telefono_emergencia,
            correo,
            estado || "Activo",
          ],
        )
      } else {
        // Crear nuevo mecánico independiente
        const [result] = await connection.query(
          "INSERT INTO mecanico (nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, correo, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            nombre,
            apellido,
            tipo_documento,
            documento,
            direccion,
            telefono,
            telefono_emergencia,
            correo,
            estado || "Activo",
          ],
        )
        mecanicoId = result.insertId
      }

      // Verificar si ya existe usuario con este ID
      const [usuarioExists] = await connection.query("SELECT id FROM usuario WHERE id = ?", [mecanicoId])

      if (usuarioExists.length === 0) {
        // Crear usuario correspondiente
        const hashedPassword = password
          ? require("bcryptjs").hashSync(password, 10)
          : require("bcryptjs").hashSync("123456", 10)

        await connection.query(
          "INSERT INTO usuario (id, nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            mecanicoId,
            nombre,
            apellido,
            correo,
            tipo_documento,
            documento,
            hashedPassword,
            3,
            telefono,
            direccion,
            estado || "Activo",
          ],
        )
      } else {
        // Actualizar usuario existente para que sea mecánico
        await connection.query(
          "UPDATE usuario SET nombre = ?, apellido = ?, correo = ?, tipo_documento = ?, documento = ?, rol_id = ?, telefono = ?, direccion = ?, estado = ? WHERE id = ?",
          [nombre, apellido, correo, tipo_documento, documento, 3, telefono, direccion, estado || "Activo", mecanicoId],
        )
      }

      await connection.commit()
      return mecanicoId
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  update: async (id, data) => {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const { nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, correo, estado } =
        data

      // Actualizar mecánico
      await connection.query(
        "UPDATE mecanico SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, direccion = ?, telefono = ?, telefono_emergencia = ?, correo = ?, estado = ? WHERE id = ?",
        [nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, correo, estado, id],
      )

      // Sincronizar con usuario
      const [usuarioExists] = await connection.query("SELECT id FROM usuario WHERE id = ?", [id])

      if (usuarioExists.length > 0) {
        await connection.query(
          "UPDATE usuario SET nombre = ?, apellido = ?, correo = ?, tipo_documento = ?, documento = ?, telefono = ?, direccion = ?, estado = ?, rol_id = ? WHERE id = ?",
          [nombre, apellido, correo, tipo_documento, documento, telefono, direccion, estado, 3, id],
        )
      } else {
        // Crear usuario si no existe
        const hashedPassword = require("bcryptjs").hashSync("123456", 10)
        await connection.query(
          "INSERT INTO usuario (id, nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [id, nombre, apellido, correo, tipo_documento, documento, hashedPassword, 3, telefono, direccion, estado],
        )
      }

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  delete: async (id) => {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // Eliminar mecánico y usuario relacionado
      await connection.query("DELETE FROM mecanico WHERE id = ?", [id])
      await connection.query("DELETE FROM usuario WHERE id = ? AND rol_id = 3", [id])

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  cambiarEstado: async (id, estado) => {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // Cambiar estado en ambas tablas
      await connection.query("UPDATE mecanico SET estado = ? WHERE id = ?", [estado, id])
      await connection.query("UPDATE usuario SET estado = ? WHERE id = ? AND rol_id = 3", [estado, id])

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  // Obtener las citas asignadas a un mecánico
  getCitasByMecanico: async (mecanicoId) => {
    const [rows] = await db.query(
      `
      SELECT c.*, 
             ec.nombre AS estado_nombre,
             v.placa AS vehiculo_placa,
             cl.nombre AS cliente_nombre,
             cl.apellido AS cliente_apellido
      FROM cita c
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      JOIN vehiculo v ON c.vehiculo_id = v.id
      JOIN cliente cl ON v.cliente_id = cl.id
      WHERE c.mecanico_id = ?
      ORDER BY c.fecha DESC, c.hora
    `,
      [mecanicoId],
    )
    return rows
  },

  // Obtener estadísticas del mecánico
  getEstadisticasByMecanico: async (mecanicoId) => {
    const [rows] = await db.query(
      `
      SELECT 
        COUNT(*) as total_citas,
        COUNT(CASE WHEN ec.nombre = 'Completada' THEN 1 END) as citas_completadas,
        COUNT(CASE WHEN ec.nombre = 'Pendiente' THEN 1 END) as citas_pendientes,
        COUNT(CASE WHEN ec.nombre = 'Cancelada' THEN 1 END) as citas_canceladas
      FROM cita c
      JOIN estado_cita ec ON c.estado_cita_id = ec.id
      WHERE c.mecanico_id = ?
    `,
      [mecanicoId],
    )
    return rows[0]
  },
}

module.exports = MecanicoModel
