// src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const rolRoutes = require('./routes/rolRoutes');


const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);


app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la API del Taller MotOrtega',
        endpoints: {
            roles: '/api/roles',
            usuarios: '/api/usuarios',
            login: '/api/auth/login (POST)',
            register: '/api/auth/register (POST)',
            miPerfil: '/api/usuarios/mi-perfil (GET/PUT)',
            enviarCodigo: '/api/auth/solicitar-codigo (POST)',
            verificarCodigo: '/api/auth/verificar-codigo (POST)',
            actualizarPassword: '/api/auth/nueva-password (POST)',
            cambiarEstadoUsuario: '/api/usuarios/:id/cambiar-estado (PUT)',
        }
    });
});

module.exports = app;

