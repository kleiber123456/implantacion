// src/services/rolService.js
const RolModel = require('../models/rolModel');

const RolService = {
  listar: () => RolModel.findAll(),
  obtener: (id) => RolModel.findById(id),
  crear: (data) => RolModel.create(data),
  actualizar: (id, data) => RolModel.update(id, data),
  eliminar: (id) => RolModel.delete(id),

  cambiarEstado: async (id) => {
    const rol = await RolModel.findById(id)
    if (!rol) throw new Error("Rol no encontrado")

    const nuevoEstado = rol.estado === "Activo" ? "Inactivo" : "Activo"
    await RolModel.cambiarEstado(id, nuevoEstado)
    return nuevoEstado
  }
};

module.exports = RolService;
