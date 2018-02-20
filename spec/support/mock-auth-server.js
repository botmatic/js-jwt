const nock = require('nock')

const HOST = 'http://fake.authorizatio.com'
const PATH = '/authorization'

const TOKEN = "<BOTMATIC_TOKEN>"

module.exports = {
  url: HOST + PATH,
  username: 'botmatic',
  password: 'botmatic',
  token: TOKEN,
  setup: () => {
    nock(HOST)
      .post(PATH, {
        username: 'botmatic',
        password: 'botmatic'
      })
      .reply(200, { message: { success: true, token: TOKEN } })
  }
}