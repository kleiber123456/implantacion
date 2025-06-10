// src/services/usuarioService.js
const bcrypt = require("bcryptjs")
const UsuarioModel = require("../models/usuarioModel")
const db = require("../config/db")
const transporter = require("../config/nodemailer")

const UsuarioService = {
  listar: () => UsuarioModel.findAll(),
  obtener: (id) => UsuarioModel.findById(id),

  crear: async (data) => {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const hashed = await bcrypt.hash(data.password, 10)
      const rol = data.rol_id || 4 // rol cliente por defecto
      data.password = hashed

      // Crear usuario
      const [usuarioResult] = await connection.query(
        "INSERT INTO usuario (nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.nombre,
          data.apellido,
          data.correo,
          data.tipo_documento,
          data.documento,
          hashed,
          rol,
          data.telefono,
          data.direccion,
        ],
      )

      const usuarioId = usuarioResult.insertId

      if (rol === 4) {
        // Insertar cliente
        await connection.query(
          "INSERT INTO cliente (id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            usuarioId,
            data.nombre,
            data.apellido,
            data.direccion,
            data.tipo_documento,
            data.documento,
            data.correo,
            data.telefono,
            "Activo",
          ],
        )
      }

      if (rol === 3) {
        // Insertar mecánico con horario estándar
        const horarioId = 1 // Horario estándar (Lunes, pero trabajan todos los días)

        await connection.query(
          "INSERT INTO mecanico (id, nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado, horario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            usuarioId,
            data.nombre,
            data.apellido,
            data.tipo_documento,
            data.documento,
            data.direccion,
            data.telefono,
            data.telefono_emergencia || data.telefono,
            "Activo",
            horarioId,
          ],
        )
      }

      // Enviar correo de bienvenida
      await transporter.sendMail({
        to: data.correo,
        subject: `¡Bienvenido a la comunidad MotOrtega, ${data.nombre}! 🚀`,
        html: `
          <div style="background-color: #f9fafc; padding: 40px 0; font-family: 'Segoe UI', sans-serif;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <h1 style="color: #333333;">¡Hola, ${data.nombre}!</h1>
              <p style="color: #666666;">Gracias por unirte a nuestra comunidad en MotOrtega. Estamos emocionados de tenerte aquí.</p>
            </div>
          </div>
        `,
      })

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    }
  },
}

module.exports = UsuarioService
