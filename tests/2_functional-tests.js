const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')
const { application } = require('express')

chai.use(chaiHttp)

suite('Functional Tests', function () {
  const project = 'test'
  let testIssueId = ''
  suite('POST /api/issues/:project', () => {
    test('POST with all required fields', (done) => {
      const input = {
        issue_title: 'test',
        issue_text: 'test',
        assigned_to: 'test',
        status_text: 'test',
        created_by: 'test',
      }
      const expected = {
        issue_title: 'test',
        issue_text: 'test',
        assigned_to: 'test',
        status_text: 'test',
        created_by: 'test',
      }

      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .set('content-type', 'application/json')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(input, expected)
          testIssueId = res.body._id
          done()
        })
    })
    test('POST with only required fields', (done) => {
      const input = {
        issue_title: 'test',
        issue_text: 'test',
        created_by: 'test',
      }
      const expected = {
        issue_title: 'test',
        issue_text: 'test',
        created_by: 'test',
      }

      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .set('content-type', 'application/json')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(input, expected)
          done()
        })
    })
    test('POST with missing required field', (done) => {
      const input = {
        issue_text: 'test',
        issue_title: 'test',
      }
      const expected = { error: 'required field(s) missing' }

      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(expected, { error: 'required field(s) missing' })
          done()
        })
    })
  })
  suite('GET /api/issues/:project', () => {
    test('GET a list of issues', (done) => {
      chai
        .request(server)
        .get(`/api/issues/${project}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          done()
        })
    })
    test('GET a filtered list of issues', (done) => {
      const query = 'issue_title=test'
      chai
        .request(server)
        .get(`/api/issues/${project}?${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          done()
        })
    })
    test('GET a multiple filtered list of issues', (done) => {
      const query = 'issue_title=test&issue_text=test'
      chai
        .request(server)
        .get(`/api/issues/${project}?${query}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          done()
        })
    })
  })
  suite('PUT /api/issues/:project', () => {
    test('PUT update one field of an issue', (done) => {
      const updateFields = { _id: testIssueId, issue_title: 'updated field' }
      const expected = { result: 'successfully updated', _id: testIssueId }

      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updateFields)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('PUT with multiple fields to update', (done) => {
      const updateFields = {
        _id: testIssueId,
        issue_title: 'updated',
        issue_text: 'updated',
        created_by: 'updated',
        assigned_to: 'updated',
        status_text: 'updated',
      }
      const expected = { result: 'successfully updated', _id: testIssueId }

      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updateFields)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('PUT with no _id provided', (done) => {
      const updateFields = {
        issue_title: 'updated',
        issue_text: 'updated',
        created_by: 'updated',
        assigned_to: 'updated',
        status_text: 'updated',
      }
      const expected = { error: 'missing _id' }

      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updateFields)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('PUT with valid _id but no fields', (done) => {
      const updateFields = { _id: testIssueId }
      const expected = { error: 'no update field(s) sent', _id: testIssueId }

      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updateFields)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('PUT with _id that dont exist', (done) => {
      const updateFields = {
        _id: 'does not exist',
        issue_title: 'updated',
        issue_text: 'updated',
        created_by: 'updated',
        assigned_to: 'updated',
        status_text: 'updated',
      }
      const expected = { error: 'could not update', _id: updateFields._id }

      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updateFields)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
  })
  suite('DELETE /api/issues/:project', () => {
    test('DELETE an issue with testIssueId', (done) => {
      const input = { _id: testIssueId }
      const expected = { result: 'successfully deleted', _id: testIssueId }

      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('DELETE with an invalid id', (done) => {
      const input = { _id: 'invalid id' }
      const expected = { error: 'could not delete', _id: 'invalid id' }

      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('DELETE with missing id', (done) => {
      const input = {}
      const expected = { error: 'missing _id' }

      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
  })
})
