const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let trabajoSchema = new schema({
    nombreDelPuesto: String,
    duracion: String,
    ubicacion: String,
    requisitos: String,
    descripcionDelPuesto: String,
    modalidad: String
}, { timestamps: true })
let Trabajo = mongoose.model("Trabajo", trabajoSchema)

module.exports = Trabajo;