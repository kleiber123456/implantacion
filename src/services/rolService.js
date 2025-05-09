// src/services/rolService.js
const RolModel = require('../models/rolModel');

const RolService = {
  listar: () => RolModel.findAll(),
  obtener: (id) => RolModel.findById(id),
  crear: (data) => RolModel.create(data),
  actualizar: (id, data) => RolModel.update(id, data),
  eliminar: (id) => RolModel.delete(id)
};

module.exports = RolService;
