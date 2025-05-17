// src/services/repuestoService.js
const RepuestoModel = require('../models/repuestoModel');

const RepuestoService = {
  listar: () => RepuestoModel.findAll(),
  obtener: (id) => RepuestoModel.findById(id),
  crear: (data) => RepuestoModel.create(data),
  actualizar: (id, data) => RepuestoModel.update(id, data),
  eliminar: (id) => RepuestoModel.delete(id)
};

module.exports = RepuestoService;