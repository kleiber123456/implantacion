// src/routes/estadoCitaRoutes.js
const express = require('express');
const router = express.Router();
const EstadoCitaController = require('../controllers/estadoCitaController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', EstadoCitaController.listar);
router.get('/:id', EstadoCitaController.obtener);
router.post('/', authorizeRoles(1), EstadoCitaController.crear);
router.put('/:id', authorizeRoles(1), EstadoCitaController.actualizar);
router.delete('/:id', authorizeRoles(1), EstadoCitaController.eliminar);

module.exports = router;
