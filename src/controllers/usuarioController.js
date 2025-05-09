// src/controllers/usuarioController.js
const UsuarioService = require('../services/usuarioService');

const UsuarioController = {
  async listar(req, res) {
    const usuarios = await UsuarioService.listar();
    res.json(usuarios);
  },

  async obtener(req, res) {
    const usuario = await UsuarioService.obtener(req.params.id);
    res.json(usuario);
  },

  async crear(req, res) {
    await UsuarioService.crear(req.body);
    res.json({ message: 'Usuario creado' });
  },

  async actualizar(req, res) {
    await UsuarioService.actualizar(req.params.id, req.body);
    res.json({ message: 'Usuario actualizado' });
  },

  async eliminar(req, res) {
    await UsuarioService.eliminar(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  }
};

module.exports = UsuarioController;
