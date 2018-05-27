var express = require('express');
var mdAutenticacion = require('../middelwares/autenticacion');
var app = express();
var Evento = require('../models/evento');

//Rutas
//req es request - res es response

// ======================================================
// Obtener todos los eventos
// ======================================================
app.get('/', (req, res, next) => {

  //PAGINAR: variable para paginar
  var desde = req.query.desde || 0;
  desde = Number(desde);

//busca los eventos con los atributos indicados para traer todo,
// dejar en blanco
Evento.find({}, '')
      .skip (desde) //PAGINAR:saltar contador
      .limit(5) //PAGINAR:desde 5
      .populate('usuario', 'nombre email role')
      .exec(
  (err, eventos)=>{

        if ( err ) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error cargando evento',
              errors: err
            });
          }

          Evento.count({},(err,conteo) => {  //PAGINAR:contador de Evento
          res.status(200).json({
          ok: true,
          eventos: eventos,
          total: conteo
        });
        }); //PAGINAR : cierra contador

      });


      // ======================================================
      // Actualizar  evento
      // ======================================================

      app.put ('/:id', mdAutenticacion.verificaToken ,(req, res) =>{

        var id = req.params.id;
        var body = req.body;

          Evento.findById(id, (err, evento)=>{

          if ( err ) {
              return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el evento',
                errors: err
              });
            }

            if (!evento) {

            return res.status(400).json({
              ok: false,
              mensaje: 'El evento con el id ' + id + ' no existe',
              errors: {message: 'No existe un evento con ese ID'}
            });

          }

          evento.nombre = body.nombre;
          evento.usuario =  req.usuario._id;


          evento.save ( (err, eventoGuardado) => {

            if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar evento',
                errors: err
            });

          }

            res.status(200).json({
            ok: true,
            evento: eventoGuardado
            });
        });
      });
    });

      // ======================================================
      // crear un nuevo evento
      // ======================================================
      app.post('/', mdAutenticacion.verificaToken ,(req, res) => {

        var body = req.body;

        var evento = new Evento({
          nombre: body.nombre,
          usuario: req.usuario._id,

        });

        evento.save( ( err, eventoGuardado ) => {
          if ( err ) {
              return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear evento',
                errors: err
              });
            }
            res.status(201).json({
            ok: true,
            evento: eventoGuardado
            });

        } );

} );


});

// ======================================================
// Borror evento por el id
// ======================================================
app.delete('/:id', mdAutenticacion.verificaToken ,(req, res) => {
  var id = req.params.id;

  Evento.findByIdAndRemove( id, ( err, eventoBorrado ) => {
    if ( err ) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al borrar evento',
          errors: err
        });
      }

      if ( !eventoBorrado ) {
          return res.status(400).json({
            ok: false,
            mensaje: 'No existe un evento con ese ID',
            errors: {message: 'No existe un evento con ese ID'}
          });
        }

      res.status(200).json({
      ok: true,
      evento: eventoBorrado
      });

  } );
  });

module.exports = app;
