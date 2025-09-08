// src/routes/dashboardRoutes.js
const express = require("express")
const router = express.Router()
const DashboardController = require("../controllers/dashboardController")
const { verifyToken } = require("../middlewares/authMiddleware")

// Todas las rutas del dashboard requieren autenticación
router.get("/estadisticas", DashboardController.getEstadisticas)

// Datos básicos
router.get("/servicios-activos", DashboardController.getServiciosActivos)
router.get("/repuestos-bajo-stock", DashboardController.getRepuestosBajoStock)

// ============ NUEVO: REPUESTOS CRÍTICOS ============
router.get("/repuestos-criticos", DashboardController.getRepuestosCriticos)

router.get("/compras-recientes", DashboardController.getComprasRecientes)
router.get("/ventas-recientes", DashboardController.getVentasRecientes)

// Citas
router.get("/citas-hoy", DashboardController.getCitasHoy)
router.get("/citas-proxima-semana", DashboardController.getCitasProximasSemana)

// Top rankings
router.get("/top-servicios", DashboardController.getTopServicios)
router.get("/top-repuestos", DashboardController.getTopRepuestos)
router.get("/mecanicos-activos", DashboardController.getMecanicosActivos)
router.get("/clientes-frecuentes", DashboardController.getClientesFrecuentes)

// Tendencias
router.get("/tendencias-ventas", DashboardController.getTendenciasVentas)
router.get("/tendencias-citas", DashboardController.getTendenciasCitas)
router.get("/tendencias-compras", DashboardController.getTendenciasCompras)

module.exports = router