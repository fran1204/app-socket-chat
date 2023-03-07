const { response, request } = require("express");
const { Categoria } = require('../models');


const obtenerCategorias = async(req = request, res = response) => {

    //?limit=4&desde=5
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // Ejecuta las dos promesas de manera simultánea pero no sigue hasta que no obtenga las dos respuestas.
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        categorias    
    });
}


const obtenerCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    
    res.json(categoria);
}



const crearCategoria = async(req, res = response) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }


    //Generar data para guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

const actualizarCategoria = async(req, res = response) => {

    //const id = req.params.id;
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    
    res.json(categoria);

}

const borrarCategoria = async(req, res = response) => {

    const { id } = req.params;
    
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true});
        
    res.json(categoria);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}