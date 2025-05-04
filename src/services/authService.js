const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');
const transporter = require('../config/nodemailer');
const db = require('../config/db');

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

const AuthService = {
  async login({ correo, password }) {
    const usuario = await UsuarioModel.findByEmail(correo);
    if (!usuario || !await bcrypt.compare(password, usuario.password)) {
      throw new Error('Credenciales inválidas');
    }
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.Rol_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    return { token, usuario };
  },

  async register(data) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const hashed = await bcrypt.hash(data.password, 10);
      const rol = data.rol_id || 4;

      // Insertar en 
      const [usuarioResult] = await connection.query(
        'INSERT INTO Usuario (Nombre,  apellido, Correo, Password, rol_id ) VALUES (?, ?, ?, ?, ?)',
        [data.nombre, data.apellido, data.correo, hashed, rol]
      );


      // Enviar correo
      await transporter.sendMail({
        to: data.correo,
        subject: 'Bienvenido a MotOrtega',
        html: `<h3>Hola ${data.nombre}</h3><p>Tu registro fue exitoso.</p>`
      });

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async solicitarCodigo(correo) {
    const usuario = await UsuarioModel.findByEmail(correo);
    if (!usuario) throw new Error('Correo no encontrado');

    const codigo = generarCodigo();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    await db.execute(
      "INSERT INTO codigos (correo, codigo, expires_at) VALUES (?, ?, ?)",
      [correo, codigo, expiresAt]
    );

    await transporter.sendMail({
      to: correo,
      subject: 'Código de recuperación de contraseña',
      html: `<p>Tu código de recuperación es: <strong>${codigo}</strong>. Expira en 10 minutos.</p>`
    });
  },

  async verificarCodigo(correo, codigo) {
    const [rows] = await db.execute(
      "SELECT * FROM codigos WHERE correo = ? AND codigo = ?",
      [correo, codigo]
    );

    if (rows.length === 0) throw new Error("Código inválido o ya usado");

    const registro = rows[0];
    if (new Date() > new Date(registro.expires_at)) {
      throw new Error("El código ha expirado");
    }

    await db.execute("DELETE FROM codigos WHERE id = ?", [registro.id]);
    return true;
  },

  async actualizarPassword(correo, nuevaPassword) {
    const usuario = await UsuarioModel.findByEmail(correo);
    if (!usuario) throw new Error('Correo no encontrado');
    const hashed = await bcrypt.hash(nuevaPassword, 10);
    await UsuarioModel.updatePassword(usuario.id, hashed);
  }
};

module.exports = AuthService;
