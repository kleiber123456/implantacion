const express = require('express');
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Recuperación de contraseña por código
router.post('/solicitar-codigo', AuthController.solicitarCodigo);
router.post('/verificar-codigo', AuthController.verificarCodigo);
router.post('/nueva-password', AuthController.nuevaPassword);



// Ruta de prueba protegida
router.get('/protegido', (req, res) => {
  res.json({ mensaje: 'Acceso concedido', usuario: req.user });
});


module.exports = router;

