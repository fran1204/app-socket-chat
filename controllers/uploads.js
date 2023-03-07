const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const path = require('path');
const fs = require('fs');


/**
 * Subir imagen
 * 
 * @param {Request} req 
 * @param {response} res 
 */
const cargarArchivo = async(req, res = response) => { 

  try {
    //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
    const nombre = await subirArchivo(req.files, undefined, 'img');  
    res.json({ nombre });
    
  } catch (msg) {
    res.status(400).json({
      msg
    })
  }
  
}

/**
 * Actualizar imagen 
 *
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      
      break;
    
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
        
      break;
  
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }


  // Comprobar si existe ya una imagen previa para borrarla del servidor
  if (modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }


  const nombre = await subirArchivo(req.files, undefined, coleccion); 
  modelo.img = nombre;

  await modelo.save();


  res.json(modelo);
}

const mostrarImage = async(req, res = response) => {
  const { id, coleccion } = req.params;
  
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      
      break;
    
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
        
      break;
  
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }


  // Comprobar si existe ya una imagen previa para borrarla del servidor
  if (modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }
  
  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
  if (fs.existsSync(pathImagen)) {
     return res.sendFile(pathImagen);
  }
  
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImage
}