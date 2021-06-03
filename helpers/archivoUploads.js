const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const extensionesDefault = ["png", "jpg", "jpeg", "gif"];

const subirArchivo = (
  files,
  extensionesValidas = extensionesDefault,
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extension ${extension} no es permitida, ${extensionesValidas}`
      );
    }
    const nombreTemp = `${uuid()}.${extension}`;
    const uploadPath = path.join(__dirname, "../uploads/", folder, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(nombreTemp);
    });
  });
};

const eliminarArchivo = (file, folder = "") => {
  const pathArchivo = path.join(__dirname, "../uploads", folder, file);
  if (fs.existsSync(pathArchivo)) {
    fs.unlinkSync(pathArchivo);
  }
};

const rutaArchivo = (file, folder = "") => {
  const pathArchivo = path.join(__dirname, "../uploads", folder, file);
  if (fs.existsSync(pathArchivo)) {
    return pathArchivo;
  }
};

const imageDefault = () => {
  const pathArchivo = path.join(__dirname, "../assets/no-image.jpg");
  if (fs.existsSync(pathArchivo)) {
    return pathArchivo;
  }
};

module.exports = { subirArchivo, eliminarArchivo, rutaArchivo, imageDefault };
