// src/services/marcaService.js
const MarcaModel = require("../models/marcaModel")

const MarcaService = {
  listar: () => MarcaModel.findAll(),
  obtener: (id) => MarcaModel.findById(id),
  crear: (data) => MarcaModel.create(data),
  actualizar: (id, data) => MarcaModel.update(id, data),
  eliminar: (id) => MarcaModel.delete(id),
}

module.exports = MarcaService
