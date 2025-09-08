// src/models/usuarioModel.js
const { pool } = require("../config/db")

const UsuarioModel = {
  async findAll() {
    const query = `
      SELECT u.*, r.nombre AS rol_nombre
      FROM usuario u
      JOIN rol r ON u.rol_id = r.id
    `
    const result = await pool.query(query)
    return result.rows
  },

  async findById(id) {
    const query = "SELECT * FROM usuario WHERE id = $1"
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  },

  async findByEmail(correo) {
    const query = `
      SELECT u.*, r.nombre AS rol
      FROM usuario u
      JOIN rol r ON u.rol_id = r.id
      WHERE u.correo = $1
    `
    const result = await pool.query(query, [correo])
    return result.rows[0] || null
  },

  async create(usuario) {
    const { nombre, apellido, tipo_documento, documento, correo, password, rol_id, telefono, direccion } = usuario

    const query = `
      INSERT INTO usuario (nombre, apellido, tipo_documento, documento, correo, password, rol_id, telefono, direccion)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
    `
    const values = [nombre, apellido, tipo_documento, documento, correo, password, rol_id, telefono, direccion]
    const result = await pool.query(query, values)
    return result.rows[0].id
  },

  async update(id, usuario) {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

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
      const userData = await client.query("SELECT rol_id FROM usuario WHERE id = $1", [id])
      const rolActual = userData.rows[0]?.rol_id

      // Actualizar usuario principal
      await client.query(
        `UPDATE usuario 
         SET nombre=$1, apellido=$2, tipo_documento=$3, documento=$4, correo=$5, telefono=$6, direccion=$7, estado=$8, rol_id=$9 
         WHERE id=$10`,
        [nombre, apellido, tipo_documento, documento, correo, telefono, direccion, estado, rol_id, id],
      )

      // Cliente (rol_id = 4)
      if (rolActual === 4 || rol_id === 4) {
        const clienteExists = await client.query("SELECT id FROM cliente WHERE id = $1", [id])
        if (clienteExists.rows.length > 0) {
          await client.query(
            `UPDATE cliente 
             SET nombre=$1, apellido=$2, tipo_documento=$3, documento=$4, correo=$5, telefono=$6, direccion=$7, estado=$8 
             WHERE id=$9`,
            [nombre, apellido, tipo_documento, documento, correo, telefono, direccion, estado, id],
          )
        } else if (rol_id === 4) {
          await client.query(
            `INSERT INTO cliente (id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado || "Activo"],
          )
        }
      }

      // Mecánico (rol_id = 3)
      if (rolActual === 3 || rol_id === 3) {
        const mecanicoExists = await client.query("SELECT id FROM mecanico WHERE id = $1", [id])
        if (mecanicoExists.rows.length > 0) {
          await client.query(
            `UPDATE mecanico 
             SET nombre=$1, apellido=$2, tipo_documento=$3, documento=$4, telefono=$5, direccion=$6, correo=$7, estado=$8, telefono_emergencia=$9 
             WHERE id=$10`,
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
          await client.query(
            `INSERT INTO mecanico (id, nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, correo, estado)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
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
          await client.query("DELETE FROM cliente WHERE id = $1", [id])
        }
        if (rolActual === 3 && rol_id !== 3) {
          await client.query("DELETE FROM mecanico WHERE id = $1", [id])
        }
      }

      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  },

  async delete(id) {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      await client.query("DELETE FROM cliente WHERE id = $1", [id])
      await client.query("DELETE FROM mecanico WHERE id = $1", [id])
      await client.query("DELETE FROM usuario WHERE id = $1", [id])

      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  },

  async updatePassword(id, password) {
    await pool.query("UPDATE usuario SET password = $1 WHERE id = $2", [password, id])
  },

  async cambiarEstado(id, estado) {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      await client.query("UPDATE usuario SET estado = $1 WHERE id = $2", [estado, id])
      await client.query("UPDATE cliente SET estado = $1 WHERE id = $2", [estado, id])
      await client.query("UPDATE mecanico SET estado = $1 WHERE id = $2", [estado, id])

      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  },
}

module.exports = UsuarioModel
