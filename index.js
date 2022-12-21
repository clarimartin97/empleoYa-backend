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

let Trabajo = require("./modelos/Trabajo.js");
let Usuario = require("./modelos/Usuario.js");
let Postulacion = require("./modelos/Postulacion.js");
let Formacion = require("./modelos/Formacion.js");
let Habilidad = require("./modelos/Habilidad.js");
let ExperienciaProfesional = require("./modelos/ExperienciaProfesional.js");
//
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ mensaje: "Uruguay es bolso" });
})

///// get cn los trabajos   


app.get("/usuarios/:idUsuario", (req, res) => {
    Usuario.findById(req.params.idUsuario)
        // .populate('experienciaProfesional')
        .populate('habilidades')
        // .populate('formaciones')
        .exec(function (err, usuario) {
            console.log(usuario)
            if (err) {
                return res.json(err)
            }
            else {
                console.log(usuario);
                return res.json(usuario)
            }
        });
    /////caapaz de la experiencia quireo q solo me traiga el nombre?
})

app.post("/signup", (req, res) => {
    console.log("hello")
    console.log(req.body)
    Usuario.findOne({
        mail: req.body.mail
    }, (err, usuario) => {
        if (err || usuario == null) {

            const nuevoUsuario = new Usuario({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                mail: req.body.mail,
                titulo: "",
                habilidades: [],
                contraseña: req.body.contrasena,
                formaciones: [],
                experienciaProfesional: []
            });

            nuevoUsuario.save((err, usuario) => {
                console.log(err)
                res.json({ ...usuario, error: err })

            });
            console.log(nuevoUsuario)
        }
        else {

            res.json({ error: "usuario_ya_existe" })

        }
    })
})

app.post("/login", (req, res) => {
    console.log("hello")
    console.log(req.body)
    Usuario.findOne({
        mail: req.body.mail,
        contraseña: req.body.contrasena
    }, (err, usuario) => {
        console.log(usuario);
        console.log(err);
        if (err || usuario == null) res.json({ error: true })
        else res.json({ ...usuario._doc })
    })
})

app.get("/trabajos/:idUsuario", (req, res) => {
    let idUsuario = req.params.idUsuario
    console.log(idUsuario)
    Trabajo.find((err, trabajos) => {
        if (err) {
            return console.log(err)
        }
        else {
            Postulacion.find({
                usuario: idUsuario
            },
                (err, postulacion) => {
                    console.log(postulacion)
                    if (err) {
                        return console.log(err)
                    }
                    else {
                        const idsTrabajo = postulacion.map(function (e) { return e.trabajo.toString() })
                        const resultado = trabajos.map(function (element) {
                            return {
                                ...element._doc,
                                estaPostulado: idsTrabajo.includes(element._id.toString())
                            }
                        })
                        console.log(resultado)
                        return res.json(resultado)
                    }
                })
        }
    })
})

app.get("/trabajos/:idUsuario/:ubicacion/:nombreDelPuesto", (req, res) => {
    let idUsuario = req.params.idUsuario
    let ubicacion = req.params.ubicacion
    let nombreDelPuesto = req.params.nombreDelPuesto
    const ubicacionRegex = new RegExp(ubicacion, "i")
    const nombreDelPuestoRegex = new RegExp(nombreDelPuesto, "i")
    Trabajo.find({ ubicacion: ubicacionRegex, nombreDelPuesto: nombreDelPuestoRegex }, (err, trabajos) => {
        if (err) {
            return console.log(err)
        }
        else {
            Postulacion.find({
                usuario: idUsuario
            },
                (err, postulacion) => {
                    if (err) {
                        return console.log(err)
                    }
                    else {
                        const idsTrabajo = postulacion.map(function (e) { return e.trabajo.toString() })
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

app.post("/postulacion", (req, res) => {
    const nuevaPostulacion = new Postulacion({
        trabajo: req.body.idTrabajo,
        usuario: req.body.idUsuario,
    });

    nuevaPostulacion.save().then(postulacion => {
        res.json({ postulacion })

    });
})

app.get("/postulaciones/:idUsuario", (req, res) => {
    let idUsuario = req.params.idUsuario
    console.log(idUsuario)
    Postulacion.find({ usuario: idUsuario })
        .populate('trabajo')
        .exec(function (err, postulacion) {
            console.log(postulacion)
            if (err) {
                return console.log(err)
            }
            else {
                console.log(postulacion);
                return res.json(postulacion)
            }
        });
})

app.delete("/postulacion/:idEliminar", (req, res) => {
    let idEliminar = req.params.idEliminar;
    console.log(idEliminar);
    Postulacion.findByIdAndDelete(idEliminar, (err, postulacion) => {
        if (err) {
            console.log(err)
        } else {
            res.json(postulacion)
        }
    })
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