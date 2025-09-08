// src/routes/servicioRoutes.js
const express = require('express');
const router = express.Router();
const ServicioController = require('../controllers/servicioController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', ServicioController.listar);
router.get('/:id', ServicioController.obtener);
router.post('/', authorizeRoles(1), ServicioController.crear);
router.put('/:id', authorizeRoles(1), ServicioController.actualizar);
router.delete('/:id', authorizeRoles(1), ServicioController.eliminar);
router.put('/:id/cambiar-estado', authorizeRoles(1), ServicioController.cambiarEstado);

module.exports = router;
