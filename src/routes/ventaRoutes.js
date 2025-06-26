// src/routes/ventaRoutes.js
const express = require("express")
const router = express.Router()
const VentaController = require("../controllers/ventaController")
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware")

// Rutas de consulta (GET) - solo requieren autenticación
router.get("/", verifyToken, VentaController.listar)
router.get("/cliente/:clienteId", verifyToken, VentaController.obtenerPorCliente)
router.get("/estado/:estadoId", verifyToken, VentaController.obtenerPorEstado)
router.get("/rango", verifyToken, VentaController.obtenerPorRangoFechas)

// Rutas de historial
router.get("/historial/cliente/:clienteId", verifyToken, VentaController.obtenerHistorialPorCliente)
router.get("/historial/vehiculo/:vehiculoId", verifyToken, VentaController.obtenerHistorialPorVehiculo)
router.get("/:id/historial", verifyToken, VentaController.obtenerHistorial)

// Ruta específica debe ir después de las rutas con parámetros específicos
router.get("/:id", verifyToken, VentaController.obtener)

// Rutas de modificación - requieren roles específicos
router.post("/", verifyToken, authorizeRoles(1, 2), VentaController.crear)
router.put("/:id", verifyToken, authorizeRoles(1, 2), VentaController.actualizar)
router.get("/:id", verifyToken, authorizeRoles(1, 2), VentaController.obtener)

// Vincular venta con cita
router.post("/:id/vincular-cita", verifyToken, authorizeRoles(1, 2), VentaController.vincularConCita)

// Cambio de estado - solo administradores
router.put("/:id/cambiar-estado", verifyToken, authorizeRoles(1), VentaController.cambiarEstado)

// Eliminación - solo administradores
router.delete("/:id", verifyToken, authorizeRoles(1), VentaController.eliminar)

module.exports = router
