const express = require('express');
const app = express();
require("dotenv").config();
let userDB = process.env.DB_USER;
let passDB = process.env.DB_PASS;
const port = process.env.PORT || 8000;

//

const cors = require('cors');
app.use(cors());

///

const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://${userDB}:${passDB}@cluster0.9vurvbs.mongodb.net/empleo?retryWrites=true&w=majority`)
let db = mongoose.connection;

db.once("open", () => console.log("conectado a la base"))

let Categoria = require("./modelos/Categoria.js");
let Experiencia = require("./modelos/Experiencia.js");
let Trabajo = require("./modelos/Trabajo.js");
let Usuario = require("./modelos/Usuario.js");
let Formacion = require("./modelos/Formacion.js");
let Habilidades = require("./modelos/Habilidades.js");
let Postulacion = require("./modelos/Postulacion.js");
//
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ mensaje: "Uruguay es bolso" });
})

///// get cn los trabajos   


app.get("/usuarios", (req, res) => {
    Usuario.find((err, usuarios) => {
        if (err) {
            return console.log(err)
        }
        else {
            console.log(usuarios);
            return res.json(
                usuarios
            )
        }
    }).populate('habilidades', 'title').populate('formaciones').populate({ path: 'experienciaProfesional', populate: { path: 'categoria' } })
    /////caapaz de la experiencia quireo q solo me traiga el nombre?
})

app.post("/usuarios", (req, res) => {
    const nuevasHabilidades = new Habilidades({
        title: req.body.habilidades
    })
    const nuevasFormaciones = new Formacion({
        title: req.body.formaciones
    })
    const nuevasExperienciasProfesionales = new Experiencia({
        categoria: req.body.categoryId,
        nombreDelPuesto: req.body.nombreDelPuesto,
        fechaInicio: req.body.fechaInicio,
        fechaFin: req.body.fechaFin
    })
    const nuevoUsuario = new Usuario({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correoElectronico,
        titulo: req.body.titulo,
        habilidades: [nuevasHabilidades._id],
        contraseña: req.body.contraseña,
        formaciones: [nuevasFormaciones._id],
        experienciaProfesional: [nuevasExperienciasProfesionales._id]
    });
    nuevasHabilidades.save();
    nuevasFormaciones.save();
    nuevasExperienciasProfesionales.save();

    nuevoUsuario.save().then(user => {
        res.json({ user })

    });
    console.log(nuevoUsuario)
})

app.get("/trabajos/:idUsuario", (req, res) => {
    let idUsuario = req.params.idUsuario
    Trabajo.find((err, trabajos) => {
        if (err) {
            return console.log(err)
        }
        else {
            Postulacion.find({
                idUsuario: idUsuario
            },
                (err, postulacion) => {
                    if (err) {
                        return console.log(err)
                    }
                    else {
                        const idsTrabajo = postulacion.map(function (e) { return e.idTrabajo })
                        const resultado = trabajos.map(function (element) {
                            return {
                                ...element._doc,
                                estaPostulado: idsTrabajo.includes(element._id.toString())
                            }
                        })
                        return res.json(resultado)
                    }
                })
        }
    })
})


app.post("/trabajos", (req, res) => {
    const nuevoTrabajo = new Trabajo({
        nombreDelPuesto: req.body.nombreDelPuesto,
        duracion: req.body.duracion,
        ubicacion: req.body.ubicacion,
        nombreDeLaEmpresa: req.body.nombreDeLaEmpresa,
        categoria: req.body.categoryId,
        requisitos: req.body.requisitos,
        descripcionDelPuesto: req.body.descripcionDelPuesto,
        trabajoActivo: req.body.trabajoActivo,
        modalidad: req.body.modalidad,
    });

    nuevoTrabajo.save().then(trabajo => {
        res.json({ trabajo })

    });
    console.log(nuevoTrabajo)
})

app.delete("/trabajos/:idEliminar", (req, res) => {
    console.log(req.params.idEliminar);
    let idEliminar = req.params.idEliminar;
    console.log(idEliminar);
    Trabajo.findByIdAndDelete(idEliminar, (err, trabajo) => {
        if (err) {
            console.log(err)
        } else {
            res.json(trabajo)
        }
    })
})

app.listen(port, () => {
    console.log(`Ejemplo de app en http:localhost:${port}`);
    console.log("hola")
}) 