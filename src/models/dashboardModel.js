// src/models/dashboardModel.js
const db = require("../config/db")

const DashboardModel = {
  // ============ CONTEOS BÁSICOS ============
  async contarServicios() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM servicio")
    return rows[0].total
  },

  async contarServiciosActivos() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM servicio WHERE estado = ?", ["Activo"])
    return rows[0].total
  },

  async contarRepuestos() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM repuesto")
    return rows[0].total
  },

  async sumarCantidadRepuestos() {
    const [rows] = await db.query("SELECT SUM(cantidad) as total FROM repuesto WHERE estado = ?", ["Activo"])
    return rows[0].total || 0
  },

  async contarCompras() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM compras")
    return rows[0].total
  },

  async contarComprasPorEstado(estado) {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM compras WHERE estado = ?", [estado])
    return rows[0].total
  },

  async contarClientes() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM cliente")
    return rows[0].total
  },

  async contarClientesActivos() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM cliente WHERE estado = ?", ["Activo"])
    return rows[0].total
  },

  async contarMecanicos() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM mecanico")
    return rows[0].total
  },

  async contarMecanicosActivos() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM mecanico WHERE estado = ?", ["Activo"])
    return rows[0].total
  },

  // ============ VENTAS ============
  async contarVentas() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM venta")
    return rows[0].total
  },

  async contarVentasPorEstado(estadoId) {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM venta WHERE estado_venta_id = ?", [estadoId])
    return rows[0].total
  },

  async obtenerTotalIngresos() {
    const [rows] = await db.query("SELECT SUM(total) as total FROM venta WHERE estado_venta_id = 2") // Solo ventas pagadas
    return rows[0].total || 0
  },

  async obtenerIngresosMes(año, mes) {
    const [rows] = await db.query(
      `SELECT SUM(total) as total FROM venta 
       WHERE estado_venta_id = 2 AND YEAR(fecha) = ? AND MONTH(fecha) = ?`,
      [año, mes],
    )
    return rows[0].total || 0
  },

  async obtenerVentasRecientes(limite = 5) {
    const [rows] = await db.query(
      `SELECT v.id, v.fecha, v.total, 
              c.nombre as cliente_nombre, c.apellido as cliente_apellido,
              ev.nombre as estado_nombre,
              m.nombre as mecanico_nombre, m.apellido as mecanico_apellido
       FROM venta v 
       JOIN cliente c ON v.cliente_id = c.id
       JOIN estado_venta ev ON v.estado_venta_id = ev.id
       LEFT JOIN mecanico m ON v.mecanico_id = m.id
       ORDER BY v.fecha DESC
       LIMIT ?`,
      [limite],
    )
    return rows
  },

  // ============ CITAS ============
  async contarCitas() {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM cita")
    return rows[0].total
  },

  async contarCitasPorEstado(estadoId) {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM cita WHERE estado_cita_id = ?", [estadoId])
    return rows[0].total
  },

  async obtenerCitasHoy() {
    const [rows] = await db.query(
      `SELECT c.*, 
              ec.nombre AS estado_nombre,
              v.placa AS vehiculo_placa,
              cl.nombre AS cliente_nombre,
              cl.apellido AS cliente_apellido,
              m.nombre AS mecanico_nombre,
              m.apellido AS mecanico_apellido
       FROM cita c
       JOIN estado_cita ec ON c.estado_cita_id = ec.id
       JOIN vehiculo v ON c.vehiculo_id = v.id
       JOIN cliente cl ON v.cliente_id = cl.id
       JOIN mecanico m ON c.mecanico_id = m.id
       WHERE DATE(c.fecha) = CURDATE()
       ORDER BY c.hora`,
    )
    return rows
  },

  async obtenerCitasProximasSemana() {
    const [rows] = await db.query(
      `SELECT c.*, 
              ec.nombre AS estado_nombre,
              v.placa AS vehiculo_placa,
              cl.nombre AS cliente_nombre,
              cl.apellido AS cliente_apellido,
              m.nombre AS mecanico_nombre,
              m.apellido AS mecanico_apellido
       FROM cita c
       JOIN estado_cita ec ON c.estado_cita_id = ec.id
       JOIN vehiculo v ON c.vehiculo_id = v.id
       JOIN cliente cl ON v.cliente_id = cl.id
       JOIN mecanico m ON c.mecanico_id = m.id
       WHERE c.fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       ORDER BY c.fecha, c.hora
       LIMIT 10`,
    )
    return rows
  },

  // ============ DATOS DETALLADOS ============
  async obtenerServiciosActivos() {
    const [rows] = await db.query(`
      SELECT id, nombre, descripcion, precio 
      FROM servicio 
      WHERE estado = 'Activo' 
      ORDER BY nombre
    `)
    return rows
  },

  async obtenerRepuestosBajoStock(limite) {
    const [rows] = await db.query(
      `SELECT r.id, r.nombre, r.cantidad, r.precio_venta, c.nombre as categoria_nombre
       FROM repuesto r
       JOIN categoria_repuesto c ON r.categoria_repuesto_id = c.id
       WHERE r.estado = 'Activo' AND r.cantidad <= ?
       ORDER BY r.cantidad ASC`,
      [limite],
    )
    return rows
  },

  // ============ NUEVO: REPUESTOS CRÍTICOS ============
  async obtenerRepuestosCriticos() {
    const [rows] = await db.query(
      `SELECT r.id, r.nombre, r.descripcion, r.cantidad, r.precio_venta, r.precio_compra,
              r.categoria_repuesto_id, r.estado,
              c.nombre as categoria_nombre
       FROM repuesto r
       JOIN categoria_repuesto c ON r.categoria_repuesto_id = c.id
       WHERE r.estado = 'Activo' AND r.cantidad = 0
       ORDER BY r.nombre ASC`,
    )
    return rows
  },

  async obtenerComprasRecientes(limite) {
    const [rows] = await db.query(
      `SELECT c.id, c.fecha, c.total, c.estado, p.nombre as proveedor_nombre, p.nombre_empresa
       FROM compras c
       JOIN proveedor p ON c.proveedor_id = p.id
       ORDER BY c.fecha DESC
       LIMIT ?`,
      [limite],
    )
    return rows
  },

  // ============ ESTADÍSTICAS AVANZADAS ============
  async obtenerTopServicios(limite = 5) {
    const [rows] = await db.query(
      `SELECT s.id, s.nombre, s.precio, COUNT(vps.servicio_id) as veces_vendido,
              SUM(vps.subtotal) as ingresos_generados
       FROM servicio s
       LEFT JOIN venta_por_servicio vps ON s.id = vps.servicio_id
       LEFT JOIN venta v ON vps.venta_id = v.id AND v.estado_venta_id = 2
       WHERE s.estado = 'Activo'
       GROUP BY s.id, s.nombre, s.precio
       ORDER BY veces_vendido DESC, ingresos_generados DESC
       LIMIT ?`,
      [limite],
    )
    return rows
  },

  async obtenerTopRepuestos(limite = 5) {
    const [rows] = await db.query(
      `SELECT r.id, r.nombre, r.cantidad, r.precio_venta,
              c.nombre as categoria_nombre,
              COALESCE(SUM(vpr.cantidad), 0) as total_vendido,
              COALESCE(SUM(vpr.subtotal), 0) as ingresos_generados
       FROM repuesto r
       JOIN categoria_repuesto c ON r.categoria_repuesto_id = c.id
       LEFT JOIN venta_por_repuesto vpr ON r.id = vpr.repuesto_id
       LEFT JOIN venta v ON vpr.venta_id = v.id AND v.estado_venta_id = 2
       WHERE r.estado = 'Activo'
       GROUP BY r.id, r.nombre, r.cantidad, r.precio_venta, c.nombre
       ORDER BY total_vendido DESC, ingresos_generados DESC
       LIMIT ?`,
      [limite],
    )
    return rows
  },

  async obtenerMecanicosActivos() {
    const [rows] = await db.query(
      `SELECT m.id, m.nombre, m.apellido,
              COUNT(c.id) as total_citas,
              COUNT(CASE WHEN c.estado_cita_id = 3 THEN 1 END) as citas_completadas,
              COUNT(CASE WHEN c.estado_cita_id = 1 THEN 1 END) as citas_programadas
       FROM mecanico m
       LEFT JOIN cita c ON m.id = c.mecanico_id
       WHERE m.estado = 'Activo'
       GROUP BY m.id, m.nombre, m.apellido
       ORDER BY total_citas DESC`,
    )
    return rows
  },

  async obtenerClientesFrecuentes(limite = 5) {
    const [rows] = await db.query(
      `SELECT c.id, c.nombre, c.apellido, c.telefono,
              COUNT(v.id) as total_ventas,
              SUM(CASE WHEN v.estado_venta_id = 2 THEN v.total ELSE 0 END) as total_gastado,
              MAX(v.fecha) as ultima_visita
       FROM cliente c
       LEFT JOIN venta v ON c.id = v.cliente_id
       WHERE c.estado = 'Activo'
       GROUP BY c.id, c.nombre, c.apellido, c.telefono
       HAVING total_ventas > 0
       ORDER BY total_ventas DESC, total_gastado DESC
       LIMIT ?`,
      [limite],
    )
    return rows
  },

  // ============ TENDENCIAS ============
  async obtenerVentasPorMes(año) {
    const [rows] = await db.query(
      `SELECT 
        MONTH(fecha) as mes,
        COUNT(*) as total_ventas,
        SUM(total) as total_ingresos,
        SUM(CASE WHEN estado_venta_id = 2 THEN total ELSE 0 END) as ingresos_pagados,
        COUNT(CASE WHEN estado_venta_id = 2 THEN 1 END) as ventas_pagadas
       FROM venta 
       WHERE YEAR(fecha) = ?
       GROUP BY MONTH(fecha)
       ORDER BY mes`,
      [año],
    )
    return rows
  },

  async obtenerCitasPorMes(año) {
    const [rows] = await db.query(
      `SELECT 
        MONTH(fecha) as mes,
        COUNT(*) as total_citas,
        COUNT(CASE WHEN estado_cita_id = 3 THEN 1 END) as completadas,
        COUNT(CASE WHEN estado_cita_id = 4 THEN 1 END) as canceladas
       FROM cita 
       WHERE YEAR(fecha) = ?
       GROUP BY MONTH(fecha)
       ORDER BY mes`,
      [año],
    )
    return rows
  },

  async obtenerComprasPorMes(año) {
    const [rows] = await db.query(
      `SELECT 
        MONTH(fecha) as mes,
        COUNT(*) as total_compras,
        SUM(total) as total_monto,
        SUM(CASE WHEN estado = 'Completado' THEN 1 ELSE 0 END) as completadas
       FROM compras 
       WHERE YEAR(fecha) = ?
       GROUP BY MONTH(fecha)
       ORDER BY mes`,
      [año],
    )
    return rows
  },

  // ============ RESUMEN EJECUTIVO ============
  async obtenerResumenEjecutivo() {
    const [rows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM venta WHERE DATE(fecha) = CURDATE()) as ventas_hoy,
        (SELECT COUNT(*) FROM cita WHERE DATE(fecha) = CURDATE()) as citas_hoy,
        (SELECT SUM(total) FROM venta WHERE estado_venta_id = 2 AND DATE(fecha) = CURDATE()) as ingresos_hoy,
        (SELECT COUNT(*) FROM cita WHERE fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) as citas_proxima_semana,
        (SELECT COUNT(*) FROM repuesto WHERE cantidad <= 5 AND estado = 'Activo') as repuestos_bajo_stock,
        (SELECT COUNT(*) FROM compras WHERE estado = 'Pendiente') as compras_pendientes
    `)
    return rows[0]
  },
}

module.exports = DashboardModel
