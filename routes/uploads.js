
const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImage } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/', validarArchivoSubir ,cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El Id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El Id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
],mostrarImage);

module.exports = router;