const { response } = require("express");
const { isValidObjectId } = require("mongoose");

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => { 
    const esMongoID = isValidObjectId(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i'); //Insencible a minuscula y mayuscula

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    const countUsuarios = await Usuario.count({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        total: countUsuarios,
        results: usuarios
    });

};

const buscarCategorias = async (termino = '', res = response) => { 
    const esMongoID = isValidObjectId(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i'); //Insencible a minuscula y mayuscula

    const categorias = await Categoria.find({ nombre: regex , estado: true });

    const countCategorias = await Categoria.count({ nombre: regex , estado: true });

    res.json({
        total: countCategorias,
        results: categorias
    });

};

const buscarProductos = async (termino = '', res = response) => { 
    const esMongoID = isValidObjectId(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i'); //Insencible a minuscula y mayuscula

    const productos = await Producto.find({ nombre: regex , estado: true }).populate('categoria', 'nombre');

    const countProductos = await Producto.count({ nombre: regex , estado: true });

    res.json({
        total: countProductos,
        results: productos
    });

};

const buscar = (req, res = response) => { 

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            });
            break;
    }

}

module.exports = {
    buscar
}