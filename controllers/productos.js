const { response, request } = require("express");
const { Producto } = require('../models');


const obtenerProductos = async(req = request, res = response) => {

    //?limit=4&desde=5
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // Ejecuta las dos promesas de manera simultánea pero no sigue hasta que no obtenga las dos respuestas.
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        productos    
    });
}


const obtenerProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    
    res.json(producto);
}


const crearProducto = async(req, res = response) => {
    
    const { estado, usuario, ...body } = req.body;
    
    const nombre = body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    //Generar data para guardar
    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async(req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    
    res.json(producto);

}

const borrarProducto = async(req, res = response) => {

    const { id } = req.params;
    
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, {new: true});
        
    res.json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}