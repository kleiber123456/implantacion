const RepuestoService = require('../services/repuestoService');

const RepuestoController = {
  async listar(req, res) {
    try {
      const repuestos = await RepuestoService.listar();
      res.json(repuestos);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar los repuestos' });
    }
  },

  async obtener(req, res) {
    try {
      const repuesto = await RepuestoService.obtener(req.params.id);
      if (!repuesto) {
        return res.status(404).json({ error: 'Repuesto no encontrado' });
      }
      res.json(repuesto);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el repuesto' });
    }
  },

  async crear(req, res) {
    try {
      const id = await RepuestoService.crear(req.body);
      res.status(201).json({ message: 'Repuesto creado', id });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el repuesto' });
    }
  },

  async actualizar(req, res) {
    try {
      await RepuestoService.actualizar(req.params.id, req.body);
      res.json({ message: 'Repuesto actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el repuesto' });
    }
  },

  async cambiarEstado(req, res) {
  try {
    const nuevoEstado = await RepuestoService.cambiarEstado(req.params.id);
    res.json({ message: `Estado actualizado a ${nuevoEstado}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  },


  async eliminar(req, res) {
    try {
      await RepuestoService.eliminar(req.params.id);
      res.json({ message: 'Repuesto eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el repuesto' });
    }
  }
};

module.exports = RepuestoController;
