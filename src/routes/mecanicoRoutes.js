// src/routes/mecanicoRoutes.js
const express = require('express');
const router = express.Router();
const MecanicoController = require('../controllers/mecanicoController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, MecanicoController.listar);
router.get('/estado/:estado', verifyToken, MecanicoController.obtenerPorEstado);
router.get('/:id', verifyToken, MecanicoController.obtener);
router.post('/', verifyToken, authorizeRoles(1), MecanicoController.crear);
router.put('/:id', verifyToken, authorizeRoles(1, 3), MecanicoController.actualizar);
router.put('/:id/cambiar-estado', verifyToken, authorizeRoles(1), MecanicoController.cambiarEstado);
router.delete('/:id', verifyToken, authorizeRoles(1), MecanicoController.eliminar);

module.exports = router;
