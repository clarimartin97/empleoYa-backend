const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let formacionSchema = new schema({
    fechaInicio: String,
    fechaFin: String,
    institucion: String
})
let Formacion = mongoose.model("Formacion", formacionSchema)

module.exports = Formacion;