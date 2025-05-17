// src/services/proveedorService.js
const ProveedorModel = require('../models/proveedorModel');

const ProveedorService = {
  listar: () => ProveedorModel.findAll(),
  obtener: (id) => ProveedorModel.findById(id),
  crear: (data) => ProveedorModel.create(data),
  actualizar: (id, data) => ProveedorModel.update(id, data),
  eliminar: (id) => ProveedorModel.delete(id),
  
  async cambiarEstado(id) {
  const proveedor = await ProveedorModel.findById(id);
  if (!proveedor) throw new Error('Proveedor no encontrado');
  const nuevoEstado = proveedor.estado === 'Activo' ? 'Inactivo' : 'Activo';
  await ProveedorModel.cambiarEstado(id, nuevoEstado);
  return nuevoEstado;
}

};

module.exports = ProveedorService;
