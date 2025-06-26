// src/models/dashboardModel.js
const db = require("../config/db")

const DashboardModel = {
  // Conteos para estadísticas
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

  // Datos detallados
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
      `
      SELECT r.id, r.nombre, r.cantidad, r.precio_venta, c.nombre as categoria_nombre
      FROM repuesto r
      JOIN categoria_repuesto c ON r.categoria_repuesto_id = c.id
      WHERE r.estado = 'Activo' AND r.cantidad <= ?
      ORDER BY r.cantidad ASC
    `,
      [limite],
    )
    return rows
  },

  async obtenerComprasRecientes(limite) {
    const [rows] = await db.query(
      `
      SELECT c.id, c.fecha, c.total, c.estado, p.nombre as proveedor_nombre, p.nombre_empresa
      FROM compras c
      JOIN proveedor p ON c.proveedor_id = p.id
      ORDER BY c.fecha DESC
      LIMIT ?
    `,
      [limite],
    )
    return rows
  },

  // Estadísticas por rangos de fecha
  async obtenerComprasPorMes(año) {
    const [rows] = await db.query(
      `
      SELECT 
        MONTH(fecha) as mes,
        COUNT(*) as total_compras,
        SUM(total) as total_monto,
        SUM(CASE WHEN estado = 'Completado' THEN 1 ELSE 0 END) as completadas
      FROM compras 
      WHERE YEAR(fecha) = ?
      GROUP BY MONTH(fecha)
      ORDER BY mes
    `,
      [año],
    )
    return rows
  },

  async obtenerTopRepuestos(limite = 10) {
    const [rows] = await db.query(
      `
      SELECT 
        r.id,
        r.nombre,
        r.cantidad,
        r.preciounitario,
        c.nombre as categoria_nombre,
        COALESCE(SUM(cpr.cantidad), 0) as total_comprado
      FROM repuesto r
      JOIN categoria_repuesto c ON r.categoria_repuesto_id = c.id
      LEFT JOIN compras_por_repuesto cpr ON r.id = cpr.repuesto_id
      LEFT JOIN compras comp ON cpr.compras_id = comp.id AND comp.estado = 'Completado'
      WHERE r.estado = 'Activo'
      GROUP BY r.id, r.nombre, r.cantidad, r.preciounitario, c.nombre
      ORDER BY total_comprado DESC
      LIMIT ?
    `,
      [limite],
    )
    return rows
  },
}

module.exports = DashboardModel
