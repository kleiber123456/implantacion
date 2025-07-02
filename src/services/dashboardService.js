// src/services/dashboardService.js
const DashboardModel = require("../models/dashboardModel")

const DashboardService = {
  async obtenerEstadisticas() {
    const añoActual = new Date().getFullYear()
    const mesActual = new Date().getMonth() + 1

    try {
      // Ejecutar consultas en lotes más pequeños para evitar agotar el pool
      const estadisticasBasicas = await Promise.all([
        DashboardModel.contarServicios(),
        DashboardModel.contarServiciosActivos(),
        DashboardModel.contarRepuestos(),
        DashboardModel.sumarCantidadRepuestos(),
        DashboardModel.contarCompras(),
      ])

      const estadisticasCompras = await Promise.all([
        DashboardModel.contarComprasPorEstado("Pendiente"),
        DashboardModel.contarComprasPorEstado("Completado"),
      ])

      const estadisticasUsuarios = await Promise.all([
        DashboardModel.contarClientes(),
        DashboardModel.contarClientesActivos(),
        DashboardModel.contarMecanicos(),
        DashboardModel.contarMecanicosActivos(),
      ])

      const estadisticasVentas = await Promise.all([
        DashboardModel.contarVentas(),
        DashboardModel.contarVentasPorEstado(1), // Pendientes
        DashboardModel.contarVentasPorEstado(2), // Pagadas
        DashboardModel.contarVentasPorEstado(3), // Canceladas
      ])

      const estadisticasCitas = await Promise.all([
        DashboardModel.contarCitas(),
        DashboardModel.contarCitasPorEstado(1), // Programadas
        DashboardModel.contarCitasPorEstado(2), // En Proceso
        DashboardModel.contarCitasPorEstado(3), // Completadas
        DashboardModel.contarCitasPorEstado(4), // Canceladas
      ])

      const estadisticasIngresos = await Promise.all([
        DashboardModel.obtenerTotalIngresos(),
        DashboardModel.obtenerIngresosMes(añoActual, mesActual),
        DashboardModel.obtenerResumenEjecutivo(),
      ])

      // Destructurar los resultados
      const [totalServicios, serviciosActivos, totalRepuestos, cantidadTotalRepuestos, totalCompras] =
        estadisticasBasicas
      const [comprasPendientes, comprasCompletadas] = estadisticasCompras
      const [totalClientes, clientesActivos, totalMecanicos, mecanicosActivos] = estadisticasUsuarios
      const [totalVentas, ventasPendientes, ventasPagadas, ventasCanceladas] = estadisticasVentas
      const [totalCitas, citasProgramadas, citasEnProceso, citasCompletadas, citasCanceladas] = estadisticasCitas
      const [totalIngresos, ingresosMes, resumenEjecutivo] = estadisticasIngresos

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
    } catch (error) {
      console.error("Error en obtenerEstadisticas:", error)
      throw error
    }
  },

  async obtenerServiciosActivos() {
    return await DashboardModel.obtenerServiciosActivos()
  },

  async obtenerRepuestosBajoStock(limite = 10) {
    return await DashboardModel.obtenerRepuestosBajoStock(limite)
  },

  // ============ NUEVO: REPUESTOS CRÍTICOS ============
  async obtenerRepuestosCriticos() {
    return await DashboardModel.obtenerRepuestosCriticos()
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
