const express = require("express");
const dbCon = require("./db/mongo.db").connectToDatabase;
const Autor = require("./mongoSchemas/autorSchema");
const Libro = require("./mongoSchemas/libroSchema");
const mongoose = require("./db/mongo.db").mongoose;
const PORT = process.env.PORT ?? 3000;
const app = express();

// Middleware por default para formato json en el body de los POST
app.use(express.json());

app.get("/", async (req, res) => {
  const autores = await Autor.find({});
  res.status(200).json(autores);
});

app.get("/:id", async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const autores = await Autor.aggregate([
    {
      $match: { _id },
    },
    {
      $lookup: {
        from: "libros",
        localField: "_id",
        foreignField: "autorId",
        as: "libros",
      },
    },
    {
      $project: {
        _id: 0,
        nombre: 1,
        fechaNacimiento: 1,
        genero: 1,
        "libros._id": 1,
        "libros.titulo": 1,
        "libros.anio": 1,
      },
    },
  ]);
  res.status(200).json(autores);
});

app.post("/", async (req, res) => {
  const autor = await Autor.create(req.body);
  res.status(201).json(autor);
});

app.post("/:id/libro", async (req, res) => {
  const id = req.params.id;
  const nuevoLibro = { ...req.body, autorId: new mongoose.Types.ObjectId(id) };
  const libro = await Libro.create(nuevoLibro);
  res.status(201).json(libro);
});

app.get("/libros/:id", async (req, res) => {
  const _id = req.params.id;
  const libro = await Libro.find({ _id }).populate("autorId");
  res.status(200).json(libro);
});

app.listen(PORT, async () => {
  await dbCon();
  console.log(`Aplicacion iniciada en el puerto ${PORT}`);
});
