const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = {
  async sendWelcomeEmail(to, name, correo) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Bienvenido',
      text: `Hola ${name}, bienvenido a nuestro sistema de MotOrtega.`
    });
  },

  async sendPasswordReset(to, token) {
    const resetLink = `http://localhost:3000/api/auth/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.correo,
      subject: 'Recuperar contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`
    });
  }
};
