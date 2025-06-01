// src/controllers/marcaController.js
const MarcaService = require("../services/marcaService")

const MarcaController = {
  async listar(req, res) {
    try {
      const marcas = await MarcaService.listar()
      res.json(marcas)
    } catch (error) {
      res.status(500).json({ error: "Error al listar las marcas" })
    }
  },

  async obtener(req, res) {
    try {
      const marca = await MarcaService.obtener(req.params.id)
      if (!marca) {
        return res.status(404).json({ error: "Marca no encontrada" })
      }
      res.json(marca)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la marca" })
    }
  },

  async crear(req, res) {
    try {
      const id = await MarcaService.crear(req.body)
      res.status(201).json({ message: "Marca creada", id })
    } catch (error) {
      res.status(500).json({ error: "Error al crear la marca" })
    }
  },

  async actualizar(req, res) {
    try {
      await MarcaService.actualizar(req.params.id, req.body)
      res.json({ message: "Marca actualizada" })
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la marca" })
    }
  },

  async eliminar(req, res) {
    try {
      await MarcaService.eliminar(req.params.id)
      res.json({ message: "Marca eliminada" })
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la marca" })
    }
  },
}

module.exports = MarcaController
