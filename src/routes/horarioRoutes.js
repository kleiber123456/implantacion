// src/routes/horarioRoutes.js
const express = require("express")
const router = express.Router()
const HorarioController = require("../controllers/horarioController")
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware")

// Rutas públicas (requieren autenticación pero no roles específicos)
router.get("/", verifyToken, HorarioController.listar)
router.get("/mecanico/:mecanicoId", verifyToken, HorarioController.obtenerPorMecanico)
router.get("/fecha/:fecha", verifyToken, HorarioController.obtenerPorFecha)
router.get("/dia/:dia", verifyToken, HorarioController.obtenerPorDia)
router.get("/disponibilidad", verifyToken, HorarioController.verificarDisponibilidad)
router.get("/:id", verifyToken, HorarioController.obtener)

// Rutas protegidas (solo administradores)
router.post("/", verifyToken, authorizeRoles(1), HorarioController.crear)
router.put("/:id", verifyToken, authorizeRoles(1), HorarioController.actualizar)
router.delete("/:id", verifyToken, authorizeRoles(1), HorarioController.eliminar)

module.exports = router
