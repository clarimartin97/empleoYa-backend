const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let trabajoSchema = new schema({
    nombreDelPuesto: String,
    duracion: String,
    ubicacion: String,
    nombreDeLaEmpresa: String,
    categoria: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }],
    requisitos: String,
    descripcionDelPuesto: String,
    trabajoActivo: Boolean,
    modalidad: String
})
let Trabajo = mongoose.model("Trabajo", trabajoSchema)

module.exports = Trabajo;