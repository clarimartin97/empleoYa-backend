const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let usuarioSchema = new schema({
    nombre: String,
    apellido: String,
    formaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formacion' }],
    habilidades: [String],
    titulo: String,
    mail: String,
    contraseña: String
})
let Usuario = mongoose.model("Usuario", usuarioSchema)

module.exports = Usuario;