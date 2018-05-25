
var jwt = require('jsonwebtoken');
//rescata SEED desde el archivo config/config.js
var SEED = require('../config/config').SEED;

      // ======================================================
      // Verificar Token y bloquea todas las peticiones de mas abajo
      // ======================================================

      exports.verificaToken = function (req, res, next){

        var token = req.query.token;

        jwt.verify(token, SEED, (err, decoded) =>{

          if ( err ) {
              return res.status(401).json({
                ok: false,
                mensaje: 'Token no valido',
                errors: err
              });
            }

            req.usuario = decoded.usuario;

            //para evitar que se quede pegado despues de tener token correcto
            //debe aplicarse next
            next();

            // return res.status(200).json({
            //   ok: true,
            //   decoded : decoded

            //});

        });
      }
