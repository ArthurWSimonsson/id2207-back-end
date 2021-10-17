const mongoose = require("mongoose");

const initialRequestSchema = new mongoose.Schema({
    recordNumber : { type: String, default: null },
    clientName: { type: String },
    eventType: { type: String },
    attendees: { type: Number },
    budget: { type: String },
    decorations: { type: Boolean },
    parties: { type: Boolean },
    photos: { type: Boolean },
    food: { type: Boolean },
    drinks: { type: Boolean },
  });
  
  module.exports = mongoose.model("initialRequest", initialRequestSchema);