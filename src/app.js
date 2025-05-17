// src/app.js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const rolRoutes = require('./routes/rolRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const repuestoRoutes = require('./routes/repuestoRoutes');
const categoriaRepuestoRoutes = require('./routes/categoriaRepuestoRoutes');


const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/repuestos', repuestoRoutes);
app.use('/api/categorias-repuestos', categoriaRepuestoRoutes);



app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la API del Taller MotOrtega',
        endpoints: {
            login: '/api/auth/login (POST)',
            register: '/api/auth/register (POST)',
            enviarCodigo: '/api/auth/solicitar-codigo (POST)',
            verificarCodigo: '/api/auth/verificar-codigo (POST)',
            actualizarPassword: '/api/auth/nueva-password (POST)',

            miPerfil: '/api/usuarios/mi-perfil (GET/PUT)',


            cambiarEstadoUsuario: '/api/usuarios/:id/cambiar-estado (PUT)',
            cambiarEstadoProveedor: '/api/proveedores/:id/cambiar-estado (PUT)',
            cambiarEstadoServicio: '/api/servicios/:id/cambiar-estado (PUT)',
            cambiarEstadoRepuesto: '/api/repuestos/:id/cambiar-estado (PUT)',
            cambiarEstadoCategoriaRepuesto: '/api/categorias-repuestos/:id/cambiar-estado (PUT)',

            proveedores: '/api/proveedores',
            servicios: '/api/servicios',
            roles: '/api/roles',
            usuarios: '/api/usuarios',
            repuestos: '/api/repuestos',
            categoriasRepuestos: '/api/categorias-repuestos',
            
            
        }
    });
});

module.exports = app;

