// src/controllers/referenciaController.js
const ReferenciaService = require("../services/referenciaService")

const ReferenciaController = {
  async listar(req, res) {
    try {
      const referencias = await ReferenciaService.listar()
      res.json(referencias)
    } catch (error) {
      res.status(500).json({ error: "Error al listar las referencias" })
    }
  },

  async obtener(req, res) {
    try {
      const referencia = await ReferenciaService.obtener(req.params.id)
      if (!referencia) {
        return res.status(404).json({ error: "Referencia no encontrada" })
      }
      res.json(referencia)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la referencia" })
    }
  },

  async obtenerPorMarca(req, res) {
    try {
      const referencias = await ReferenciaService.obtenerPorMarca(req.params.marcaId)
      res.json(referencias)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las referencias por marca" })
    }
  },

  async crear(req, res) {
    try {
      const id = await ReferenciaService.crear(req.body)
      res.status(201).json({ message: "Referencia creada", id })
    } catch (error) {
      res.status(500).json({ error: "Error al crear la referencia" })
    }
  },

  async actualizar(req, res) {
    try {
      await ReferenciaService.actualizar(req.params.id, req.body)
      res.json({ message: "Referencia actualizada" })
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la referencia" })
    }
  },

  async eliminar(req, res) {
    try {
      await ReferenciaService.eliminar(req.params.id)
      res.json({ message: "Referencia eliminada" })
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la referencia" })
    }
  },
}

module.exports = ReferenciaController
