// src/services/estadoVentaService.js
const EstadoVentaModel = require('../models/estadoVentaModel');

const EstadoVentaService = {
  listar: () => EstadoVentaModel.findAll(),
  
  obtener: (id) => EstadoVentaModel.findById(id),
  
  crear: async (data) => {
    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre del estado de venta es requerido');
    }
    return EstadoVentaModel.create(data);
  },
  
  actualizar: async (id, data) => {
    const estado = await EstadoVentaModel.findById(id);
    if (!estado) {
      throw new Error('Estado de venta no encontrado');
    }
    
    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre del estado de venta es requerido');
    }
    
    return EstadoVentaModel.update(id, data);
  },
  
  eliminar: async (id) => {
    const estado = await EstadoVentaModel.findById(id);
    if (!estado) {
      throw new Error('Estado de venta no encontrado');
    }
    return EstadoVentaModel.delete(id);
  }
};

module.exports = EstadoVentaService;
