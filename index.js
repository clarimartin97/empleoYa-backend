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
//
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ mensaje: "Uruguay es bolso" });
})



app.get("/usuarios/:idUsuario", (req, res) => {
    Usuario.findById(req.params.idUsuario)
        .populate('formaciones')
        .exec(function (err, usuario) {
            console.log(usuario)
            if (err) {
                return res.json(err)
            }
            else {
                return res.json(usuario)
            }
        });
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
                formaciones: []
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

app.post("/trabajo", (req, res) => {
    console.log("hello")
    console.log(req.body)


    const nuevoTrabajo = new Trabajo({
        nombreDelPuesto: req.body.nombreDelPuesto,
        duracion: req.body.duracion,
        ubicacion: req.body.ubicacion,
        requisitos: req.body.requisitos,
        descripcionDelPuesto: req.body.descripcionDelPuesto,
        modalidad: req.body.modalidad,
    });

    nuevoTrabajo.save((err, trabajo) => {
        console.log(err)
        return res.json({ ...trabajo, error: err })
    });
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
    }).sort({ createdAt: -1 })
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
    }).sort({ createdAt: -1 })
})

app.patch("/habilidades/:id", function (req, res) {
    var id = req.params.id;
    var nuevasHabilidades = req.body.habilidades
    console.log(nuevasHabilidades)
    Usuario.findByIdAndUpdate(id, { habilidades: nuevasHabilidades }).populate('formaciones')
        .exec(function (err, usuario) {
            return res.json({ usuario: { ...usuario._doc, habilidades: nuevasHabilidades }, err })
        });
});
app.post("/formaciones/:id", function (req, res) {
    var id = req.params.id;

    const nuevaFormacion = new Formacion({
        fechaInicio: req.body.formacion.fechaInicio,
        fechaFin: req.body.formacion.fechaFin,
        institucion: req.body.formacion.institucion,

    })

    console.log(nuevaFormacion)

    nuevaFormacion.save((err, f) => {
        console.log(f)
        if (err) {
            return res.json(err)
        }
        else {
            Usuario.findByIdAndUpdate(id, { $push: { formaciones: f } })
                .populate('formaciones')
                .exec(function (err, usuario) {
                    console.log(usuario)
                    return res.json({ usuario: { ...usuario._doc, formaciones: [...usuario._doc.formaciones, nuevaFormacion] }, err })
                });
        }
    });
});





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
        .sort({ createdAt: -1 })
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
app.delete("/formaciones/:idFormacion/:idUsuario", (req, res) => {
    console.log(req.params.idFormacion);
    let idEliminar = req.params.idFormacion;
    let idUsuario = req.params.idUsuario;
    Formacion.findByIdAndDelete(idEliminar, (err, formacion) => {
        console.log(formacion)
        if (err) {
            return res.json(err)
        } else {
            Usuario.findByIdAndUpdate(idUsuario, { $pull: { formaciones: idEliminar } })
                .populate('formaciones')
                .exec(function (err2, usuario) {
                    console.log(err2)
                    if (err2)
                        return res.json(err2)
                    console.log(usuario)
                    const lista = usuario._doc.formaciones.filter(x => x != formacion)
                    console.log(lista)
                    return res.json({ usuario: { ...usuario._doc, formaciones: lista }, err })
                });
        }
    })
})

app.listen(port, () => {
    console.log(`Ejemplo de app en http:localhost:${port}`);
    console.log("hola")
}) 