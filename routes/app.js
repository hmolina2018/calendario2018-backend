var express = require('express');
var app = express();

//Rutas
//req es request - res es response
app.get('/', (req, res, next) => {

  res.status(200).json({
    ok: true,
    mensaje: 'Petición realizada correctamente.'

  });

});
module.exports = app;
