const { Socket } = require("socket.io")
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

// se pone el new Socket solo para dev en pro se quita
const socketController = async(socket = new Socket(), io) => {

//    socket.log('Cliente conectado', socket.id)
    const token = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);

    if (!usuario) {
        return socket.disconnect();
    }

    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10); //Para que al entrar un usuario nuevo le salgan los mensajes.

    // Conectar a sala no genérica
    socket.join(usuario.id);

    // Limpiar cuando se desconecta
    socket.on('disconnect', () => { 
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })
    
    socket.on('enviar-mensaje', ({ mensaje, uid }) => { 

        if (uid) {
            //mensaje privado
            socket.to(uid).emit('mensajes-privado', { de: usuario.nombre, mensaje });

        }
        else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }

    });
}

module.exports = {
    socketController
}

