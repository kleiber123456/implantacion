// src/services/estadoCitaService.js
const EstadoCitaModel = require('../models/estadoCitaModel');

const EstadoCitaService = {
  listar: () => EstadoCitaModel.findAll(),
  
  obtener: (id) => EstadoCitaModel.findById(id),
  
  crear: async (data) => {
    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre del estado de cita es requerido');
    }
    return EstadoCitaModel.create(data);
  },
  
  actualizar: async (id, data) => {
    const estado = await EstadoCitaModel.findById(id);
    if (!estado) {
      throw new Error('Estado de cita no encontrado');
    }
    
    if (!data.nombre || data.nombre.trim() === '') {
      throw new Error('El nombre del estado de cita es requerido');
    }
    
    return EstadoCitaModel.update(id, data);
  },
  
  eliminar: async (id) => {
    const estado = await EstadoCitaModel.findById(id);
    if (!estado) {
      throw new Error('Estado de cita no encontrado');
    }
    return EstadoCitaModel.delete(id);
  }
};

module.exports = EstadoCitaService;
