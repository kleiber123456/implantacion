// src/routes/referenciaRoutes.js
const express = require("express")
const router = express.Router()
const ReferenciaController = require("../controllers/referenciaController")
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware")

router.get("/", verifyToken, ReferenciaController.listar)
router.get("/:id", verifyToken, ReferenciaController.obtener)
router.get("/marca/:marcaId", verifyToken, ReferenciaController.obtenerPorMarca)
router.post("/", verifyToken, authorizeRoles(1), ReferenciaController.crear)
router.put("/:id", verifyToken, authorizeRoles(1), ReferenciaController.actualizar)
router.delete("/:id", verifyToken, authorizeRoles(1), ReferenciaController.eliminar)

module.exports = router
