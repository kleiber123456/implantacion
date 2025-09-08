// src/controllers/usuarioController.js
const UsuarioService = require('../services/usuarioService');

const UsuarioController = {
  async listar(req, res) {
    try {
      const usuarios = await UsuarioService.listar();
      res.json(usuarios);
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      res.status(500).json({ error: 'Error al obtener la lista de usuarios.' });
    }
  },

  async obtener(req, res) {
    try {
      const usuario = await UsuarioService.obtener(req.params.id);
      res.json(usuario);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error al obtener el usuario.' });
    }
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
  },

  async cambiarEstado(req, res) {
    try {
      const id = req.params.id;
      const nuevoEstado = await UsuarioService.cambiarEstado(id);
      res.json({ message: `Estado actualizado a ${nuevoEstado}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
    }
  }
};


module.exports = UsuarioController;