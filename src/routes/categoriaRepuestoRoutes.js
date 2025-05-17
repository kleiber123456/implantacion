// src/routes/categoriaRepuestoRoutes.js
const express = require('express');
const router = express.Router();
const CategoriaRepuestoController = require('../controllers/categoriaRepuestoController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, CategoriaRepuestoController.listar);
router.get('/:id', verifyToken, CategoriaRepuestoController.obtener);
router.post('/', verifyToken, authorizeRoles(1), CategoriaRepuestoController.crear);
router.put('/:id', verifyToken, authorizeRoles(1), CategoriaRepuestoController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles(1), CategoriaRepuestoController.eliminar);
router.put('/:id/cambiar-estado', verifyToken, authorizeRoles(1), CategoriaRepuestoController.cambiarEstado);

module.exports = router;