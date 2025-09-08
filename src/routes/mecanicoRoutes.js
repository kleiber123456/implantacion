// src/routes/mecanicoRoutes.js
const express = require("express")
const router = express.Router()
const MecanicoController = require("../controllers/mecanicoController")
const { authorizeRoles } = require("../middlewares/authMiddleware")

// Rutas públicas (requieren autenticación pero no roles específicos)
router.get("/", MecanicoController.listar)
router.get("/estado/:estado", MecanicoController.obtenerPorEstado)
router.get("/:id", MecanicoController.obtener)
router.get("/:id/citas", MecanicoController.obtenerCitas)

// RUTA ELIMINADA: /:id/novedades ya no es necesaria
// router.get("/:id/novedades", MecanicoController.obtenerNovedades)

// Nueva ruta para estadísticas del mecánico (opcional)
router.get("/:id/estadisticas", MecanicoController.obtenerEstadisticas)

// Rutas protegidas (solo administradores)
router.post("/", authorizeRoles(1), MecanicoController.crear)
router.put("/:id", authorizeRoles(1), MecanicoController.actualizar)
router.put("/:id/cambiar-estado", authorizeRoles(1), MecanicoController.cambiarEstado)
router.delete("/:id", authorizeRoles(1), MecanicoController.eliminar)

module.exports = router