// src/controllers/vehiculoController.js
const VehiculoService = require("../services/vehiculoService")

const VehiculoController = {
  async listar(req, res) {
    try {
      const vehiculos = await VehiculoService.listar()
      res.json(vehiculos)
    } catch (error) {
      res.status(500).json({ error: "Error al listar los vehículos" })
    }
  },

  async obtener(req, res) {
    try {
      const vehiculo = await VehiculoService.obtener(req.params.id)
      if (!vehiculo) {
        return res.status(404).json({ error: "Vehículo no encontrado" })
      }
      res.json(vehiculo)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el vehículo" })
    }
  },

  async obtenerPorCliente(req, res) {
    try {
      const vehiculos = await VehiculoService.obtenerPorCliente(req.params.clienteId)
      res.json(vehiculos)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los vehículos del cliente" })
    }
  },

  async crear(req, res) {
    try {
      const id = await VehiculoService.crear(req.body)
      res.status(201).json({ message: "Vehículo creado", id })
    } catch (error) {
      res.status(500).json({ error: "Error al crear el vehículo" })
    }
  },

  async actualizar(req, res) {
    try {
      await VehiculoService.actualizar(req.params.id, req.body)
      res.json({ message: "Vehículo actualizado" })
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el vehículo" })
    }
  },

  async eliminar(req, res) {
    try {
      await VehiculoService.eliminar(req.params.id)
      res.json({ message: "Vehículo eliminado" })
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el vehículo" })
    }
  },

  async cambiarEstado(req, res) {
    try {
      const nuevoEstado = await VehiculoService.cambiarEstado(req.params.id)
      res.json({ message: `Estado actualizado a ${nuevoEstado}` })
    } catch (error) {
      res.status(500).json({ error: "Error al cambiar el estado del vehículo" })
    }
  },
}

module.exports = VehiculoController
