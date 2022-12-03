const mongoose = require("mongoose");
//MODELOS
let schema = mongoose.Schema;
let categoriaSchema = new schema({
    title: String
})
let Categoria = mongoose.model("Categoria", categoriaSchema)

module.exports = Categoria;