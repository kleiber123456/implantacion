// src/routes/referenciaRoutes.js
const express = require("express")
const router = express.Router()
const ReferenciaController = require("../controllers/referenciaController")
const { authorizeRoles } = require("../middlewares/authMiddleware")

router.get("/", ReferenciaController.listar)
router.get("/:id", ReferenciaController.obtener)
router.get("/marca/:marcaId", ReferenciaController.obtenerPorMarca)
router.post("/", authorizeRoles(1), ReferenciaController.crear)
router.put("/:id", authorizeRoles(1), ReferenciaController.actualizar)
router.delete("/:id", authorizeRoles(1), ReferenciaController.eliminar)

module.exports = router
