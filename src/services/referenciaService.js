// src/services/referenciaService.js
const ReferenciaModel = require("../models/referenciaModel")

const ReferenciaService = {
  listar: () => ReferenciaModel.findAll(),

  obtener: (id) => ReferenciaModel.findById(id),

  obtenerPorMarca: (marcaId) => ReferenciaModel.findByMarca(marcaId),

  crear: async (data) => {
    // Validar que el tipo_vehiculo sea válido si se proporciona
    if (data.tipo_vehiculo && !["Carro", "Moto", "Camioneta"].includes(data.tipo_vehiculo)) {
      throw new Error("El tipo de vehículo debe ser 'Carro', 'Moto' o 'Camioneta'")
    }

    return ReferenciaModel.create(data)
  },

  actualizar: async (id, data) => {
    // Validar que el tipo_vehiculo sea válido si se proporciona
    if (data.tipo_vehiculo && !["Carro", "Moto", "Camioneta"].includes(data.tipo_vehiculo)) {
      throw new Error("El tipo de vehículo debe ser 'Carro', 'Moto' o 'Camioneta'")
    }

    return ReferenciaModel.update(id, data)
  },

  eliminar: (id) => ReferenciaModel.delete(id),
}

module.exports = ReferenciaService
