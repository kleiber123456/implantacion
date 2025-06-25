// src/services/repuestoService.js
const RepuestoModel = require("../models/repuestoModel")

const RepuestoService = {
  listar: () => RepuestoModel.findAll(),

  obtener: (id) => RepuestoModel.findById(id),

  crear: (data) => {
    const { cantidad = 0, precio_venta = 0 } = data

    const total = cantidad * precio_venta
    const estado = data.estado || "Activo"

    const nuevoRepuesto = {
      ...data,
      total,
      estado,
    }

    return RepuestoModel.create(nuevoRepuesto)
  },

  cambiarEstado: async (id) => {
    const repuesto = await RepuestoModel.findById(id)
    if (!repuesto) throw new Error("Repuesto no encontrado")

    const nuevoEstado = repuesto.estado === "Activo" ? "Inactivo" : "Activo"
    await RepuestoModel.cambiarEstado(id, nuevoEstado)
    return nuevoEstado
  },

  actualizar: (id, data) => {
    const { cantidad = 0, precio_venta = 0 } = data

    const total = cantidad * precio_venta
    const estado = data.estado || "Activo"

    const repuestoActualizado = {
      ...data,
      total,
      estado,
    }

    return RepuestoModel.update(id, repuestoActualizado)
  },

  eliminar: (id) => RepuestoModel.delete(id),
}

module.exports = RepuestoService
