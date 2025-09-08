// src/routes/vehiculoRoutes.js
const express = require("express")
const router = express.Router()
const VehiculoController = require("../controllers/vehiculoController")
const { authorizeRoles } = require("../middlewares/authMiddleware")

router.get("/", VehiculoController.listar)
router.get("/:id", VehiculoController.obtener)
router.get("/cliente/:clienteId", VehiculoController.obtenerPorCliente)
router.post("/", authorizeRoles(1, 2), VehiculoController.crear)
router.put("/:id", authorizeRoles(1, 2), VehiculoController.actualizar)
router.put("/:id/cambiar-estado", authorizeRoles(1), VehiculoController.cambiarEstado)
router.delete("/:id", authorizeRoles(1), VehiculoController.eliminar)

module.exports = router
