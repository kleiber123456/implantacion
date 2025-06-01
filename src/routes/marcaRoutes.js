// src/routes/marcaRoutes.js
const express = require("express")
const router = express.Router()
const MarcaController = require("../controllers/marcaController")
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware")

router.get("/", verifyToken, MarcaController.listar)
router.get("/:id", verifyToken, MarcaController.obtener)
router.post("/", verifyToken, authorizeRoles(1), MarcaController.crear)
router.put("/:id", verifyToken, authorizeRoles(1), MarcaController.actualizar)
router.delete("/:id", verifyToken, authorizeRoles(1), MarcaController.eliminar)

module.exports = router
