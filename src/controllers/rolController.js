// src/controllers/rolController.js
const RolService = require('../services/rolService');

const RolController = {
  async listar(req, res) {
    const roles = await RolService.listar();
    res.json(roles);
  },

  async obtener(req, res) {
    const rol = await RolService.obtener(req.params.id);
    res.json(rol);
  },

  async crear(req, res) {
    await RolService.crear(req.body);
    res.json({ message: 'Rol creado' });
  },

  async actualizar(req, res) {
    await RolService.actualizar(req.params.id, req.body);
    res.json({ message: 'Rol actualizado' });
  },

  async eliminar(req, res) {
    await RolService.eliminar(req.params.id);
    res.json({ message: 'Rol eliminado' });
  }
};

module.exports = RolController;
