// src/services/compraService.js
const CompraModel = require("../models/compraModel")
const CompraPorRepuestoModel = require("../models/compraPorRepuestoModel")
const RepuestoModel = require("../models/repuestoModel")
const db = require("../config/db")

const CompraService = {
  listar: () => CompraModel.findAll(),

  obtener: async (id) => {
    const compra = await CompraModel.findById(id)
    if (compra) {
      compra.detalles = await CompraPorRepuestoModel.findByCompra(id)
    }
    return compra
  },

  crear: async (data) => {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const { proveedor_id, detalles, estado } = data

      // Crear la compra
      const compraId = await CompraModel.create({
        proveedor_id,
        fecha: new Date(),
        total: 0,
        estado: estado || "Pendiente",
      })

      let total = 0

      // Crear los detalles de la compra
      if (detalles && detalles.length > 0) {
        for (const detalle of detalles) {
          const { repuesto_id, cantidad } = detalle

          // Obtener el precio del repuesto
          const repuesto = await RepuestoModel.findById(repuesto_id)
          if (!repuesto) {
            throw new Error(`Repuesto con ID ${repuesto_id} no encontrado`)
          }

          const subtotal = cantidad * repuesto.preciounitario
          total += subtotal

          // Crear el detalle
          await CompraPorRepuestoModel.create({
            compras_id: compraId,
            repuesto_id,
            cantidad,
            subtotal,
          })

          // Actualizar el stock del repuesto
          const nuevaCantidad = repuesto.cantidad + cantidad
          const nuevoTotal = nuevaCantidad * repuesto.preciounitario

          await RepuestoModel.update(repuesto_id, {
            ...repuesto,
            cantidad: nuevaCantidad,
            total: nuevoTotal,
          })
        }
      }

      // Actualizar el total de la compra
      await CompraModel.update(compraId, {
        proveedor_id,
        fecha: new Date(),
        total,
        estado: estado || "Pendiente",
      })

      await connection.commit()
      return compraId
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  actualizar: async (id, data) => {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const { proveedor_id, detalles, estado } = data

      // Obtener la compra actual para revertir el stock
      const compraActual = await CompraModel.findById(id)
      const detallesActuales = await CompraPorRepuestoModel.findByCompra(id)

      // Revertir el stock de los detalles actuales
      for (const detalle of detallesActuales) {
        const repuesto = await RepuestoModel.findById(detalle.repuesto_id)
        if (repuesto) {
          const nuevaCantidad = repuesto.cantidad - detalle.cantidad
          const nuevoTotal = nuevaCantidad * repuesto.preciounitario

          await RepuestoModel.update(detalle.repuesto_id, {
            ...repuesto,
            cantidad: nuevaCantidad,
            total: nuevoTotal,
          })
        }
      }

      // Eliminar los detalles actuales
      await CompraPorRepuestoModel.deleteByCompra(id)

      let total = 0

      // Crear los nuevos detalles
      if (detalles && detalles.length > 0) {
        for (const detalle of detalles) {
          const { repuesto_id, cantidad } = detalle

          const repuesto = await RepuestoModel.findById(repuesto_id)
          if (!repuesto) {
            throw new Error(`Repuesto con ID ${repuesto_id} no encontrado`)
          }

          const subtotal = cantidad * repuesto.preciounitario
          total += subtotal

          await CompraPorRepuestoModel.create({
            compras_id: id,
            repuesto_id,
            cantidad,
            subtotal,
          })

          // Actualizar el stock del repuesto
          const nuevaCantidad = repuesto.cantidad + cantidad
          const nuevoTotal = nuevaCantidad * repuesto.preciounitario

          await RepuestoModel.update(repuesto_id, {
            ...repuesto,
            cantidad: nuevaCantidad,
            total: nuevoTotal,
          })
        }
      }

      // Actualizar la compra
      await CompraModel.update(id, {
        proveedor_id,
        fecha: compraActual.fecha,
        total,
        estado: estado || compraActual.estado,
      })

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  eliminar: async (id) => {
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // Obtener los detalles para revertir el stock
      const detalles = await CompraPorRepuestoModel.findByCompra(id)

      // Revertir el stock
      for (const detalle of detalles) {
        const repuesto = await RepuestoModel.findById(detalle.repuesto_id)
        if (repuesto) {
          const nuevaCantidad = repuesto.cantidad - detalle.cantidad
          const nuevoTotal = nuevaCantidad * repuesto.preciounitario

          await RepuestoModel.update(detalle.repuesto_id, {
            ...repuesto,
            cantidad: nuevaCantidad,
            total: nuevoTotal,
          })
        }
      }

      // Eliminar los detalles
      await CompraPorRepuestoModel.deleteByCompra(id)

      // Eliminar la compra
      await CompraModel.delete(id)

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },

  cambiarEstado: async (id) => {
    const compra = await CompraModel.findById(id)
    if (!compra) throw new Error("Compra no encontrada")

    let nuevoEstado
    switch (compra.estado) {
      case "Pendiente":
        nuevoEstado = "Completado"
        break
      case "Completado":
        nuevoEstado = "Cancelado"
        break
      case "Cancelado":
        nuevoEstado = "Pendiente"
        break
      default:
        nuevoEstado = "Pendiente"
    }

    await CompraModel.cambiarEstado(id, nuevoEstado)
    return nuevoEstado
  },
}

module.exports = CompraService
