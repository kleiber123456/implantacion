// src/services/mecanicoService.js
const MecanicoModel = require('../models/mecanicoModel');
const HorarioModel = require('../models/horarioModel');

const MecanicoService = {
  listar: () => MecanicoModel.findAll(),
  
  obtener: (id) => MecanicoModel.findById(id),
  
  obtenerPorEstado: (estado) => MecanicoModel.findByEstado(estado),
  
  crear: async (data) => {
    const { nombre, apellido, tipo_documento, documento, telefono } = data;
    
    // Validaciones básicas
    if (!nombre || !apellido || !tipo_documento || !documento || !telefono) {
      throw new Error('Nombre, apellido, tipo de documento, documento y teléfono son requeridos');
    }
    
    // Verificar si ya existe un mecánico con el mismo documento
    const mecanicoExistente = await MecanicoModel.findByDocumento(documento);
    if (mecanicoExistente) {
      throw new Error('Ya existe un mecánico con este documento');
    }
    
    // Si no se proporciona horario_id, crear uno por defecto
    let horarioId = data.horario_id;
    if (!horarioId) {
      horarioId = await HorarioModel.create({
        fecha: new Date(),
        hora_inicio: '08:00:00',
        hora_fin: '17:00:00'
      });
    }
    
    const mecanicoData = {
      ...data,
      horario_id: horarioId,
      telefono_emergencia: data.telefono_emergencia || data.telefono
    };
    
    return MecanicoModel.create(mecanicoData);
  },
  
  actualizar: async (id, data) => {
    const mecanico = await MecanicoModel.findById(id);
    if (!mecanico) {
      throw new Error('Mecánico no encontrado');
    }
    
    // Verificar si hay otro mecánico con el mismo documento (que no sea este)
    if (data.documento) {
      const mecanicoExistente = await MecanicoModel.findByDocumento(data.documento);
      if (mecanicoExistente && mecanicoExistente.id !== parseInt(id)) {
        throw new Error('Ya existe otro mecánico con este documento');
      }
    }
    
    return MecanicoModel.update(id, data);
  },
  
  eliminar: async (id) => {
    const mecanico = await MecanicoModel.findById(id);
    if (!mecanico) {
      throw new Error('Mecánico no encontrado');
    }
    return MecanicoModel.delete(id);
  },
  
  cambiarEstado: async (id) => {
    const mecanico = await MecanicoModel.findById(id);
    if (!mecanico) {
      throw new Error('Mecánico no encontrado');
    }
    
    const nuevoEstado = mecanico.estado === 'Activo' ? 'Inactivo' : 'Activo';
    await MecanicoModel.cambiarEstado(id, nuevoEstado);
    return nuevoEstado;
  }
};

module.exports = MecanicoService;
