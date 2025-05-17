// src/routes/repuestoRoutes.js
const express = require('express');
const router = express.Router();
const RepuestoController = require('../controllers/repuestoController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, RepuestoController.listar);
router.get('/:id', verifyToken, RepuestoController.obtener);
router.post('/', verifyToken, authorizeRoles(1), RepuestoController.crear);
router.put('/:id', verifyToken, authorizeRoles(1), RepuestoController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles(1), RepuestoController.eliminar);

module.exports = router;