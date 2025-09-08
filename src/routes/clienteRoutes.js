// src/routes/clienteRoutes.js
const express = require("express")
const router = express.Router()
const ClienteController = require("../controllers/clienteController")
const { authorizeRoles } = require("../middlewares/authMiddleware")

router.get("/", ClienteController.listar)
router.get("/:id", ClienteController.obtener)
router.post("/", authorizeRoles(1, 2), ClienteController.crear)
router.put("/:id", authorizeRoles(1, 2), ClienteController.actualizar)
router.put("/:id/cambiar-estado", authorizeRoles(1), ClienteController.cambiarEstado)
router.delete("/:id", authorizeRoles(1), ClienteController.eliminar)

module.exports = router
