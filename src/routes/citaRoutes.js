// src/routes/citaRoutes.js
const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/citaController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, CitaController.listar);
router.get('/cliente/:clienteId', verifyToken, CitaController.obtenerPorCliente);
router.get('/mecanico/:mecanicoId', verifyToken, CitaController.obtenerPorMecanico);
router.get('/fecha/:fecha', verifyToken, CitaController.obtenerPorFecha);
router.get('/estado/:estadoId', verifyToken, CitaController.obtenerPorEstado);
router.get('/disponibilidad/mecanicos', verifyToken, CitaController.obtenerDisponibilidadMecanicos);
router.get('/:id', verifyToken, CitaController.obtener);
router.post('/', verifyToken, authorizeRoles(1, 2, 3), CitaController.crear);
router.put('/:id', verifyToken, authorizeRoles(1, 2, 3), CitaController.actualizar);
router.put('/:id/cambiar-estado', verifyToken, authorizeRoles(1, 3), CitaController.cambiarEstado);
router.delete('/:id', verifyToken, authorizeRoles(1), CitaController.eliminar);

module.exports = router;
