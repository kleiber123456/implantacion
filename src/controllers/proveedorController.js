// src/controllers/proveedorController.js
const ProveedorService = require('../services/proveedorService');

const ProveedorController = {
  async listar(req, res) {
    const proveedores = await ProveedorService.listar();
    res.json(proveedores);
  },

  async obtener(req, res) {
    const proveedor = await ProveedorService.obtener(req.params.id);
    res.json(proveedor);
  },

  async crear(req, res) {
    const id = await ProveedorService.crear(req.body);
    res.json({ message: 'Proveedor creado', id });
  },

  async actualizar(req, res) {
    await ProveedorService.actualizar(req.params.id, req.body);
    res.json({ message: 'Proveedor actualizado' });
  },

  async eliminar(req, res) {
    await ProveedorService.eliminar(req.params.id);
    res.json({ message: 'Proveedor eliminado' });
  },

  async cambiarEstado(req, res) {
  try {
    const nuevoEstado = await ProveedorService.cambiarEstado(req.params.id);
    res.json({ message: `Estado actualizado a ${nuevoEstado}` });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar el estado del proveedor' });
  }
}

};

module.exports = ProveedorController;
