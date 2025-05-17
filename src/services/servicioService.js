// src/services/servicioService.js
const ServicioModel = require('../models/servicioModel');

const ServicioService = {
  listar: () => ServicioModel.findAll(),
  obtener: (id) => ServicioModel.findById(id),
  crear: (data) => ServicioModel.create(data),
  actualizar: (id, data) => ServicioModel.update(id, data),
  eliminar: (id) => ServicioModel.delete(id),

  cambiarEstado: async (id) => {
    const servicio = await ServicioModel.findById(id);
    if (!servicio) throw new Error('Servicio no encontrado');
    const nuevoEstado = servicio.estado === 'Activo' ? 'Inactivo' : 'Activo';
    await ServicioModel.cambiarEstado(id, nuevoEstado);
    return nuevoEstado;
  }
};

module.exports = ServicioService;