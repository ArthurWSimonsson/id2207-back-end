const mongoose = require("mongoose");

const recruitmentRequestSchema = new mongoose.Schema({
    duration : { type: String, default: null },
    department: { type: String },
    years: { type: String },
    title: { type: String },
    description: { type: String },
    status: { type: String },
  });
  
  module.exports = mongoose.model("recruitmentRequest", recruitmentRequestSchema);