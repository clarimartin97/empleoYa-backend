const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let usuarioSchema = new schema({
    nombre: String,
    apellido: String,
    experienciaProfesional: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experiencia' }],
    formaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formacion' }],
    habilidades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habilidades' }],
    titulo: String,
    mail: String,
    contraseña: String
})
let Usuario = mongoose.model("Usuario", usuarioSchema)

module.exports = Usuario;