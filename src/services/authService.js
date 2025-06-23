const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const UsuarioModel = require("../models/usuarioModel")
const transporter = require("../config/nodemailer")
const db = require("../config/db")

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6 dígitos
}

const AuthService = {
  async login({ correo, password }) {
    const usuario = await UsuarioModel.findByEmail(correo)
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      throw new Error("Credenciales inválidas")
    }
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol_id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    return { token: `${token}`, usuario }
  },

  async register(data) {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const hashed = await bcrypt.hash(data.password, 10)
      const rol = data.rol_id || 4 // Valor predeterminado: 2 (Cliente)

      // Insertar en usuario
      const [usuarioResult] = await connection.query(
        "INSERT INTO usuario (nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          "Activo",
        ],
      )

      const usuarioId = usuarioResult.insertId

      // Si el rol es de cliente (ID 2)
      if (rol === 4) {
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

      // Si el rol es de mecánico (ID 3)
      if (rol === 3) {
        await connection.query(
          "INSERT INTO mecanico (id, nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, correo, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            usuarioId,
            data.nombre,
            data.apellido,
            data.tipo_documento,
            data.documento,
            data.direccion,
            data.telefono,
            data.telefono_emergencia || data.telefono,
            data.correo,
            "Activo",
          ],
        )
      }

      // Enviar correo de bienvenida mejorado
      await transporter.sendMail({
        to: data.correo,
        subject: `¡Bienvenido a la comunidad MotOrtega, ${data.nombre}! 🚀`,
        html: `
          <div style="background-color: #f9fafc; padding: 40px 0; font-family: 'Segoe UI', sans-serif;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">
              <div style="background-color: #1f2937; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0;">MotOrtega</h1>
              </div>
              <div style="padding: 30px;">
                <h2 style="color: #111827;">¡Hola, ${data.nombre} ${data.apellido}!</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Estamos encantados de darte la bienvenida a <strong>MotOrtega</strong>. 🎉 Tu registro ha sido exitoso.
                </p>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Explora nuestra plataforma y descubre todo lo que tenemos para ofrecerte. ¡Estamos emocionados de tenerte a bordo!
                </p>
                <div style="text-align: center; margin-top: 30px;">
                  <a href="[ENLACE A TU PLATAFORMA]" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Explorar MotOrtega
                  </a>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                  Si tienes alguna pregunta, no dudes en contactarnos.
                </p>
              </div>
              <div style="background-color: #f3f4f6; text-align: center; padding: 20px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">MotOrtega © ${new Date().getFullYear()} | Todos los derechos reservados</p>
              </div>
            </div>
          </div>
        `,
      })

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  async solicitarCodigo(correo) {
    const usuario = await UsuarioModel.findByEmail(correo)
    if (!usuario) throw new Error("Correo no encontrado")

    const codigo = generarCodigo()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    await db.execute("INSERT INTO codigos (correo, codigo, expires_at) VALUES (?, ?, ?)", [correo, codigo, expiresAt])

    // Enviar correo de recuperación de contraseña mejorado
    await transporter.sendMail({
      to: correo,
      subject: "🔑 Solicitud de recuperación de contraseña para MotOrtega",
      html: `
        <div style="background-color: #f9fafc; padding: 40px 0; font-family: 'Segoe UI', sans-serif;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0;">MotOrtega</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #111827;">Código de recuperación de contraseña</h2>
              <p style="color: #4b5563; font-size: 16px;">
                Has solicitado recuperar la contraseña de tu cuenta en <strong>MotOrtega</strong>. Utiliza el siguiente código de verificación.
              </p>
              <p style="color: #4b5563; font-size: 16px;">
                Por favor, introduce este código en la pantalla de recuperación de contraseña. Recuerda que este código es válido por solo <strong>10 minutos</strong>.
              </p>
              <div style="font-size: 32px; font-weight: bold; text-align: center; margin: 20px 0; color: #2563eb;">
                ${codigo}
              </div>
              <p style="color: #dc2626; font-size: 14px;">
                Si no solicitaste este cambio de contraseña, por favor ignora este correo. Tu cuenta permanece segura.
              </p>
            </div>
            <div style="background-color: #f3f4f6; text-align: center; padding: 20px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">MotOrtega © ${new Date().getFullYear()} | Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      `,
    })
  },

  async verificarCodigo(correo, codigo) {
    const [rows] = await db.execute("SELECT * FROM codigos WHERE correo = ? AND codigo = ?", [correo, codigo])

    if (rows.length === 0) throw new Error("Código inválido o ya usado")

    const registro = rows[0]
    if (new Date() > new Date(registro.expires_at)) {
      throw new Error("El código ha expirado")
    }

    await db.execute("DELETE FROM codigos WHERE id = ?", [registro.id])
    return true
  },

  async actualizarPassword(correo, nuevaPassword) {
    const usuario = await UsuarioModel.findByEmail(correo)
    if (!usuario) throw new Error("Correo no encontrado")
    const hashed = await bcrypt.hash(nuevaPassword, 10)
    await UsuarioModel.updatePassword(usuario.id, hashed)
  },
}

module.exports = AuthService
