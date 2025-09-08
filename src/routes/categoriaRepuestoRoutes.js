// src/routes/categoriaRepuestoRoutes.js
const express = require('express');
const router = express.Router();
const CategoriaRepuestoController = require('../controllers/categoriaRepuestoController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', CategoriaRepuestoController.listar);
router.get('/:id', CategoriaRepuestoController.obtener);
router.post('/', authorizeRoles(1), CategoriaRepuestoController.crear);
router.put('/:id', authorizeRoles(1), CategoriaRepuestoController.actualizar);
router.delete('/:id', authorizeRoles(1), CategoriaRepuestoController.eliminar);
router.put('/:id/cambiar-estado', authorizeRoles(1), CategoriaRepuestoController.cambiarEstado);

module.exports = router;