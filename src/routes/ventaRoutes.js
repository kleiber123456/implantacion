// src/routes/ventaRoutes.js
const express = require('express');
const router = express.Router();
const VentaController = require('../controllers/ventaController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, VentaController.listar);
router.get('/cliente/:clienteId', verifyToken, VentaController.obtenerPorCliente);
router.get('/estado/:estadoId', verifyToken, VentaController.obtenerPorEstado);
router.get('/rango', verifyToken, VentaController.obtenerPorRangoFechas);
router.get('/:id', verifyToken, VentaController.obtener);
router.post('/', verifyToken, authorizeRoles(1, 2), VentaController.crear);
router.put('/:id', verifyToken, authorizeRoles(1, 2), VentaController.actualizar);
router.put('/:id/cambiar-estado', verifyToken, authorizeRoles(1), VentaController.cambiarEstado);
router.delete('/:id', verifyToken, authorizeRoles(1), VentaController.eliminar);

module.exports = router;
