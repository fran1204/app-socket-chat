
const { Router } = require('express');
const { check } = require('express-validator');
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/productos
 */


// Obtener todos los productos - publico
router.get('/', obtenerProductos);

// Obtener producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar producto - privado - con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// eliminar un producto - privado - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto);



module.exports = router;
