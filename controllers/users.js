const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    //?limit=4&desde=5
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    /*const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));
    
    const total = await Usuario.countDocuments(query);
    */

    // Ejecuta las dos promesas de manera simultánea pero no sigue hasta que no obtenga las dos respuestas.
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        usuarios    
    });
}

const usuariosPost = async (req, res = response) => {

    //JSON mandado por el Postman
    /*{
        "nombre": "Fran Rodriguez",
        "edad": 34,
        "id": 1234,
        "apellidos": "temita"
    }*/


    //const { nombre, edad } = req.body; // Destructuro el JSON de Postman y solo recojo estas dos propiedades
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    
    
    // Encriptar pass
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt);

    // Guardar en DB
    await usuario.save();


    /*res.json({
        msg: "post API - controlador",
        nombre,
        edad
    });*/


    res.json({
        //msg: "post API - controlador",
        usuario
    });


}

const usuariosPut = async(req, res = response) => {

    //const id = req.params.id;
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: Validar contra DB
    if (password) {
        // Encriptar pass
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        //msg: "put API - controlador - Update",
        usuario
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    //Borrar de la BD -  no es recomendable boorar de la bd por la integridad de los contenidos.
    //const usuario = await Usuario.findByIdAndDelete(id);
    
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAutenticado = req.usuario;
    
    res.json({
        usuario,
        usuarioAutenticado
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}





