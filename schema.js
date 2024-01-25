const mongoose = require('mongoose')
const { Schema } = mongoose

const IssueSchema = new Schema({
  projectId: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: Date,
  updated_on: Date,
  created_by: { type: String, required: true },
  assigned_to: String,
  open: Boolean,
  status_text: String,
})

ProjectSchema = new Schema({
  name: { type: String, required: true },
})

module.exports = mongoose.model('Issue', IssueSchema)
module.exports = mongoose.model('Project', ProjectSchema)