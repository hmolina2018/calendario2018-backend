var express = require('express');
var app = express();

var Evento = require('../models/evento')

//Rutas
//req es request - res es response
app.get('/todo/:busqueda', (req, res, next) => {

  var busqueda = req.params.busqueda;
  //expresion regular para busquedas que no sea keysensityve
  //'i' es para que sea indiferente
  var regex = new RegExp (busqueda, 'i');

  Evento.find({ nombre: regex},(err, eventos) => {

    res.status(200).json({
      ok: true,
      eventos:eventos

    });
  });
});


module.exports = app;
