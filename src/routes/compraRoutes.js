// src/routes/compraRoutes.js
const express = require("express")
const router = express.Router()
const CompraController = require("../controllers/compraController")
const { authorizeRoles } = require("../middlewares/authMiddleware")

router.get("/", CompraController.listar)
router.get("/:id", CompraController.obtener)
router.post("/", authorizeRoles(1), CompraController.crear)
router.put("/:id", authorizeRoles(1), CompraController.actualizar)
router.put("/:id/cambiar-estado", authorizeRoles(1), CompraController.cambiarEstado)
router.delete("/:id", authorizeRoles(1), CompraController.eliminar)

module.exports = router
