// src/routes/mecanicoRoutes.js
const express = require("express")
const router = express.Router()
const MecanicoController = require("../controllers/mecanicoController")
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware")

// Rutas públicas (requieren autenticación pero no roles específicos)
router.get("/", verifyToken, MecanicoController.listar)
router.get("/estado/:estado", verifyToken, MecanicoController.obtenerPorEstado)
router.get("/:id", verifyToken, MecanicoController.obtener)
router.get("/:id/citas", verifyToken, MecanicoController.obtenerCitas)

// RUTA ELIMINADA: /:id/novedades ya no es necesaria
// router.get("/:id/novedades", verifyToken, MecanicoController.obtenerNovedades)

// Nueva ruta para estadísticas del mecánico (opcional)
router.get("/:id/estadisticas", verifyToken, MecanicoController.obtenerEstadisticas)

// Rutas protegidas (solo administradores)
router.post("/", verifyToken, authorizeRoles(1), MecanicoController.crear)
router.put("/:id", verifyToken, authorizeRoles(1), MecanicoController.actualizar)
router.put("/:id/cambiar-estado", verifyToken, authorizeRoles(1), MecanicoController.cambiarEstado)
router.delete("/:id", verifyToken, authorizeRoles(1), MecanicoController.eliminar)

module.exports = router