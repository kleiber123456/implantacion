// src/controllers/categoriaRepuestoController.js
const CategoriaRepuestoService = require('../services/categoriaRepuestoService');

const CategoriaRepuestoController = {
  async listar(req, res) {
    const categorias = await CategoriaRepuestoService.listar();
    res.json(categorias);
  },

  async obtener(req, res) {
    const categoria = await CategoriaRepuestoService.obtener(req.params.id);
    res.json(categoria);
  },

  async crear(req, res) {
    const id = await CategoriaRepuestoService.crear(req.body);
    res.json({ message: 'Categoría creada', id });
  },

  async actualizar(req, res) {
    await CategoriaRepuestoService.actualizar(req.params.id, req.body);
    res.json({ message: 'Categoría actualizada' });
  },

  async eliminar(req, res) {
    await CategoriaRepuestoService.eliminar(req.params.id);
    res.json({ message: 'Categoría eliminada' });
  },

  async cambiarEstado(req, res) {
    try {
      const nuevoEstado = await CategoriaRepuestoService.cambiarEstado(req.params.id);
      res.json({ message: `Estado actualizado a ${nuevoEstado}` });
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar el estado de la categoría' });
    }
  }
};

module.exports = CategoriaRepuestoController;