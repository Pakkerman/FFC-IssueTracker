const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function () {
  suite('POST /api/issues/:project', () => {
    test('POST with all required fields', (done) => {
      const input = []
      const expected = {}

      chai.request(server).post('/api/issues/').body
    })
  })
})
