// src/app.js
const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/authRoutes")
const usuarioRoutes = require("./routes/usuarioRoutes")
const rolRoutes = require("./routes/rolRoutes")
const proveedorRoutes = require("./routes/proveedorRoutes")
const servicioRoutes = require("./routes/servicioRoutes")
const repuestoRoutes = require("./routes/repuestoRoutes")
const categoriaRepuestoRoutes = require("./routes/categoriaRepuestoRoutes")

const marcaRoutes = require("./routes/marcaRoutes")
const referenciaRoutes = require("./routes/referenciaRoutes")
const vehiculoRoutes = require("./routes/vehiculoRoutes")
const compraRoutes = require("./routes/compraRoutes")
const clienteRoutes = require("./routes/clienteRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const estadoVentaRoutes = require("./routes/estadoVentaRoutes")
const estadoCitaRoutes = require("./routes/estadoCitaRoutes")
const horarioRoutes = require("./routes/horarioRoutes")
const mecanicoRoutes = require("./routes/mecanicoRoutes")
const ventaRoutes = require("./routes/ventaRoutes")
const citaRoutes = require("./routes/citaRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/roles", rolRoutes)
app.use("/api/proveedores", proveedorRoutes)
app.use("/api/servicios", servicioRoutes)
app.use("/api/repuestos", repuestoRoutes)
app.use("/api/categorias-repuestos", categoriaRepuestoRoutes)

app.use("/api/marcas", marcaRoutes)
app.use("/api/referencias", referenciaRoutes)
app.use("/api/vehiculos", vehiculoRoutes)
app.use("/api/compras", compraRoutes)
app.use("/api/clientes", clienteRoutes)
app.use("/api/dashboard", dashboardRoutes)

app.use("/api/estados-venta", estadoVentaRoutes)
app.use("/api/estados-cita", estadoCitaRoutes)
app.use("/api/horarios", horarioRoutes)
app.use("/api/mecanicos", mecanicoRoutes)
app.use("/api/ventas", ventaRoutes)
app.use("/api/citas", citaRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API del Taller MotOrtega",
    version: "2.0.0 - Sistema de horarios por días",
    endpoints: {
      // Autenticación
      login: "/api/auth/login (POST)",
      register: "/api/auth/register (POST)",
      enviarCodigo: "/api/auth/solicitar-codigo (POST)",
      verificarCodigo: "/api/auth/verificar-codigo (POST)",
      actualizarPassword: "/api/auth/nueva-password (POST)",

      // Perfil de usuario
      miPerfil: "/api/usuarios/mi-perfil (GET/PUT)",

      // Cambios de estado
      cambiarEstadoUsuario: "/api/usuarios/:id/cambiar-estado (PUT)",
      cambiarEstadoProveedor: "/api/proveedores/:id/cambiar-estado (PUT)",
      cambiarEstadoServicio: "/api/servicios/:id/cambiar-estado (PUT)",
      cambiarEstadoRepuesto: "/api/repuestos/:id/cambiar-estado (PUT)",
      cambiarEstadoCategoriaRepuesto: "/api/categorias-repuestos/:id/cambiar-estado (PUT)",

      // CRUD básico
      proveedores: "/api/proveedores",
      servicios: "/api/servicios",
      roles: "/api/roles",
      usuarios: "/api/usuarios",
      repuestos: "/api/repuestos",
      categoriasRepuestos: "/api/categorias-repuestos",
      clientes: "/api/clientes",
      marcas: "/api/marcas",
      referencias: "/api/referencias",
      vehiculos: "/api/vehiculos",
      compras: "/api/compras",

      // Consultas específicas
      referenciasPorMarca: "/api/referencias/marca/:marcaId (GET)",
      vehiculosPorCliente: "/api/vehiculos/cliente/:clienteId (GET)",
      cambiarEstadoVehiculo: "/api/vehiculos/:id/cambiar-estado (PUT)",
      cambiarEstadoCompra: "/api/compras/:id/cambiar-estado (PUT)",

      // Dashboard
      dashboard: "/api/dashboard",
      estadisticas: "/api/dashboard/estadisticas (GET)",
      serviciosActivos: "/api/dashboard/servicios-activos (GET)",
      repuestosBajoStock: "/api/dashboard/repuestos-bajo-stock (GET)",
      comprasRecientes: "/api/dashboard/compras-recientes (GET)",

      // Estados
      estadosVenta: "/api/estados-venta",
      estadosCita: "/api/estados-cita",

      // HORARIOS - NUEVO SISTEMA POR DÍAS
      horarios: "/api/horarios (GET/POST)",
      horariosTrabajo: "/api/horarios/trabajo (GET) - Lunes a Sábado",
      horarioPorDia: "/api/horarios/dia/:dia (GET) - Ej: /api/horarios/dia/Lunes",
      inicializarHorarios: "/api/horarios/inicializar (POST) - Crear horarios estándar",

      // Mecánicos
      mecanicos: "/api/mecanicos",
      mecanicosPorEstado: "/api/mecanicos/estado/:estado (GET)",
      cambiarEstadoMecanico: "/api/mecanicos/:id/cambiar-estado (PUT)",

      // Ventas
      ventas: "/api/ventas",
      ventasPorCliente: "/api/ventas/cliente/:clienteId (GET)",
      ventasPorEstado: "/api/ventas/estado/:estadoId (GET)",
      ventasPorRango: "/api/ventas/rango?fechaInicio=&fechaFin= (GET)",
      cambiarEstadoVenta: "/api/ventas/:id/cambiar-estado (PUT)",

      // CITAS - ACTUALIZADO PARA DÍAS DE TRABAJO
      citas: "/api/citas",
      citasPorCliente: "/api/citas/cliente/:clienteId (GET)",
      citasPorMecanico: "/api/citas/mecanico/:mecanicoId (GET)",
      citasPorFecha: "/api/citas/fecha/:fecha (GET)",
      citasPorEstado: "/api/citas/estado/:estadoId (GET)",
      disponibilidadMecanicos: "/api/citas/disponibilidad/mecanicos?fecha=&hora= (GET)",
      cambiarEstadoCita: "/api/citas/:id/cambiar-estado (PUT)",
    },
    horariosTrabajo: {
      dias: "Lunes a Sábado",
      horario: "8:00 AM - 6:00 PM",
      noDisponible: "Domingos",
    },
  })
})

module.exports = app

