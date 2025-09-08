// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

// Nuevas rutas para gestión del perfil propio (solo requieren autenticación)
// IMPORTANTE: Estas rutas específicas deben ir ANTES de las rutas con parámetros /:id
router.get('/mi-perfil', UsuarioController.miPerfil);
router.put('/mi-perfil', UsuarioController.actualizarMiPerfil);

// Cambio de estado
router.put('/:id/cambiar-estado', authorizeRoles(1), UsuarioController.cambiarEstado);

// Rutas de administración (requieren permisos específicos)
router.get('/', UsuarioController.listar);
router.get('/:id', UsuarioController.obtener);
router.post('/', authorizeRoles(1), UsuarioController.crear); // solo admin
router.put('/:id', UsuarioController.actualizar);
router.delete('/:id', authorizeRoles(1), UsuarioController.eliminar); // solo admin

module.exports = router;