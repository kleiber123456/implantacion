// src/services/referenciaService.js
const ReferenciaModel = require("../models/referenciaModel")

const ReferenciaService = {
  listar: () => ReferenciaModel.findAll(),
  obtener: (id) => ReferenciaModel.findById(id),
  obtenerPorMarca: (marcaId) => ReferenciaModel.findByMarca(marcaId),
  crear: (data) => ReferenciaModel.create(data),
  actualizar: (id, data) => ReferenciaModel.update(id, data),
  eliminar: (id) => ReferenciaModel.delete(id),
}

module.exports = ReferenciaService
