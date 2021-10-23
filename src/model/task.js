const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    recordNumber: { type: String, default: null },
    description: { type: String },
    assignee: { type: String },
    priority: { type: String },
    department: {type: String},
    notes: [{type: String}],
  });
  
  module.exports = mongoose.model("task", taskSchema);