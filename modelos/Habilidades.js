const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let habilidadesSchema = new schema({
    title: String
})
let Habilidades = mongoose.model("Habilidades", habilidadesSchema)

module.exports = Habilidades;