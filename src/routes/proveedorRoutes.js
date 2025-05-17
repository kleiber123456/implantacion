// src/routes/proveedorRoutes.js
const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/proveedorController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// CRUD completo
router.get('/', verifyToken, ProveedorController.listar);
router.get('/:id', verifyToken, ProveedorController.obtener);
router.post('/', verifyToken, authorizeRoles(1), ProveedorController.crear);
router.put('/:id', verifyToken, authorizeRoles(1), ProveedorController.actualizar);
router.put('/:id/cambiar-estado', verifyToken, authorizeRoles(1), ProveedorController.cambiarEstado);
router.delete('/:id', verifyToken, authorizeRoles(1), ProveedorController.eliminar);

module.exports = router;
