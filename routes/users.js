
const { Router } = require('express');
const { check } = require('express-validator');

/*const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');*/
// Todo lo anterior se puede unir en la siguiente const gracias al index.js dentro del middlewares.
const { 
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete } = require('../controllers/users');



const router = Router();

//res.status(403).json(); Devuelve el status 403 Forbbiden No authenticate
router.get('/', usuariosGet); // va por URL

// Actualizar info
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
],usuariosPut);

// Crear un registo.
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    //check('rol').custom((rol) => esRoleValido(rol)), Como lo que se le envia se llama igual (rol) se puede eliminar
    check('rol').custom(esRoleValido),
    validarCampos
],usuariosPost);

// Eliminar un registo.
router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);



module.exports = router;



