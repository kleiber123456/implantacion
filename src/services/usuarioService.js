// src/services/usuarioService.js
const UsuarioModel = require('../models/usuarioModel');

const UsuarioService = {
  listar: () => UsuarioModel.findAll(),
  obtener: (id) => UsuarioModel.findById(id),
  crear: (data) => UsuarioModel.create(data),
  actualizar: (id, data) => UsuarioModel.update(id, data),
  eliminar: (id) => UsuarioModel.delete(id)
};

module.exports = UsuarioService;
