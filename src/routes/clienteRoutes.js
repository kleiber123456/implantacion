// src/routes/clienteRoutes.js
const express = require("express")
const router = express.Router()
const ClienteController = require("../controllers/clienteController")
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware")

router.get("/", verifyToken, ClienteController.listar)
router.get("/:id", verifyToken, ClienteController.obtener)
router.post("/", verifyToken, authorizeRoles(1, 2), ClienteController.crear)
router.put("/:id", verifyToken, authorizeRoles(1, 2), ClienteController.actualizar)
router.put("/:id/cambiar-estado", verifyToken, authorizeRoles(1), ClienteController.cambiarEstado)
router.delete("/:id", verifyToken, authorizeRoles(1), ClienteController.eliminar)

module.exports = router
