const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let formacionSchema = new schema({
    fechaInicio: Date,
    fechaFin: Date,
    institucion: String
})
let Formacion = mongoose.model("Formacion", formacionSchema)

module.exports = Formacion;