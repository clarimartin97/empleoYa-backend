const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let postulacionSchema = new schema({
    idTrabajo: String,
    idUsuario: String,
})
let Postulacion = mongoose.model("Postulacion", postulacionSchema)

module.exports = Postulacion;