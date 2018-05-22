
// Requires - importación de librerias para hacer funcionar algo.
var express = require('express');
var mongoose = require('mongoose');

//inicializar variables - Acá ocuparemos la libreria express
var app = express();


//Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/calendarioadm', (err, res)=>{
  if (err) throw err;
  console.log ('Base de datos puerto 27017: \x1b[32m%s \x1b[0m', 'online');
})

//Rutas
//req es request - res es response
app.get('/', (req, res, next) => {

  res.status(200).json({
    ok: true,
    mensaje: 'Petición realizada correctamente.'

  });

});

//Escuchar peticiones

app.listen(3000, ()=>{
  console.log ('Express server puerto 3000: \x1b[32m%s \x1b[0m', 'online');
})
