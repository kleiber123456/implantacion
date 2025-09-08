// src/routes/estadoVentaRoutes.js
const express = require('express');
const router = express.Router();
const EstadoVentaController = require('../controllers/estadoVentaController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', EstadoVentaController.listar);
router.get('/:id', EstadoVentaController.obtener);
router.post('/', authorizeRoles(1), EstadoVentaController.crear);
router.put('/:id', authorizeRoles(1), EstadoVentaController.actualizar);
router.delete('/:id', authorizeRoles(1), EstadoVentaController.eliminar);

module.exports = router;
