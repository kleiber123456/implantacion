// src/routes/proveedorRoutes.js
const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/proveedorController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

// CRUD completo
router.get('/', ProveedorController.listar);
router.get('/:id', ProveedorController.obtener);
router.post('/', authorizeRoles(1), ProveedorController.crear);
router.put('/:id', authorizeRoles(1), ProveedorController.actualizar);
router.put('/:id/cambiar-estado', authorizeRoles(1), ProveedorController.cambiarEstado);
router.delete('/:id', authorizeRoles(1), ProveedorController.eliminar);

module.exports = router;
