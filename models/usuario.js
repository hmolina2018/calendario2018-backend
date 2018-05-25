
// Los modelos se estandarizan a 1 objeto y por eso no se llama usuarios.js

var mongoose = require ('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var rolesValidos = {

values: ['ADMIN_ROLE', 'USER_ROLE'],
message: '{VALUE} no es un rol valido'

};

//se define esquema donde se indica que datos son necesarios
var usuarioSchema = new Schema({

  nombre: {type : String, required:[true, 'El nombre es necesario'] },
  email: {type : String, unique:true,  required:[true, 'El correo es necesario'] },
  password: {type : String, required:[true, 'El contraseña es necesario'] },
  img: {type : String, required:false },
  role: {type : String, required:true, default:'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'})

//acá mandamos a llamar el modelo para utilizarlo
module.exports = mongoose.model('Usuario', usuarioSchema);
