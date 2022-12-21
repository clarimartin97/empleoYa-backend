const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let experienciaProfesionalSchema = new schema({
    fechaInicio: Date,
    fechaFin: Date,
    institucion: String
})
let ExperienciaProfesional = mongoose.model("ExperienciaProfesional", experienciaProfesionalSchema)

module.exports = ExperienciaProfesional;