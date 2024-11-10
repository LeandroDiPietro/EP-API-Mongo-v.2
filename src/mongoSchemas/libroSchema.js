const mongoose = require("../db/mongo.db").mongoose;
const { Schema } = require("mongoose");
const libroSchema = new mongoose.Schema(
  {
    titulo: {
      type: Schema.Types.String,
      required: true,
    },
    anio: {
      type: Schema.Types.Number,
      required: true,
    },
    autorId: {
      type: Schema.Types.ObjectId,
      ref: "Autor",
      required: true,
    },
  },
  {
    collection: "libros",
  }
);

// Aseguramos que los campos virtuales estén incluidos en el objeto json a retornar
// y eliminamos atributos que no queremos visualizar en las respuestas
libroSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    delete ret._id;
  },
});

const Libro = mongoose.model("Libro", libroSchema);
module.exports = Libro;
