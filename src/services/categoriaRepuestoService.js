// src/services/categoriaRepuestoService.js
const CategoriaRepuestoModel = require('../models/categoriaRepuestoModel');

const CategoriaRepuestoService = {
  listar: () => CategoriaRepuestoModel.findAll(),
  obtener: (id) => CategoriaRepuestoModel.findById(id),
  crear: (data) => CategoriaRepuestoModel.create(data),
  actualizar: (id, data) => CategoriaRepuestoModel.update(id, data),
  eliminar: (id) => CategoriaRepuestoModel.delete(id),

  cambiarEstado: async (id) => {
    const categoria = await CategoriaRepuestoModel.findById(id);
    if (!categoria) throw new Error('Categoría no encontrada');
    const nuevoEstado = categoria.estado === 'Activo' ? 'Inactivo' : 'Activo';
    await CategoriaRepuestoModel.cambiarEstado(id, nuevoEstado);
    return nuevoEstado;
  }
};

module.exports = CategoriaRepuestoService;