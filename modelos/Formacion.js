const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let formacionSchema = new schema({
    title: String,
    institucion: String,
    fechaInicio: Date,
    fechaFin: Date
})
let Formacion = mongoose.model("Formacion", formacionSchema)

module.exports = Formacion;