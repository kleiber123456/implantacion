// src/routes/estadoVentaRoutes.js
const express = require('express');
const router = express.Router();
const EstadoVentaController = require('../controllers/estadoVentaController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, EstadoVentaController.listar);
router.get('/:id', verifyToken, EstadoVentaController.obtener);
router.post('/', verifyToken, authorizeRoles(1), EstadoVentaController.crear);
router.put('/:id', verifyToken, authorizeRoles(1), EstadoVentaController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles(1), EstadoVentaController.eliminar);

module.exports = router;
