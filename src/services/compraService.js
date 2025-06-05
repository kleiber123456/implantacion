// src/services/compraService.js
const CompraModel = require("../models/compraModel");
const CompraPorRepuestoModel = require("../models/compraPorRepuestoModel");
const RepuestoModel = require("../models/repuestoModel");
const db = require("../config/db");

const CompraService = {
  listar: () => CompraModel.findAll(),

  obtener: async (id) => {
    const compra = await CompraModel.findById(id);
    if (compra) {
      compra.detalles = await CompraPorRepuestoModel.findByCompra(id);
    }
    return compra;
  },

  crear: async (data) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { proveedor_id, detalles, estado } = data;

      const compraId = await CompraModel.create({
        proveedor_id,
        fecha: new Date(),
        total: 0,
        estado: estado || "Pendiente",
      });

      let total = 0;

      if (detalles && detalles.length > 0) {
        for (const detalle of detalles) {
          const { repuesto_id, cantidad, precio_compra } = detalle;
          const repuesto = await RepuestoModel.findById(repuesto_id);
          if (!repuesto) {
            throw new Error(`Repuesto con ID ${repuesto_id} no encontrado`);
          }

          const precioCompraFinal = precio_compra || repuesto.preciounitario;
          const subtotal = cantidad * precioCompraFinal;
          total += subtotal;

          await CompraPorRepuestoModel.create({
            compras_id: compraId,
            repuesto_id,
            cantidad,
            precio_compra: precioCompraFinal,
            subtotal,
          });

          if (estado === "Completado") {
            const nuevaCantidad = repuesto.cantidad + cantidad;
            const nuevoTotal = nuevaCantidad * precioCompraFinal;

            await RepuestoModel.update(repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              preciounitario: precioCompraFinal,
              precio_compra: precioCompraFinal,
              total: nuevoTotal,
            });
          }
        }
      }

      await CompraModel.update(compraId, {
        proveedor_id,
        fecha: new Date(),
        total,
        estado: estado || "Pendiente",
      });

      await connection.commit();
      return compraId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  actualizar: async (id, data) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const { proveedor_id, detalles, estado } = data;

      const compraActual = await CompraModel.findById(id);
      const detallesActuales = await CompraPorRepuestoModel.findByCompra(id);

      if (compraActual.estado === "Completado") {
        for (const detalle of detallesActuales) {
          const repuesto = await RepuestoModel.findById(detalle.repuesto_id);
          if (repuesto) {
            const nuevaCantidad = Math.max(0, repuesto.cantidad - detalle.cantidad);
            const nuevoTotal = nuevaCantidad * repuesto.preciounitario;

            await RepuestoModel.update(detalle.repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              total: nuevoTotal,
            });
          }
        }
      }

      await CompraPorRepuestoModel.deleteByCompra(id);

      let total = 0;

      if (detalles && detalles.length > 0) {
        for (const detalle of detalles) {
          const { repuesto_id, cantidad, precio_compra } = detalle;
          const repuesto = await RepuestoModel.findById(repuesto_id);
          if (!repuesto) {
            throw new Error(`Repuesto con ID ${repuesto_id} no encontrado`);
          }

          const precioCompraFinal = precio_compra || repuesto.preciounitario;
          const subtotal = cantidad * precioCompraFinal;
          total += subtotal;

          await CompraPorRepuestoModel.create({
            compras_id: id,
            repuesto_id,
            cantidad,
            precio_compra: precioCompraFinal,
            subtotal,
          });

          if (estado === "Completado") {
            const nuevaCantidad = repuesto.cantidad + cantidad;
            const nuevoTotal = nuevaCantidad * precioCompraFinal;

            await RepuestoModel.update(repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              preciounitario: precioCompraFinal,
              precio_compra: precioCompraFinal,
              total: nuevoTotal,
            });
          }
        }
      }

      await CompraModel.update(id, {
        proveedor_id,
        fecha: compraActual.fecha,
        total,
        estado: estado || compraActual.estado,
      });

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  eliminar: async (id) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const compra = await CompraModel.findById(id);

      if (compra && compra.estado === "Completado") {
        const detalles = await CompraPorRepuestoModel.findByCompra(id);

        for (const detalle of detalles) {
          const repuesto = await RepuestoModel.findById(detalle.repuesto_id);
          if (repuesto) {
            const nuevaCantidad = Math.max(0, repuesto.cantidad - detalle.cantidad);
            const nuevoTotal = nuevaCantidad * repuesto.preciounitario;

            await RepuestoModel.update(detalle.repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              total: nuevoTotal,
            });
          }
        }
      }

      await CompraPorRepuestoModel.deleteByCompra(id);
      await CompraModel.delete(id);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  cambiarEstado: async (id, nuevoEstado) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const compra = await CompraModel.findById(id);
      if (!compra) throw new Error("Compra no encontrada");

      const estadoActual = compra.estado;

      if (estadoActual === nuevoEstado) {
        throw new Error("La compra ya tiene ese estado.");
      }

      const detalles = await CompraPorRepuestoModel.findByCompra(id);

      // Si pasa a "Completado", aumentar stock
      if (nuevoEstado === "Completado") {
        for (const detalle of detalles) {
          const repuesto = await RepuestoModel.findById(detalle.repuesto_id);
          if (repuesto) {
            const nuevaCantidad = repuesto.cantidad + detalle.cantidad;
            const precioCompra = detalle.precio_compra || repuesto.preciounitario;
            const nuevoTotal = nuevaCantidad * precioCompra;

            await RepuestoModel.update(detalle.repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              preciounitario: precioCompra,
              precio_compra: precioCompra,
              total: nuevoTotal,
            });
          }
        }
      }

      // Si estaba en "Completado" y pasa a otro estado, revertir stock
      else if (estadoActual === "Completado" && nuevoEstado !== "Completado") {
        for (const detalle of detalles) {
          const repuesto = await RepuestoModel.findById(detalle.repuesto_id);
          if (repuesto) {
            const nuevaCantidad = Math.max(0, repuesto.cantidad - detalle.cantidad);
            const nuevoTotal = nuevaCantidad * repuesto.preciounitario;

            await RepuestoModel.update(detalle.repuesto_id, {
              ...repuesto,
              cantidad: nuevaCantidad,
              total: nuevoTotal,
            });
          }
        }
      }

      await CompraModel.cambiarEstado(id, nuevoEstado);
      await connection.commit();

      return nuevoEstado;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = CompraService;
