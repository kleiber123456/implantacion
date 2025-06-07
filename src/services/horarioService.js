// src/services/horarioService.js
const HorarioModel = require('../models/horarioModel');

const HorarioService = {
  listar: () => HorarioModel.findAll(),
  
  obtener: (id) => HorarioModel.findById(id),
  
  obtenerPorFecha: (fecha) => HorarioModel.findByFecha(fecha),
  
  obtenerPorRangoFechas: (fechaInicio, fechaFin) => HorarioModel.findByDateRange(fechaInicio, fechaFin),
  
  crear: async (data) => {
    const { fecha, hora_inicio, hora_fin } = data;
    
    // Validaciones
    if (!fecha || !hora_inicio || !hora_fin) {
      throw new Error('Fecha, hora de inicio y hora de fin son requeridas');
    }
    
    // Validar que la hora de inicio sea menor que la hora de fin
    if (hora_inicio >= hora_fin) {
      throw new Error('La hora de inicio debe ser menor que la hora de fin');
    }
    
    // Validar que la fecha no sea anterior a hoy
    const hoy = new Date();
    const fechaHorario = new Date(fecha);
    if (fechaHorario < hoy.setHours(0, 0, 0, 0)) {
      throw new Error('No se puede crear un horario para una fecha pasada');
    }
    
    return HorarioModel.create(data);
  },
  
  actualizar: async (id, data) => {
    const horario = await HorarioModel.findById(id);
    if (!horario) {
      throw new Error('Horario no encontrado');
    }
    
    const { fecha, hora_inicio, hora_fin } = data;
    
    // Validaciones
    if (!fecha || !hora_inicio || !hora_fin) {
      throw new Error('Fecha, hora de inicio y hora de fin son requeridas');
    }
    
    if (hora_inicio >= hora_fin) {
      throw new Error('La hora de inicio debe ser menor que la hora de fin');
    }
    
    return HorarioModel.update(id, data);
  },
  
  eliminar: async (id) => {
    const horario = await HorarioModel.findById(id);
    if (!horario) {
      throw new Error('Horario no encontrado');
    }
    return HorarioModel.delete(id);
  }
};

module.exports = HorarioService;
