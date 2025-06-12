// src/services/ventaService.js
const VentaModel = require('../models/ventaModel');
const VentaPorServicioModel = require('../models/ventaPorServicioModel');
const VentaPorRepuestoModel = require('../models/ventaPorRepuestoModel');
const RepuestoModel = require('../models/repuestoModel');
const ServicioModel = require('../models/servicioModel');
const MecanicoModel = require('../models/mecanicoModel'); // AGREGADO
const db = require('../config/db');

const VentaService = {
  listar: () => VentaModel.findAll(),
  
  obtener: async (id) => {
    const venta = await VentaModel.findById(id);
    if (venta) {
      venta.servicios = await VentaPorServicioModel.findByVenta(id);
      venta.repuestos = await VentaPorRepuestoModel.findByVenta(id);
    }
    return venta;
  },
  
  obtenerPorCliente: (clienteId) => VentaModel.findByCliente(clienteId),
  
  obtenerPorEstado: (estadoId) => VentaModel.findByEstado(estadoId),
  
  obtenerPorRangoFechas: (fechaInicio, fechaFin) => VentaModel.findByDateRange(fechaInicio, fechaFin),
  
  crear: async (data) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      const { cliente_id, estado_venta_id, mecanico_id, servicios, repuestos } = data; // AGREGADO mecanico_id
      
      // Validaciones básicas
      if (!cliente_id || !estado_venta_id) {
        throw new Error('Cliente y estado de venta son requeridos');
      }
      
      // Validar mecánico si se proporciona
      if (mecanico_id) {
        const mecanicoData = await MecanicoModel.findById(mecanico_id);
        if (!mecanicoData) {
          throw new Error(`Mecánico con ID ${mecanico_id} no encontrado`);
        }
        
        if (mecanicoData.estado !== 'Activo') {
          throw new Error(`El mecánico ${mecanicoData.nombre} no está activo`);
        }
      }
      
      // Crear la venta
      const ventaId = await VentaModel.create({
        cliente_id,
        estado_venta_id,
        mecanico_id: mecanico_id || null, // AGREGADO
        fecha: new Date(),
        total: 0
      });
      
      let total = 0;
      
      // Procesar servicios
      if (servicios && servicios.length > 0) {
        for (const servicio of servicios) {
          const { servicio_id } = servicio;
          
          // Obtener el servicio para validar y obtener el precio
          const servicioData = await ServicioModel.findById(servicio_id);
          if (!servicioData) {
            throw new Error(`Servicio con ID ${servicio_id} no encontrado`);
          }
          
          if (servicioData.estado !== 'Activo') {
            throw new Error(`El servicio ${servicioData.nombre} no está activo`);
          }
          
          const subtotal = servicioData.precio;
          total += subtotal;
          
          await VentaPorServicioModel.create({
            venta_id: ventaId,
            servicio_id,
            subtotal
          });
        }
      }
      
      // Procesar repuestos
      if (repuestos && repuestos.length > 0) {
        for (const repuesto of repuestos) {
          const { repuesto_id, cantidad } = repuesto;
          
          // Obtener el repuesto para validar stock y precio
          const repuestoData = await RepuestoModel.findById(repuesto_id);
          if (!repuestoData) {
            throw new Error(`Repuesto con ID ${repuesto_id} no encontrado`);
          }
          
          if (repuestoData.estado !== 'Activo') {
            throw new Error(`El repuesto ${repuestoData.nombre} no está activo`);
          }
          
          if (repuestoData.cantidad < cantidad) {
            throw new Error(`Stock insuficiente para el repuesto ${repuestoData.nombre}. Stock disponible: ${repuestoData.cantidad}`);
          }
          
          const subtotal = cantidad * repuestoData.preciounitario;
          total += subtotal;
          
          await VentaPorRepuestoModel.create({
            venta_id: ventaId,
            repuesto_id,
            cantidad,
            subtotal
          });
          
          // Actualizar stock del repuesto
          const nuevaCantidad = repuestoData.cantidad - cantidad;
          const nuevoTotal = nuevaCantidad * repuestoData.preciounitario;
          
          await RepuestoModel.update(repuesto_id, {
            ...repuestoData,
            cantidad: nuevaCantidad,
            total: nuevoTotal
          });
        }
      }
      
      // Actualizar el total de la venta
      await VentaModel.update(ventaId, {
        cliente_id,
        estado_venta_id,
        mecanico_id: mecanico_id || null, // AGREGADO
        fecha: new Date(),
        total
      });
      
      await connection.commit();
      return ventaId;
      
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
      const { cliente_id, estado_venta_id, mecanico_id, servicios, repuestos } = data; // AGREGADO mecanico_id
      
      // Obtener la venta actual
      const ventaActual = await VentaModel.findById(id);
      if (!ventaActual) {
        throw new Error('Venta no encontrada');
      }
      
      // Validar mecánico si se proporciona
      if (mecanico_id) {
        const mecanicoData = await MecanicoModel.findById(mecanico_id);
        if (!mecanicoData) {
          throw new Error(`Mecánico con ID ${mecanico_id} no encontrado`);
        }
        
        if (mecanicoData.estado !== 'Activo') {
          throw new Error(`El mecánico ${mecanicoData.nombre} no está activo`);
        }
      }
      
      // Obtener los repuestos actuales para revertir el stock
      const repuestosActuales = await VentaPorRepuestoModel.findByVenta(id);
      
      // Revertir el stock de los repuestos actuales
      for (const repuestoActual of repuestosActuales) {
        const repuestoData = await RepuestoModel.findById(repuestoActual.repuesto_id);
        if (repuestoData) {
          const nuevaCantidad = repuestoData.cantidad + repuestoActual.cantidad;
          const nuevoTotal = nuevaCantidad * repuestoData.preciounitario;
          
          await RepuestoModel.update(repuestoActual.repuesto_id, {
            ...repuestoData,
            cantidad: nuevaCantidad,
            total: nuevoTotal
          });
        }
      }
      
      // Eliminar los detalles actuales
      await VentaPorServicioModel.deleteByVenta(id);
      await VentaPorRepuestoModel.deleteByVenta(id);
      
      let total = 0;
      
      // Procesar nuevos servicios
      if (servicios && servicios.length > 0) {
        for (const servicio of servicios) {
          const { servicio_id } = servicio;
          
          const servicioData = await ServicioModel.findById(servicio_id);
          if (!servicioData) {
            throw new Error(`Servicio con ID ${servicio_id} no encontrado`);
          }
          
          if (servicioData.estado !== 'Activo') {
            throw new Error(`El servicio ${servicioData.nombre} no está activo`);
          }
          
          const subtotal = servicioData.precio;
          total += subtotal;
          
          await VentaPorServicioModel.create({
            venta_id: id,
            servicio_id,
            subtotal
          });
        }
      }
      
      // Procesar nuevos repuestos
      if (repuestos && repuestos.length > 0) {
        for (const repuesto of repuestos) {
          const { repuesto_id, cantidad } = repuesto;
          
          const repuestoData = await RepuestoModel.findById(repuesto_id);
          if (!repuestoData) {
            throw new Error(`Repuesto con ID ${repuesto_id} no encontrado`);
          }
          
          if (repuestoData.estado !== 'Activo') {
            throw new Error(`El repuesto ${repuestoData.nombre} no está activo`);
          }
          
          if (repuestoData.cantidad < cantidad) {
            throw new Error(`Stock insuficiente para el repuesto ${repuestoData.nombre}. Stock disponible: ${repuestoData.cantidad}`);
          }
          
          const subtotal = cantidad * repuestoData.preciounitario;
          total += subtotal;
          
          await VentaPorRepuestoModel.create({
            venta_id: id,
            repuesto_id,
            cantidad,
            subtotal
          });
          
          // Actualizar stock del repuesto
          const nuevaCantidad = repuestoData.cantidad - cantidad;
          const nuevoTotal = nuevaCantidad * repuestoData.preciounitario;
          
          await RepuestoModel.update(repuesto_id, {
            ...repuestoData,
            cantidad: nuevaCantidad,
            total: nuevoTotal
          });
        }
      }
      
      // Actualizar la venta
      await VentaModel.update(id, {
        cliente_id,
        estado_venta_id,
        mecanico_id: mecanico_id || null, // AGREGADO
        fecha: ventaActual.fecha,
        total
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
      // Obtener la venta para verificar que existe
      const venta = await VentaModel.findById(id);
      if (!venta) {
        throw new Error('Venta no encontrada');
      }
      
      // Obtener los repuestos para revertir el stock
      const repuestos = await VentaPorRepuestoModel.findByVenta(id);
      
      // Revertir el stock
      for (const repuesto of repuestos) {
        const repuestoData = await RepuestoModel.findById(repuesto.repuesto_id);
        if (repuestoData) {
          const nuevaCantidad = repuestoData.cantidad + repuesto.cantidad;
          const nuevoTotal = nuevaCantidad * repuestoData.preciounitario;
          
          await RepuestoModel.update(repuesto.repuesto_id, {
            ...repuestoData,
            cantidad: nuevaCantidad,
            total: nuevoTotal
          });
        }
      }
      
      // Eliminar los detalles
      await VentaPorServicioModel.deleteByVenta(id);
      await VentaPorRepuestoModel.deleteByVenta(id);
      
      // Eliminar la venta
      await VentaModel.delete(id);
      
      await connection.commit();
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  cambiarEstado: async (id, estadoId) => {
    const venta = await VentaModel.findById(id);
    if (!venta) {
      throw new Error('Venta no encontrada');
    }
    
    await VentaModel.cambiarEstado(id, estadoId);
    return estadoId;
  }
};

module.exports = VentaService;