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
            Register: '/api/auth/register (POST)',
            Enviarcodigo: '/api/usuarios/solicitar-codigo (POST)',
            verificarcodigo: '/api/usuarios/verificar-codigo (POST)',
            Actulizarpasword: '/api/usuarios/nueva-password (POST)',
            


        }
    });
});

module.exports = app;


