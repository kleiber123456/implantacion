// src/routes/servicioRoutes.js
const express = require('express');
const router = express.Router();
const ServicioController = require('../controllers/servicioController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, ServicioController.listar);
router.get('/:id', verifyToken, ServicioController.obtener);
router.post('/', verifyToken, authorizeRoles(1), ServicioController.crear);
router.put('/:id', verifyToken, authorizeRoles(1), ServicioController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles(1), ServicioController.eliminar);
router.put('/:id/cambiar-estado', verifyToken, authorizeRoles(1), ServicioController.cambiarEstado);

module.exports = router;
