const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONDODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Base de datos UP');

    } catch (error) {
        console.log(error);
        throw new Error('Error en iniciar la BD');
    }
    
}

module.exports = {
    dbConnection
}