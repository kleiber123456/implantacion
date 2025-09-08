// src/routes/citaRoutes.js
const express = require("express")
const router = express.Router()
const CitaController = require("../controllers/citaController")
const { authorizeRoles } = require("../middlewares/authMiddleware")

// Rutas públicas (requieren autenticación pero no roles específicos)
router.get("/", CitaController.listar)
router.get("/cliente/:clienteId", CitaController.obtenerPorCliente)
router.get("/mecanico/:mecanicoId", CitaController.obtenerPorMecanico)
router.get("/fecha/:fecha", CitaController.obtenerPorFecha)
router.get("/estado/:estadoId", CitaController.obtenerPorEstado)
router.get("/disponibilidad/mecanicos", CitaController.verificarDisponibilidadMecanicos)

// Rutas de historial
router.get("/historial/cliente/:clienteId", CitaController.obtenerHistorialPorCliente)
router.get("/historial/vehiculo/:vehiculoId", CitaController.obtenerHistorialPorVehiculo)
router.get("/:id/historial", CitaController.obtenerHistorial)

router.get("/:id", CitaController.obtener)

// Rutas que requieren ser administrador o cliente
router.post("/", authorizeRoles(1, 2), CitaController.crear)
router.put("/:id", authorizeRoles(1, 2), CitaController.actualizar)

// Rutas que solo pueden ser accedidas por administradores
router.put("/:id/cambiar-estado", authorizeRoles(1), CitaController.cambiarEstado)
router.delete("/:id", authorizeRoles(1), CitaController.eliminar)

module.exports = router
