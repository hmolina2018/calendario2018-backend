var express = require('express');

//https://github.com/dcodeIO/bcrypt.js/blob/master/README.md
//Problemas con bcrypt choca con moongoose validator
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
//rescata SEED desde el archivo config/config.js
// var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middelwares/autenticacion');

var app = express();


var Usuario = require('../models/usuario');

//Rutas
//req es request - res es response

// ======================================================
// Obtener todos los usuarios
// ======================================================
app.get('/', (req, res, next) => {

  //PAGINAR: variable para paginar
  var desde = req.query.desde || 0;
  desde = Number(desde);

//busca los usuario con los atributos indicados para traer todo,
// dejar en blanco
Usuario.find({}, 'nombre email img role')
       .skip (desde) //PAGINAR:saltar contador
       .limit(5) //PAGINAR:desde 5
       .exec(
  (err, usuarios)=>{

        if ( err ) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error cargando usuario',
              errors: err
            });
          }


          Usuario.count({},(err,conteo) => {  //PAGINAR:contador de usuarios
            res.status(200).json({
            ok: true,
            usuarios: usuarios,
            total: conteo
          });

        }); //PAGINAR : cierra contador

      });


      // ======================================================
      // Actualizar  usuario
      // ======================================================

      app.put ('/:id', mdAutenticacion.verificaToken ,(req, res) =>{

        var id = req.params.id;
        var body = req.body;

          Usuario.findById(id, (err, usuario)=>{

          if ( err ) {
              return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
              });
            }

            if (!usuario) {

            return res.status(400).json({
              ok: false,
              mensaje: 'El usuario con el id ' + id + ' no existe',
              errors: {message: 'No existe un usuario con ese ID'}
            });

          }

          usuario.nombre = body.nombre;
          usuario.email =  body.email;
          usuario.role =  body.role;

          usuario.save ( (err, usuarioGuardado) => {

            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar usuario',
                errors: err
            });

          }

          //Ofusca PASSWORD de usuario
            usuarioGuardado.password = ':)';

            res.status(200).json({
            ok: true,
            usuario: usuarioGuardado
            });
        });
      });
    });

      // ======================================================
      // crear un nuevo usuario
      // ======================================================
      app.post('/', mdAutenticacion.verificaToken ,(req, res) => {

        var body = req.body;

        var usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync(body.password, 10),
          //password: body.password,
          img: body.img,
          role: body.role

        });

        usuario.save( ( err, usuarioGuardado ) => {
          if ( err ) {
              return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
              });
            }
            res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken :   req.usuario
            });

        } );

} );


});

// ======================================================
// Borror usuario por el id
// ======================================================
app.delete('/:id', mdAutenticacion.verificaToken ,(req, res) => {
  var id = req.params.id;

  Usuario.findByIdAndRemove( id, ( err, usuarioBorrado ) => {
    if ( err ) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al borrar usuario',
          errors: err
        });
      }

      if ( !usuarioBorrado ) {
          return res.status(400).json({
            ok: false,
            mensaje: 'No existe un usuario con ese ID',
            errors: {message: 'No existe un usuario con ese ID'}
          });
        }

      res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
      });

  } );
  });

module.exports = app;
