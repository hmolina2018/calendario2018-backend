
// Requires - importación de librerias para hacer funcionar algo.
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//inicializar variables - Acá ocuparemos la libreria express

var app = express();

//Body Parser npm install body-parser --save
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// importar rutas - la ruta para la mongodb
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');



//Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/calendarioadm', (err, res)=>{
  if (err) throw err;
  console.log ('Base de datos puerto 27017: \x1b[32m%s \x1b[0m', 'online');
})

// rutas

// ruta secundaria, necesario cargarla primero que el principal
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
//ruta principal
app.use('/', appRoutes);



//Escuchar peticiones

app.listen(3000, ()=>{
  console.log ('Express server puerto 3000: \x1b[32m%s \x1b[0m', 'online');
})
