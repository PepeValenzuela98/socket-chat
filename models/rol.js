const { Schema, model } = require("mongoose");

const RolSchema = Schema({
  rol: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = model("Roles", RolSchema);
