const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let habilidadSchema = new schema({
    titulo: String
})
let Habilidad = mongoose.model("Habilidad", habilidadSchema)

module.exports = Habilidad;