const mongoose = require('mongoose');
const config = require('../config/development');

const DBUSER = config.DBUSER;
const DBPASSWORD = config.DBPASSWORD;
const DBURL = config.DBURL;
const PRODUCTION = config.PRODUCTION;

let MONGOOSE_CONNECTION_STRING = `mongodb+srv://${DBUSER}:${DBPASSWORD}@${DBURL}`;

if(PRODUCTION === 'false') {
    MONGOOSE_CONNECTION_STRING = 'mongodb://127.0.0.1:27017/e-rent'
}
console.log(MONGOOSE_CONNECTION_STRING)
module.exports = {
    connect: () => {
        mongoose.connect(MONGOOSE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
        
        const db = mongoose.connection;
        
        db.once("open", function(){
            console.log("Conectado a la bd")
        });
        
        db.on("error", function(er){
            console.log("No se pudo conectar a la base de datos")
            console.log(er);   
        })
    }
}