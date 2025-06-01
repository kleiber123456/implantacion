// src/routes/compraRoutes.js
const express = require("express")
const router = express.Router()
const CompraController = require("../controllers/compraController")
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware")

router.get("/", verifyToken, CompraController.listar)
router.get("/:id", verifyToken, CompraController.obtener)
router.post("/", verifyToken, authorizeRoles(1), CompraController.crear)
router.put("/:id", verifyToken, authorizeRoles(1), CompraController.actualizar)
router.put("/:id/cambiar-estado", verifyToken, authorizeRoles(1), CompraController.cambiarEstado)
router.delete("/:id", verifyToken, authorizeRoles(1), CompraController.eliminar)

module.exports = router
