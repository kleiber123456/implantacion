// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Todas las rutas del dashboard requieren autenticación
router.get('/estadisticas', verifyToken, DashboardController.getEstadisticas);
router.get('/servicios-activos', verifyToken, DashboardController.getServiciosActivos);
router.get('/repuestos-bajo-stock', verifyToken, DashboardController.getRepuestosBajoStock);
router.get('/compras-recientes', verifyToken, DashboardController.getComprasRecientes);

module.exports = router;
