
const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  token: { type: mongoose.Schema.Types.ObjectId, ref: "Token" }, 
  imageUrl: { type: String, required: true }, 
  notes: { type: String , default:"none"},
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
