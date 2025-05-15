// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Nuevas rutas para gestión del perfil propio (solo requieren autenticación)
// IMPORTANTE: Estas rutas específicas deben ir ANTES de las rutas con parámetros /:id
router.get('/mi-perfil', verifyToken, UsuarioController.miPerfil);
router.put('/mi-perfil', verifyToken, UsuarioController.actualizarMiPerfil);

// Rutas de administración (requieren permisos específicos)
router.get('/', verifyToken, UsuarioController.listar);
router.get('/:id', verifyToken, UsuarioController.obtener);
router.post('/', verifyToken, authorizeRoles(1), UsuarioController.crear); // solo admin
router.put('/:id', verifyToken, UsuarioController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles(1), UsuarioController.eliminar); // solo admin

module.exports = router;