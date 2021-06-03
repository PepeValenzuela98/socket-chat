const { request, response } = require("express");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { subirArchivo, imageDefault } = require("../helpers");

const cargarArchivo = async (req = request, res = response) => {
  try {
    const uploadPath = await subirArchivo(req.files, undefined, "imgs");
    res.json({ filename: uploadPath });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

const actualizarImagen = async (req = request, res = response) => {
  const { coleccion } = req.params;
  const { tempFilePath } = req.files.archivo;
  let modelo = req.modelo;
  if (!modelo) {
    res
      .status(404)
      .json({ msg: `No se encontro el modelo en la coleccion ${coleccion}` });
  }
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;

  await modelo.save();

  res.json({ modelo });
};

const mostrarImagen = (req = request, res = response) => {
  let modelo = req.modelo;
  if (modelo.img) {
    return res.json({ img: modelo.img });
  }
  res.sendFile(imageDefault());
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
};
