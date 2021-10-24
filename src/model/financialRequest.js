const mongoose = require("mongoose");

const financialRequestSchema = new mongoose.Schema({
    reference : { type: String, default: null },
    department: { type: String },
    amount: { type: String },
    reason: { type: String },
    status: { type: String },
  });
  
  module.exports = mongoose.model("financialRequest", financialRequestSchema);