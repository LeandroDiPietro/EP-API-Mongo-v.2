const mongoose = require("../db/mongo.db").mongoose;
const { Schema } = require("mongoose");
const autorSchema = new mongoose.Schema(
  {
    nombre: {
      type: Schema.Types.String,
      required: true,
    },
    fechaNacimiento: {
      type: Schema.Types.Date,
      required: true,
    },
    genero: {
      type: Schema.Types.String,
      required: true,
      enum: {
        values: ["Masculino", "Femenino", "Binario", "No Declarado"],
        message: `el genero "{VALUES}" - no esta permitido`,
      },
    },
  },
  {
    collection: "autores",
  }
);
// Definimos el atributo virual 'edad' usando una funcion regular
// No usar una funcion fecha pr las arrow function no tiene su propio contexto de this
autorSchema.virtual("edad").get(function () {
  return Math.floor(
    (new Date() - new Date(this.fechaNacimiento)) /
      (1000 * 60 * 60 * 24 * 365.25)
  );
});

// Aseguramos que los campos virtuales estén incluidos en el objeto json a retornar
// y eliminamos atributos que no queremos visualizar en las respuestas
autorSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    delete ret._id;
  },
});

const Autor = mongoose.model("Autor", autorSchema);
module.exports = Autor;
