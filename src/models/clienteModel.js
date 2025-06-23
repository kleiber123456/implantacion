// src/models/clienteModel.js
const db = require("../config/db")

const ClienteModel = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT c.*, u.correo, u.password, u.rol_id 
      FROM cliente c
      LEFT JOIN usuario u ON c.id = u.id
    `)
    return rows
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `
      SELECT c.*, u.correo, u.password, u.rol_id 
      FROM cliente c
      LEFT JOIN usuario u ON c.id = u.id
      WHERE c.id = ?
    `,
      [id],
    )
    return rows[0]
  },

  findByDocumento: async (documento) => {
    const [rows] = await db.query("SELECT * FROM cliente WHERE documento = ?", [documento])
    return rows[0]
  },

  findByEmail: async (correo) => {
    const [rows] = await db.query(
      `
      SELECT c.* FROM cliente c
      JOIN usuario u ON c.id = u.id
      WHERE u.correo = ?
    `,
      [correo],
    )
    return rows[0]
  },

  create: async (data) => {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const { nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado, password } = data

      let clienteId

      if (data.id) {
        // Si viene con ID específico (desde usuario)
        clienteId = data.id
        await connection.query(
          "INSERT INTO cliente (id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [clienteId, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado || "Activo"],
        )
      } else {
        // Crear nuevo cliente independiente
        const [result] = await connection.query(
          "INSERT INTO cliente (nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado || "Activo"],
        )
        clienteId = result.insertId
      }

      // Verificar si ya existe usuario con este ID
      const [usuarioExists] = await connection.query("SELECT id FROM usuario WHERE id = ?", [clienteId])

      if (usuarioExists.length === 0) {
        // Crear usuario correspondiente
        const hashedPassword = password
          ? require("bcryptjs").hashSync(password, 10)
          : require("bcryptjs").hashSync("123456", 10)

        await connection.query(
          "INSERT INTO usuario (id, nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          "UPDATE usuario SET nombre = ?, apellido = ?, correo = ?, tipo_documento = ?, documento = ?, rol_id = ?, telefono = ?, direccion = ?, estado = ? WHERE id = ?",
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
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const { nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado } = data

      // Actualizar cliente
      await connection.query(
        "UPDATE cliente SET nombre = ?, apellido = ?, direccion = ?, tipo_documento = ?, documento = ?, correo = ?, telefono = ?, estado = ? WHERE id = ?",
        [nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado, id],
      )

      // Sincronizar con usuario
      const [usuarioExists] = await connection.query("SELECT id FROM usuario WHERE id = ?", [id])

      if (usuarioExists.length > 0) {
        await connection.query(
          "UPDATE usuario SET nombre = ?, apellido = ?, correo = ?, tipo_documento = ?, documento = ?, telefono = ?, direccion = ?, estado = ?, rol_id = ? WHERE id = ?",
          [nombre, apellido, correo, tipo_documento, documento, telefono, direccion, estado, 4, id],
        )
      } else {
        // Crear usuario si no existe
        const hashedPassword = require("bcryptjs").hashSync("123456", 10)
        await connection.query(
          "INSERT INTO usuario (id, nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // Eliminar cliente y usuario relacionado
      await connection.query("DELETE FROM cliente WHERE id = ?", [id])
      await connection.query("DELETE FROM usuario WHERE id = ? AND rol_id = 4", [id])

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
      await connection.query("UPDATE cliente SET estado = ? WHERE id = ?", [estado, id])
      await connection.query("UPDATE usuario SET estado = ? WHERE id = ? AND rol_id = 4", [estado, id])

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
