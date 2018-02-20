const expect = require('chai').expect
const mock = require('./support/mock-auth-server')

describe("JSON Web Token authorization", function () {
  beforeEach(function () {
    mock.setup()
  })

  it('should fetch a JWT', async function () {
    const jwt = require('../src/index')({
      authUrl : mock.url,
      contentType: 'application/json',
      headerName: 'X-Access-Token',
      headerPrefix: 'Bearer',
      onResponse: body => body.message.token
    })

    const authHeader = await jwt.auth({
      username: mock.username,
      password: mock.password
    })

    expect(authHeader).to.be.an('object')
    expect(authHeader['X-Access-Token']).to.be.ok
    expect(authHeader['X-Access-Token']).to.be.a('string')
    expect(authHeader['X-Access-Token']).to.equal(`Bearer ${mock.token}`)
  })

  it('should throw', function () {
    const jwt = require('../src/index')

    expect(() => { jwt({}) }).to.throw('js-jwt: authUrl must be defined')
  })
})