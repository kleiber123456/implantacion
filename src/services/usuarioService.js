// src/services/usuarioService.js
const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');
const db = require('../config/db');
const transporter = require('../config/nodemailer');

const UsuarioService = {
  listar: () => UsuarioModel.findAll(),
  obtener: (id) => UsuarioModel.findById(id),

  crear: async (data) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const hashed = await bcrypt.hash(data.password, 10);
      const rol = data.rol_id || 4; // rol cliente por defecto
      data.password = hashed;

      // Crear usuario
      const [usuarioResult] = await connection.query(
        'INSERT INTO usuario (nombre, apellido, correo, tipo_documento, documento, password, rol_id, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [data.nombre, data.apellido, data.correo, data.tipo_documento, data.documento, hashed, rol, data.telefono, data.direccion]
      );

      const usuarioId = usuarioResult.insertId;

      if (rol === 4) {
        // Insertar cliente
        await connection.query(
          'INSERT INTO cliente (id, nombre, apellido, direccion, tipo_documento, documento, correo, telefono, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [usuarioId, data.nombre, data.apellido, data.direccion, data.tipo_documento, data.documento, data.correo, data.telefono, 'Activo']
        );
      }

      if (rol === 3) {
        // Insertar mecánico
        const [horarioResult] = await connection.query(
          'INSERT INTO horario (fecha, hora_inicio, hora_fin) VALUES (CURDATE(), "08:00:00", "17:00:00")'
        );
        const horarioId = horarioResult.insertId;

        await connection.query(
          'INSERT INTO mecanico (id, nombre, apellido, tipo_documento, documento, direccion, telefono, telefono_emergencia, estado, horario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            usuarioId,
            data.nombre,
            data.apellido,
            data.tipo_documento,
            data.documento,
            data.direccion,
            data.telefono,
            data.telefono_emergencia || data.telefono,
            'Activo',
            horarioId
          ]
        );
      }

      // Enviar correo de bienvenida
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
                  Si tienes alguna pregunta, no dudes en visitar nuestra <a href="[ENLACE A TU SECCIÓN DE AYUDA]" style="color: #2563eb;">sección de ayuda</a>.
                </p>
              </div>
              <div style="background-color: #f3f4f6; text-align: center; padding: 20px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">MotOrtega © ${new Date().getFullYear()} | Todos los derechos reservados</p>
              </div>
            </div>
          </div>
        `
      });

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  actualizar: (id, data) => UsuarioModel.update(id, data),
  eliminar: (id) => UsuarioModel.delete(id)
};

module.exports = UsuarioService;

