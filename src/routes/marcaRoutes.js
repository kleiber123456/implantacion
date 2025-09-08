// src/routes/marcaRoutes.js
const express = require("express")
const router = express.Router()
const MarcaController = require("../controllers/marcaController")
const { authorizeRoles } = require("../middlewares/authMiddleware")

router.get("/", MarcaController.listar)
router.get("/:id", MarcaController.obtener)
router.post("/", authorizeRoles(1), MarcaController.crear)
router.put("/:id", authorizeRoles(1), MarcaController.actualizar)
router.delete("/:id", authorizeRoles(1), MarcaController.eliminar)

module.exports = router
