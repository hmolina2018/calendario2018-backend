var express = require('express');

//https://github.com/dcodeIO/bcrypt.js/blob/master/README.md
//Problemas con bcrypt choca con moongoose validator
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//rescata SEED desde el archivo config/config.js
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');


app.post('/', (req, res) =>{

  var body = req.body;

  Usuario.findOne({email: body.email}, (err, usuarioDB) => {

    if ( err ) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar usuarios',
          errors: err
        });

      }

      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Credenciales incorrectas - email', // - email es para saber donde esta el error, en PROD se quita
          errors: err
        });

      }

      if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Credenciales incorrectas - password', // - password es para saber donde esta el error, en PROD se quita
          //con eso das pistas de lo que falla en el login.
          errors: err
        });
      }

      //Ofusca PASSWORD
      usuarioDB.password = ':)';

      //Crear Token
      var token = jwt.sign({usuario: usuarioDB}, SEED,{expiresIn: 14400}) //4 horas

      res.status(200).json({
        ok: true,
        usuario : usuarioDB,
        token: token,
        id: usuarioDB._id


    });
  });

  })

module.exports = app;
