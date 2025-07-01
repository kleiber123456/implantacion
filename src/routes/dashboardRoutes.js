// src/routes/dashboardRoutes.js
const express = require("express")
const router = express.Router()
const DashboardController = require("../controllers/dashboardController")
const { verifyToken } = require("../middlewares/authMiddleware")

// Todas las rutas del dashboard requieren autenticación
router.get("/estadisticas", verifyToken, DashboardController.getEstadisticas)

// Datos básicos
router.get("/servicios-activos", verifyToken, DashboardController.getServiciosActivos)
router.get("/repuestos-bajo-stock", verifyToken, DashboardController.getRepuestosBajoStock)
router.get("/compras-recientes", verifyToken, DashboardController.getComprasRecientes)
router.get("/ventas-recientes", verifyToken, DashboardController.getVentasRecientes)

// Citas
router.get("/citas-hoy", verifyToken, DashboardController.getCitasHoy)
router.get("/citas-proxima-semana", verifyToken, DashboardController.getCitasProximasSemana)

// Top rankings
router.get("/top-servicios", verifyToken, DashboardController.getTopServicios)
router.get("/top-repuestos", verifyToken, DashboardController.getTopRepuestos)
router.get("/mecanicos-activos", verifyToken, DashboardController.getMecanicosActivos)
router.get("/clientes-frecuentes", verifyToken, DashboardController.getClientesFrecuentes)

// Tendencias
router.get("/tendencias-ventas", verifyToken, DashboardController.getTendenciasVentas)
router.get("/tendencias-citas", verifyToken, DashboardController.getTendenciasCitas)
router.get("/tendencias-compras", verifyToken, DashboardController.getTendenciasCompras)

module.exports = router
