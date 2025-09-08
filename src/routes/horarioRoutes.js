// src/routes/horarioRoutes.js
const express = require("express")
const router = express.Router()
const HorarioController = require("../controllers/horarioController")
const { authorizeRoles } = require("../middlewares/authMiddleware")

// Rutas públicas (requieren autenticación pero no roles específicos)
router.get("/", HorarioController.listar)
router.get("/mecanico/:mecanicoId", HorarioController.obtenerPorMecanico)
router.get("/fecha/:fecha", HorarioController.obtenerPorFecha)
router.get("/dia/:dia", HorarioController.obtenerPorDia)
router.get("/disponibilidad", HorarioController.verificarDisponibilidad)
router.get("/:id", HorarioController.obtener)

// Rutas protegidas (solo administradores)
router.post("/", authorizeRoles(1), HorarioController.crear)
router.put("/:id", authorizeRoles(1), HorarioController.actualizar)
router.delete("/:id", authorizeRoles(1), HorarioController.eliminar)

module.exports = router
