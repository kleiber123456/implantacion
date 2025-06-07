// src/routes/horarioRoutes.js
const express = require('express');
const router = express.Router();
const HorarioController = require('../controllers/horarioController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, HorarioController.listar);
router.get('/fecha/:fecha', verifyToken, HorarioController.obtenerPorFecha);
router.get('/rango', verifyToken, HorarioController.obtenerPorRangoFechas);
router.get('/:id', verifyToken, HorarioController.obtener);
router.post('/', verifyToken, authorizeRoles(1), HorarioController.crear);
router.put('/:id', verifyToken, authorizeRoles(1), HorarioController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles(1), HorarioController.eliminar);

module.exports = router;