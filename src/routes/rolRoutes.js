// src/routes/rolRoutes.js
const express = require('express');
const router = express.Router();
const RolController = require('../controllers/rolController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', RolController.listar);
router.get('/:id', RolController.obtener);
router.post('/', authorizeRoles(1), RolController.crear);
router.put('/:id', authorizeRoles(1), RolController.actualizar);
router.put('/:id/cambiar-estado', authorizeRoles(1), RolController.cambiarEstado);
router.delete('/:id', authorizeRoles(1), RolController.eliminar);

module.exports = router;
