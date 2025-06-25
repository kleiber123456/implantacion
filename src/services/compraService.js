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
          const { repuesto_id, cantidad, precio_compra, porcentaje_ganancia } = detalle

          // Obtener el repuesto actual
          const repuesto = await RepuestoModel.findById(repuesto_id)
          if (!repuesto) {
            throw new Error(`Repuesto con ID ${repuesto_id} no encontrado`)
          }

          // Usar el precio de compra proporcionado o el precio actual
          const precioCompraFinal = precio_compra || repuesto.precio_compra || repuesto.precio_venta

          // Calcular precio de venta con porcentaje de ganancia
          const porcentaje = porcentaje_ganancia || 0
          const precioVentaFinal = precioCompraFinal * (1 + porcentaje / 100)

          const subtotal = cantidad * precioCompraFinal
          total += subtotal

          // Crear el detalle con ambos precios
          await CompraPorRepuestoModel.create({
            compras_id: compraId,
            repuesto_id,
            cantidad,
            precio_compra: precioCompraFinal,
            precio_venta: precioVentaFinal,
            subtotal,
          })

          // Solo actualizar el stock y precios si el estado es "Completado"
          if (estado === "Completado") {
            const nuevaCantidad = repuesto.cantidad + cantidad
            const nuevoTotal = nuevaCantidad * precioVentaFinal

            await RepuestoModel.update(repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              precio_venta: precioVentaFinal,
              precio_compra: precioCompraFinal,
              total: nuevoTotal,
            })
          }
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

      // Obtener la compra actual para verificar el estado
      const compraActual = await CompraModel.findById(id)
      const detallesActuales = await CompraPorRepuestoModel.findByCompra(id)

      // Si la compra estaba en estado "Completado", revertir el stock
      if (compraActual.estado === "Completado") {
        for (const detalle of detallesActuales) {
          const repuesto = await RepuestoModel.findById(detalle.repuesto_id)
          if (repuesto) {
            const nuevaCantidad = Math.max(0, repuesto.cantidad - detalle.cantidad)
            const nuevoTotal = nuevaCantidad * repuesto.precio_venta

            await RepuestoModel.update(detalle.repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              total: nuevoTotal,
            })
          }
        }
      }

      // Eliminar los detalles actuales
      await CompraPorRepuestoModel.deleteByCompra(id)

      let total = 0

      // Crear los nuevos detalles
      if (detalles && detalles.length > 0) {
        for (const detalle of detalles) {
          const { repuesto_id, cantidad, precio_compra, porcentaje_ganancia } = detalle

          const repuesto = await RepuestoModel.findById(repuesto_id)
          if (!repuesto) {
            throw new Error(`Repuesto con ID ${repuesto_id} no encontrado`)
          }

          const precioCompraFinal = precio_compra || repuesto.precio_compra || repuesto.precio_venta

          // Calcular precio de venta con porcentaje de ganancia
          const porcentaje = porcentaje_ganancia || 0
          const precioVentaFinal = precioCompraFinal * (1 + porcentaje / 100)

          const subtotal = cantidad * precioCompraFinal
          total += subtotal

          await CompraPorRepuestoModel.create({
            compras_id: id,
            repuesto_id,
            cantidad,
            precio_compra: precioCompraFinal,
            precio_venta: precioVentaFinal,
            subtotal,
          })

          // Solo actualizar el stock y precios si el nuevo estado es "Completado"
          if (estado === "Completado") {
            const nuevaCantidad = repuesto.cantidad + cantidad
            const nuevoTotal = nuevaCantidad * precioVentaFinal

            await RepuestoModel.update(repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              precio_venta: precioVentaFinal,
              precio_compra: precioCompraFinal,
              total: nuevoTotal,
            })
          }
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
      // Obtener la compra para verificar el estado
      const compra = await CompraModel.findById(id)

      // Solo revertir el stock si la compra estaba en estado "Completado"
      if (compra && compra.estado === "Completado") {
        const detalles = await CompraPorRepuestoModel.findByCompra(id)

        // Revertir el stock
        for (const detalle of detalles) {
          const repuesto = await RepuestoModel.findById(detalle.repuesto_id)
          if (repuesto) {
            const nuevaCantidad = Math.max(0, repuesto.cantidad - detalle.cantidad)
            const nuevoTotal = nuevaCantidad * repuesto.precio_venta

            await RepuestoModel.update(detalle.repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              total: nuevoTotal,
            })
          }
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
    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      const compra = await CompraModel.findById(id)
      if (!compra) throw new Error("Compra no encontrada")

      let nuevoEstado

      // Lógica de cambio de estado más clara y específica
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

      console.log(`Cambiando estado de ${compra.estado} a ${nuevoEstado}`)

      // Si cambia de Pendiente a Completado, actualizar el stock y precios
      if (compra.estado === "Pendiente" && nuevoEstado === "Completado") {
        const detalles = await CompraPorRepuestoModel.findByCompra(id)

        for (const detalle of detalles) {
          const repuesto = await RepuestoModel.findById(detalle.repuesto_id)
          if (repuesto) {
            const nuevaCantidad = repuesto.cantidad + detalle.cantidad
            const precioCompra = detalle.precio_compra || repuesto.precio_compra
            const precioVenta = detalle.precio_venta || repuesto.precio_venta
            const nuevoTotal = nuevaCantidad * precioVenta

            await RepuestoModel.update(detalle.repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              precio_venta: precioVenta,
              precio_compra: precioCompra,
              total: nuevoTotal,
            })
          }
        }
      }

      // Si cambia de Completado a Cancelado, revertir el stock pero mantener los precios
      else if (compra.estado === "Completado" && nuevoEstado === "Cancelado") {
        const detalles = await CompraPorRepuestoModel.findByCompra(id)

        for (const detalle of detalles) {
          const repuesto = await RepuestoModel.findById(detalle.repuesto_id)
          if (repuesto) {
            const nuevaCantidad = Math.max(0, repuesto.cantidad - detalle.cantidad)
            const nuevoTotal = nuevaCantidad * repuesto.precio_venta

            await RepuestoModel.update(detalle.repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              total: nuevoTotal,
              // Mantener precio_compra y precio_venta sin cambios
            })
          }
        }
      }

      // Si cambia de Cancelado a Pendiente, no hacer nada con el stock
      // Solo cambiar el estado

      await CompraModel.cambiarEstado(id, nuevoEstado)
      await connection.commit()

      console.log(`Estado cambiado exitosamente a: ${nuevoEstado}`)
      return nuevoEstado
    } catch (error) {
      await connection.rollback()
      console.error("Error al cambiar estado:", error)
      throw error
    } finally {
      connection.release()
    }
  },
}

module.exports = CompraService
