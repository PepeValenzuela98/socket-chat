const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("BD Online")
  } catch (error) {
    throw new Error("Problema al iniciar la base de datos");
  }
};

module.exports = {
  dbConnection,
};
