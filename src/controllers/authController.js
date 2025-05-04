const AuthService = require('../services/authService');

const AuthController = {
  async login(req, res) {
    try {
      const data = await AuthService.login(req.body);
      res.json(data);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  async register(req, res) {
    try {
      await AuthService.register(req.body);
      res.json({ message: 'Usuario registrado y correo enviado' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async solicitarCodigo(req, res) {
    try {
      await AuthService.solicitarCodigo(req.body.correo);
      res.json({ message: 'Código enviado al correo' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async verificarCodigo(req, res) {
    try {
      await AuthService.verificarCodigo(req.body.correo, req.body.codigo);
      res.json({ message: 'Código válido, puedes cambiar la contraseña' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async nuevaPassword(req, res) {
    try {
      const { correo, nuevaPassword } = req.body;
      await AuthService.actualizarPassword(correo, nuevaPassword);
      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = AuthController;
