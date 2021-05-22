const express = require('express');
const app = new express();
const mongoose= require('mongoose');
const uri = "mongodb+srv://ale39:Alejandro39@up-art.5x5ah.mongodb.net/e-rent?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.once("open", function(){
    console.log("Conectado a la bd")
});

db.on("error", function(er){
    console.log("No se pudo conectar a la base de datos")
    console.log(er);
    app.get('/', function(req, res) {
        res.render('events/error');
    })
})
const homeController = require('./controllers/homeController');

app.use(express.json());
app.use(express.static('./public'));
app.use(express.static('./views'));
app.set('view engine', 'ejs');

//Rutas
homeController(app);

app.listen(3000,() => {

    console.log('SERVER RUN')
})