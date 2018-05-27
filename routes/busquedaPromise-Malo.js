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

  buscarEventos (busqueda,regex)
              .then(eventos => {
                res.status(200).json({
                  ok: true,
                  eventos:eventos
                });
              });
});

function buscarEventos( busqueda, regex ){

  return new Promise((resolve, reject) =>{

    Eventos.find ({ nombre: regex },(err, eventos) => {

      if (err) {
        reject ('Error al cargar Eventos',err);
      }else{
        resolve(eventos)
      }

    });
  });
}
module.exports = app;
