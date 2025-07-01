// src/services/dashboardService.js
const DashboardModel = require("../models/dashboardModel")

const DashboardService = {
  async obtenerEstadisticas() {
    const añoActual = new Date().getFullYear()
    const mesActual = new Date().getMonth() + 1

    const [
      totalServicios,
      serviciosActivos,
      totalRepuestos,
      cantidadTotalRepuestos,
      totalCompras,
      comprasPendientes,
      comprasCompletadas,
      totalClientes,
      clientesActivos,
      totalMecanicos,
      mecanicosActivos,
      totalVentas,
      ventasPendientes,
      ventasPagadas,
      ventasCanceladas,
      totalCitas,
      citasProgramadas,
      citasEnProceso,
      citasCompletadas,
      citasCanceladas,
      totalIngresos,
      ingresosMes,
      resumenEjecutivo,
    ] = await Promise.all([
      DashboardModel.contarServicios(),
      DashboardModel.contarServiciosActivos(),
      DashboardModel.contarRepuestos(),
      DashboardModel.sumarCantidadRepuestos(),
      DashboardModel.contarCompras(),
      DashboardModel.contarComprasPorEstado("Pendiente"),
      DashboardModel.contarComprasPorEstado("Completado"),
      DashboardModel.contarClientes(),
      DashboardModel.contarClientesActivos(),
      DashboardModel.contarMecanicos(),
      DashboardModel.contarMecanicosActivos(),
      DashboardModel.contarVentas(),
      DashboardModel.contarVentasPorEstado(1), // Pendientes
      DashboardModel.contarVentasPorEstado(2), // Pagadas
      DashboardModel.contarVentasPorEstado(3), // Canceladas
      DashboardModel.contarCitas(),
      DashboardModel.contarCitasPorEstado(1), // Programadas
      DashboardModel.contarCitasPorEstado(2), // En Proceso
      DashboardModel.contarCitasPorEstado(3), // Completadas
      DashboardModel.contarCitasPorEstado(4), // Canceladas
      DashboardModel.obtenerTotalIngresos(),
      DashboardModel.obtenerIngresosMes(añoActual, mesActual),
      DashboardModel.obtenerResumenEjecutivo(),
    ])

    return {
      resumenEjecutivo,
      servicios: {
        total: totalServicios,
        activos: serviciosActivos,
        inactivos: totalServicios - serviciosActivos,
      },
      repuestos: {
        totalTipos: totalRepuestos,
        cantidadTotal: cantidadTotalRepuestos,
        bajoStock: resumenEjecutivo.repuestos_bajo_stock,
      },
      compras: {
        total: totalCompras,
        pendientes: comprasPendientes,
        completadas: comprasCompletadas,
        canceladas: totalCompras - comprasPendientes - comprasCompletadas,
      },
      clientes: {
        total: totalClientes,
        activos: clientesActivos,
        inactivos: totalClientes - clientesActivos,
      },
      mecanicos: {
        total: totalMecanicos,
        activos: mecanicosActivos,
        inactivos: totalMecanicos - mecanicosActivos,
      },
      ventas: {
        total: totalVentas,
        pendientes: ventasPendientes,
        pagadas: ventasPagadas,
        canceladas: ventasCanceladas,
      },
      citas: {
        total: totalCitas,
        programadas: citasProgramadas,
        enProceso: citasEnProceso,
        completadas: citasCompletadas,
        canceladas: citasCanceladas,
      },
      ingresos: {
        total: totalIngresos,
        mesActual: ingresosMes,
        hoy: resumenEjecutivo.ingresos_hoy || 0,
      },
    }
  },

  async obtenerServiciosActivos() {
    return await DashboardModel.obtenerServiciosActivos()
  },

  async obtenerRepuestosBajoStock(limite = 10) {
    return await DashboardModel.obtenerRepuestosBajoStock(limite)
  },

  async obtenerComprasRecientes(limite = 5) {
    return await DashboardModel.obtenerComprasRecientes(limite)
  },

  async obtenerVentasRecientes(limite = 5) {
    return await DashboardModel.obtenerVentasRecientes(limite)
  },

  async obtenerCitasHoy() {
    return await DashboardModel.obtenerCitasHoy()
  },

  async obtenerCitasProximasSemana() {
    return await DashboardModel.obtenerCitasProximasSemana()
  },

  async obtenerTopServicios(limite = 5) {
    return await DashboardModel.obtenerTopServicios(limite)
  },

  async obtenerTopRepuestos(limite = 5) {
    return await DashboardModel.obtenerTopRepuestos(limite)
  },

  async obtenerMecanicosActivos() {
    return await DashboardModel.obtenerMecanicosActivos()
  },

  async obtenerClientesFrecuentes(limite = 5) {
    return await DashboardModel.obtenerClientesFrecuentes(limite)
  },

  async obtenerTendenciasVentas(año = new Date().getFullYear()) {
    return await DashboardModel.obtenerVentasPorMes(año)
  },

  async obtenerTendenciasCitas(año = new Date().getFullYear()) {
    return await DashboardModel.obtenerCitasPorMes(año)
  },

  async obtenerTendenciasCompras(año = new Date().getFullYear()) {
    return await DashboardModel.obtenerComprasPorMes(año)
  },
}

module.exports = DashboardService
