// src/services/dashboardService.js
const DashboardModel = require('../models/dashboardModel');

const DashboardService = {
  async obtenerEstadisticas() {
    const [
      totalServicios,
      serviciosActivos,
      totalRepuestos,
      cantidadTotalRepuestos,
      totalCompras,
      comprasPendientes,
      comprasCompletadas,
      totalClientes,
      clientesActivos
    ] = await Promise.all([
      DashboardModel.contarServicios(),
      DashboardModel.contarServiciosActivos(),
      DashboardModel.contarRepuestos(),
      DashboardModel.sumarCantidadRepuestos(),
      DashboardModel.contarCompras(),
      DashboardModel.contarComprasPorEstado('Pendiente'),
      DashboardModel.contarComprasPorEstado('Completado'),
      DashboardModel.contarClientes(),
      DashboardModel.contarClientesActivos()
    ]);

    return {
      servicios: {
        total: totalServicios,
        activos: serviciosActivos,
        inactivos: totalServicios - serviciosActivos
      },
      repuestos: {
        totalTipos: totalRepuestos,
        cantidadTotal: cantidadTotalRepuestos
      },
      compras: {
        total: totalCompras,
        pendientes: comprasPendientes,
        completadas: comprasCompletadas,
        canceladas: totalCompras - comprasPendientes - comprasCompletadas
      },
      clientes: {
        total: totalClientes,
        activos: clientesActivos,
        inactivos: totalClientes - clientesActivos
      }
    };
  },

  async obtenerServiciosActivos() {
    return await DashboardModel.obtenerServiciosActivos();
  },

  async obtenerRepuestosBajoStock(limite = 10) {
    return await DashboardModel.obtenerRepuestosBajoStock(limite);
  },

  async obtenerComprasRecientes(limite = 5) {
    return await DashboardModel.obtenerComprasRecientes(limite);
  }
};

module.exports = DashboardService;
