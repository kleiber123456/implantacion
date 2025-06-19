// src/routes/rolRoutes.js
const express = require('express');
const router = express.Router();
const RolController = require('../controllers/rolController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, RolController.listar);
router.get('/:id', verifyToken, RolController.obtener);
router.post('/', verifyToken, authorizeRoles(1), RolController.crear);
router.put('/:id', verifyToken, authorizeRoles(1), RolController.actualizar);
router.put('/:id/cambiar-estado', verifyToken, authorizeRoles(1), RolController.cambiarEstado);
router.delete('/:id', verifyToken, authorizeRoles(1), RolController.eliminar);

module.exports = router;
