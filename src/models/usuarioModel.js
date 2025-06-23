// src/models/usuarioModel.js
const db = require("../config/db")

const UsuarioModel = {
  async findAll() {
    const [rows] = await db.query(`
      SELECT u.*, r.nombre AS rol_nombre
      FROM usuario u
      JOIN rol r ON u.rol_id = r.id
    `)
    return rows
  },

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM usuario WHERE id = ?", [id])
    return rows[0]
  },

  async findByEmail(correo) {
    const [rows] = await db.query(
      `
      SELECT u.*, r.nombre AS rol
      FROM usuario u
      JOIN rol r ON u.rol_id = r.id
      WHERE u.correo = ?
    `,
      [correo],
    )
    return rows[0]
  },

  async create(usuario) {
    const { nombre, apellido, tipo_documento, documento, correo, password, rol_id, telefono, direccion } = usuario
    const [result] = await db.query(
      "INSERT INTO usuario (nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion],
    )
    return result.insertId
  },

  async update(id, usuario) {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const {
        nombre,
        apellido,
        tipo_documento,
        documento,
        correo,
        telefono,
        direccion,
        estado,
        rol_id,
        telefono_emergencia,
      } = usuario

      // Obtener datos actuales del usuario
      const [userData] = await connection.query("SELECT rol_id FROM usuario WHERE id = ?", [id])
      const rolActual = userData[0]?.rol_id

      // Actualizar usuario principal
      await connection.query(
        `UPDATE usuario SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, correo = ?, telefono = ?, direccion = ?, estado = ?, rol_id = ? WHERE id = ?`,
        [nombre, apellido, tipo_documento, documento, correo, telefono, direccion, estado, rol_id, id],
      )

      // Sincronizar con cliente si el rol actual o nuevo es cliente (rol_id = 2)
      if (rolActual === 2 || rol_id === 4) {
        const [clienteExists] = await connection.query("SELECT id FROM cliente WHERE id = ?", [id])

        if (clienteExists.length > 0) {
          // Actualizar cliente existente
          await connection.query(
            `UPDATE cliente SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, correo = ?, telefono = ?, direccion = ?, estado = ? WHERE id = ?`,
            [nombre, apellido, tipo_documento, documento, correo, telefono, direccion, estado, id],
          )
        } else if (rol_id === 4) {
          // Crear nuevo cliente
          await connection.query(
            `INSERT INTO cliente (id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado || "Activo"],
          )
        }
      }

      // Sincronizar con mecánico si el rol actual o nuevo es mecánico (rol_id = 3)
      if (rolActual === 3 || rol_id === 3) {
        const [mecanicoExists] = await connection.query("SELECT id FROM mecanico WHERE id = ?", [id])

        if (mecanicoExists.length > 0) {
          // Actualizar mecánico existente
          await connection.query(
            `UPDATE mecanico SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, telefono = ?, direccion = ?, correo = ?, estado = ?, telefono_emergencia = ? WHERE id = ?`,
            [
              nombre,
              apellido,
              tipo_documento,
              documento,
              telefono,
              direccion,
              correo,
              estado,
              telefono_emergencia || telefono,
              id,
            ],
          )
        } else if (rol_id === 3) {
          // Crear nuevo mecánico
          await connection.query(
            `INSERT INTO mecanico (id, nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, correo, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              nombre,
              apellido,
              tipo_documento,
              documento,
              direccion,
              telefono,
              telefono_emergencia || telefono,
              correo,
              estado || "Activo",
            ],
          )
        }
      }

      // Eliminar registros si cambió de rol
      if (rolActual !== rol_id) {
        if (rolActual === 4 && rol_id !== 4) {
          // Ya no es cliente, eliminar de tabla cliente
          await connection.query("DELETE FROM cliente WHERE id = ?", [id])
        }
        if (rolActual === 3 && rol_id !== 3) {
          // Ya no es mecánico, eliminar de tabla mecánico
          await connection.query("DELETE FROM mecanico WHERE id = ?", [id])
        }
      }

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  async delete(id) {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // Eliminar de todas las tablas relacionadas
      await connection.query("DELETE FROM cliente WHERE id = ?", [id])
      await connection.query("DELETE FROM mecanico WHERE id = ?", [id])
      await connection.query("DELETE FROM usuario WHERE id = ?", [id])

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  async updatePassword(id, password) {
    await db.query("UPDATE usuario SET password = ? WHERE id = ?", [password, id])
  },

  async cambiarEstado(id, estado) {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // Cambiar estado en todas las tablas relacionadas
      await connection.query("UPDATE usuario SET estado = ? WHERE id = ?", [estado, id])
      await connection.query("UPDATE cliente SET estado = ? WHERE id = ? AND id IN (SELECT id FROM cliente)", [
        estado,
        id,
      ])
      await connection.query("UPDATE mecanico SET estado = ? WHERE id = ? AND id IN (SELECT id FROM mecanico)", [
        estado,
        id,
      ])

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },
}

module.exports = UsuarioModel
