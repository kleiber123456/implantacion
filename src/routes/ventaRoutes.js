// src/routes/ventaRoutes.js
const express = require("express")
const router = express.Router()
const VentaController = require("../controllers/ventaController")
const { authorizeRoles } = require("../middlewares/authMiddleware")

// Rutas de consulta (GET) - solo requieren autenticación
router.get("/", VentaController.listar)
router.get("/cliente/:clienteId", VentaController.obtenerPorCliente)
router.get("/estado/:estadoId", VentaController.obtenerPorEstado)
router.get("/rango", VentaController.obtenerPorRangoFechas)

// Rutas de historial - DEBEN IR ANTES de /:id
router.get("/historial/cliente/:clienteId", VentaController.obtenerHistorialPorCliente)
router.get("/historial/vehiculo/:vehiculoId", VentaController.obtenerHistorialPorVehiculo)

// Ruta específica para obtener una venta por ID - DEBE IR DESPUÉS de las rutas específicas
router.get("/:id", VentaController.obtener)
router.get("/:id/historial", VentaController.obtenerHistorial)

// Rutas de modificación - requieren roles específicos
router.post("/", authorizeRoles(1, 2), VentaController.crear)
router.put("/:id", authorizeRoles(1, 2), VentaController.actualizar)

// Vincular venta con cita
router.post("/:id/vincular-cita", authorizeRoles(1, 2), VentaController.vincularConCita)

// Cambio de estado - solo administradores
router.put("/:id/cambiar-estado", authorizeRoles(1), VentaController.cambiarEstado)

// Eliminación - solo administradores
router.delete("/:id", authorizeRoles(1), VentaController.eliminar)

module.exports = router
