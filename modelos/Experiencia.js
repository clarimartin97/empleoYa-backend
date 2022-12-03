const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let experienciaSchema = new schema({
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
    nombreDelPuesto: String,
    fechaInicio: Date,
    fechaFin: Date
})
let Experiencia = mongoose.model("Experiencia", experienciaSchema)

module.exports = Experiencia;