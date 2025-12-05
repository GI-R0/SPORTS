import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Pista from "../models/Pista.js";
import Reserva from "../models/Reserva.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const readCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "../../data", filename);

    if (!fs.existsSync(filePath)) {
      reject(new Error(`Archivo no encontrado: ${filePath}`));
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => {
        console.log(`✓ Leídos ${results.length} registros de ${filename}`);
        resolve(results);
      })
      .on("error", (err) => {
        console.error(`Error leyendo ${filename}:`, err.message);
        reject(err);
      });
  });
};

const mongoUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/sportify";

const seed = async () => {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✓ Conectado a MongoDB");

    console.log("\nLimpiando colecciones existentes...");
    await User.deleteMany({});
    await Pista.deleteMany({});
    await Reserva.deleteMany({});
    console.log("✓ Colecciones limpiadas");

    console.log("\nLeyendo archivos CSV...");
    const usersData = await readCSV("usuarios.csv");
    const pistasData = await readCSV("pistas.csv");
    const reservasData = await readCSV("reservas.csv");

    console.log("\nCreando usuarios...");
    const users = [];
    for (const u of usersData) {
      const newUser = await User.create({
        name: u.name,
        email: u.email.toLowerCase(),
        password: u.password,
        role: u.role || "user",
      });
      users.push(newUser);
    }
    console.log(`✓ Creados ${users.length} usuarios`);

    const userMap = users.reduce((map, u) => {
      map[u.email] = u._id;
      return map;
    }, {});

    console.log("\nCreando pistas...");

    const pistasToInsert = pistasData.map((p) => {
      const clubId = userMap[p.clubEmail?.toLowerCase()];

      const horariosDisponibles = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
      ];

      return {
        nombre: p.nombre,
        deporte: p.deporte,
        precioHora: Number(p.precioHora) || 10,
        ubicacion: p.ubicacion || "Sede Principal",
        club: clubId,
        horariosDisponibles,
        imagen: p.imagen || "",
        iluminacion: p.iluminacion === "true",
        superficie: p.superficie || "Césped",
      };
    });

    const pistas = await Pista.insertMany(pistasToInsert);
    console.log(`✓ Creadas ${pistas.length} pistas`);

    const pistaMap = pistas.reduce((map, p) => {
      map[p.nombre] = p._id;
      return map;
    }, {});

    console.log("\nCreando reservas...");
    const reservasToInsert = reservasData
      .map((r) => {
        const userId = userMap[r.userEmail?.toLowerCase()];
        const pistaId = pistaMap[r.pistaNombre];

        if (!userId) {
          console.warn(`Usuario no encontrado: ${r.userEmail}`);
          return null;
        }
        if (!pistaId) {
          console.warn(`Pista no encontrada: ${r.pistaNombre}`);
          return null;
        }

        return {
          usuario: userId,
          pista: pistaId,
          fecha: new Date(r.fecha),
          hora: r.hora,
          duracion: 1.5,
          total: Number(r.total) || 20,
          estado: "confirmada",
        };
      })
      .filter(Boolean);

    const reservas = await Reserva.insertMany(reservasToInsert);
    console.log(`✓ Creadas ${reservas.length} reservas`);

    console.log("\n========================================");
    console.log("SEEDING COMPLETADO EXITOSAMENTE");
    console.log("========================================");
    console.log(`Total usuarios: ${users.length}`);
    console.log(`Total pistas: ${pistas.length}`);
    console.log(`Total reservas: ${reservas.length}`);
    console.log(
      `Total registros: ${users.length + pistas.length + reservas.length}`
    );
    console.log("========================================\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Error en seed:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
