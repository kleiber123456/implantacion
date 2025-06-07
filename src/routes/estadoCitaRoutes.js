// src/routes/estadoCitaRoutes.js
const express = require('express');
const router = express.Router();
const EstadoCitaController = require('../controllers/estadoCitaController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, EstadoCitaController.listar);
router.get('/:id', verifyToken, EstadoCitaController.obtener);
router.post('/', verifyToken, authorizeRoles(1), EstadoCitaController.crear);
router.put('/:id', verifyToken, authorizeRoles(1), EstadoCitaController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles(1), EstadoCitaController.eliminar);

module.exports = router;
