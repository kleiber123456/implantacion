// src/controllers/usuarioController.js
const UsuarioService = require('../services/usuarioService');

const UsuarioController = {
  async listar(req, res) {
    const usuarios = await UsuarioService.listar();
    res.json(usuarios);
  },

  async obtener(req, res) {
    const usuario = await UsuarioService.obtener(req.params.id);
    res.json(usuario);
  },

  async crear(req, res) {
    await UsuarioService.crear(req.body);
    res.json({ message: 'Usuario creado' });
  },

  async actualizar(req, res) {
    await UsuarioService.actualizar(req.params.id, req.body);
    res.json({ message: 'Usuario actualizado' });
  },

  async eliminar(req, res) {
    await UsuarioService.eliminar(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  },

  // Nuevo método para obtener el perfil del usuario autenticado
  async miPerfil(req, res) {
    try {
      // El ID del usuario se obtiene del token JWT decodificado
      const userId = req.user.id;
      const usuario = await UsuarioService.obtener(userId);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el perfil' });
    }
  },
  
  // Nuevo método para actualizar el perfil del usuario autenticado
  async actualizarMiPerfil(req, res) {
    try {
      // El ID del usuario se obtiene del token JWT decodificado
      const userId = req.user.id;
      await UsuarioService.actualizar(userId, req.body);
      
      // Obtener el usuario actualizado para devolverlo en la respuesta
      const usuarioActualizado = await UsuarioService.obtener(userId);
      
      res.json({ 
        message: 'Perfil actualizado correctamente',
        usuario: usuarioActualizado
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
  }
};

module.exports = UsuarioController;