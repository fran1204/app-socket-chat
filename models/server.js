const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');


class Server { 

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            usuarios:   '/api/usuarios',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads'
        };
  

        // Conectar a BD
        this.connectDB();

        // Middlewares - Funcion que se ejecuta siempre que se levante el servidor
        this.middlewares();

        // Rutas de mi app
        this.routes();

        // Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        // Parseo y lectura del Body
        this.app.use(express.json());

        // Servir directorio publico, use() es el middleware
        this.app.use(express.static('public')); //si encuentra el index.html ese será la home.

        // Manejar carga de archivo
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        // Esta es la ruta que hay que llamar del endpoint /api/usuarios
        this.app.use(this.paths.usuarios, require('../routes/users'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {

        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port);
        });
    }
}

module.exports = Server;