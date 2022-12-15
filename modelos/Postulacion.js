const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let postulacionSchema = new schema({
    trabajo: { type: mongoose.Schema.Types.ObjectId, ref: "Trabajo" },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
})
let Postulacion = mongoose.model("Postulacion", postulacionSchema)

module.exports = Postulacion;