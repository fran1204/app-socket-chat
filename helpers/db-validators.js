const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');

const esRoleValido = async(rol = '') => { 
    const existeRole = await Role.findOne({ rol });
    if (!existeRole) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async (correo = '') => {
    // Verficar si el usuario existe
    const existeEmail = await Usuario.findOne({ correo: correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado en la BD`);
    }
}


const existeUsuarioPorId = async (id) => {
    // Verficar si el usuario existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeCategoriaPorId = async (id) => {
    // Verficar si el usuario existe
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeProductoPorId = async (id) => {
    // Verficar si el usuario existe
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id ${id} no existe`);
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}










