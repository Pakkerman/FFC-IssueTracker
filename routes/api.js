'use strict'

require('../connection.js')
const { Issue, Project } = require('../schema.js')

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(async (req, res) => {
      const projectName = req.params.project

      try {
        const project = await Project.findOne({ name: projectName })
        if (!project) return res.json({ error: 'no project found' })

        const issues = await Issue.find({
          projectId: project._id,
          ...req.query,
        })

        return res.json(issues)
      } catch (err) {
        return res.json(err)
      }
    })

    .post(async (req, res) => {
      let projectName = req.params.project
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' })
      }

      try {
        let project = await Project.findOne({ name: projectName })

        if (!project) {
          project = new Project({ name: projectName })
          project = await project.save()
        }

        let issue = new Issue({
          projectId: project._id,
          issue_title: issue_title || '',
          issue_text: issue_text || '',
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || '',
          assigned_to: assigned_to || '',
          open: true,
          status_text: status_text || '',
        })

        issue = await issue.save()

        return res.json(issue)
      } catch (err) {
        return res.json({ err })
      }
    })

    .put(async (req, res) => {
      const projectName = req.params.project
      const _id = req.body._id

      if (!_id) {
        return res.json({ error: 'missing _id' })
      }

      if (Object.values(req.body).length <= 1) {
        return res.json({ error: 'no update field(s) sent', _id: _id })
      }

      try {
        const project = await Project.findOne({ name: projectName })
        if (!project) return res.json({ error: 'project not found' })

        let update = await Issue.findOneAndUpdate(
          { _id },
          {
            ...req.body,
            updated_on: new Date(),
          }
        )

        update = await update.save()

        return res.json({ result: 'successfully updated', _id: _id })
      } catch (err) {
        // console.log(err)
        return res.json({ error: 'could not update', _id: _id })
      }
    })

    .delete(async (req, res) => {
      let projectName = req.params.project
      const _id = req.body._id

      if (!_id) {
        return res.json({ error: 'missing _id' })
      }

      try {
        const project = await Project.findOne({ name: projectName })
        if (!project) return res.json({ error: 'project not found' })

        const issue = await Issue.findOneAndDelete({ _id })
        if (!issue) {
          return res.json({ error: 'could not delete', _id: _id })
        }

        return res.json({ result: 'successfully deleted', _id: _id })
      } catch (err) {
        return res.json({ error: 'could not delete', _id: _id })
      }
    })
}
