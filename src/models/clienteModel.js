const { pool, connect } = require("../config/db")

const ClienteModel = {
  findAll: async () => {
    const result = await pool.query(`
      SELECT c.*, u.correo, u.password, u.rol_id 
      FROM cliente c
      LEFT JOIN usuario u ON c.id = u.id
    `)
    return result.rows
  },

  findById: async (id) => {
    const result = await pool.query(
      `
      SELECT c.*, u.correo, u.password, u.rol_id 
      FROM cliente c
      LEFT JOIN usuario u ON c.id = u.id
      WHERE c.id = $1
    `,
      [id],
    )
    return result.rows[0]
  },

  findByDocumento: async (documento) => {
    const result = await pool.query("SELECT * FROM cliente WHERE documento = $1", [documento])
    return result.rows[0]
  },

  findByEmail: async (correo) => {
    const result = await pool.query(
      `
      SELECT c.* FROM cliente c
      JOIN usuario u ON c.id = u.id
      WHERE u.correo = $1
    `,
      [correo],
    )
    return result.rows[0]
  },

  create: async (data) => {
    const connection = await connect()
    await connection.beginTransaction()

    try {
      const { nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado, password } = data

      let clienteId

      if (data.id) {
        // Si viene con ID específico (desde usuario)
        clienteId = data.id
        await connection.query(
          "INSERT INTO cliente (id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
          [clienteId, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado || "Activo"],
        )
      } else {
        // Crear nuevo cliente independiente
        const result = await connection.query(
          "INSERT INTO cliente (nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
          [nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado || "Activo"],
        )
        clienteId = result.rows[0].id
      }

      // Verificar si ya existe usuario con este ID
      const usuarioExists = await connection.query("SELECT id FROM usuario WHERE id = $1", [clienteId])

      if (usuarioExists.rows.length === 0) {
        // Crear usuario correspondiente
        const hashedPassword = password
          ? require("bcryptjs").hashSync(password, 10)
          : require("bcryptjs").hashSync("123456", 10)

        await connection.query(
          "INSERT INTO usuario (id, nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
          [
            clienteId,
            nombre,
            apellido,
            correo,
            tipo_documento,
            documento,
            hashedPassword,
            2,
            telefono,
            direccion,
            estado || "Activo",
          ],
        )
      } else {
        // Actualizar usuario existente para que sea cliente
        await connection.query(
          "UPDATE usuario SET nombre = $1, apellido = $2, correo = $3, tipo_documento = $4, documento = $5, rol_id = $6, telefono = $7, direccion = $8, estado = $9 WHERE id = $10",
          [nombre, apellido, correo, tipo_documento, documento, 4, telefono, direccion, estado || "Activo", clienteId],
        )
      }

      await connection.commit()
      return clienteId
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  update: async (id, data) => {
    const connection = await connect()
    await connection.beginTransaction()

    try {
      const { nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado } = data

      // Actualizar cliente
      await connection.query(
        "UPDATE cliente SET nombre = $1, apellido = $2, direccion = $3, tipo_documento = $4, documento = $5, correo = $6, telefono = $7, estado = $8 WHERE id = $9",
        [nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado, id],
      )

      // Sincronizar con usuario
      const usuarioExists = await connection.query("SELECT id FROM usuario WHERE id = $1", [id])

      if (usuarioExists.rows.length > 0) {
        await connection.query(
          "UPDATE usuario SET nombre = $1, apellido = $2, correo = $3, tipo_documento = $4, documento = $5, telefono = $6, direccion = $7, estado = $8, rol_id = $9 WHERE id = $10",
          [nombre, apellido, correo, tipo_documento, documento, telefono, direccion, estado, 4, id],
        )
      } else {
        // Crear usuario si no existe
        const hashedPassword = require("bcryptjs").hashSync("123456", 10)
        await connection.query(
          "INSERT INTO usuario (id, nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
          [id, nombre, apellido, correo, tipo_documento, documento, hashedPassword, 4, telefono, direccion, estado],
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
    const connection = await connect()
    await connection.beginTransaction()

    try {
      // Eliminar cliente y usuario relacionado
      await connection.query("DELETE FROM cliente WHERE id = $1", [id])
      await connection.query("DELETE FROM usuario WHERE id = $1 AND rol_id = 4", [id])

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  cambiarEstado: async (id, estado) => {
    const connection = await connect()
    await connection.beginTransaction()

    try {
      // Cambiar estado en ambas tablas
      await connection.query("UPDATE cliente SET estado = $1 WHERE id = $2", [estado, id])
      await connection.query("UPDATE usuario SET estado = $1 WHERE id = $2 AND rol_id = 4", [estado, id])

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },
}

module.exports = ClienteModel
