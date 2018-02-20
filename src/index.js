/**
 * A module to request a JSON Web token from an external API
 * @module js-jwt
 * @todo add validation function ?
 * @todo Rename to js-jwt
 * @example
 * // Initialisation
 * // Params :
 * //  - contentType:  Content-Type for the request
 * //  - headerName:   defaults to 'Authorization'
 * //  - headerPrefix: defaults to 'Bearer'
 * //  - onResponse:   function called when the authorization request responds
 * //                  Takes the response body as parameter
 * //                  Returns the token or false in case of failure
 * const jwt = require('js-jwt')({
 *   url: `${AUTHENTICATE_URL}`,
 *   contentType: 'application/json',
 *   headerName: 'Authorization',
 *   headerPrefix: 'Bearer',
 *   onResponse: body => body.token || false
 * })
 *
 * @example
 * // Getting the header
 * const auth_header = await jwt.auth({user: "name", pass: "word"})
 * // auth_header == { 'Authorization': 'Bearer <TOKEN>' }
 * // auth_header == {} in case the onResponse callback returned false
 *
 * const options = {
 *   uri: 'http://example.com',
 *   headers: auth_header,
 * }
 *
 * // Authorized request
 * request.get(options, (err, response) => {
 *   // Handle the response
 * }
 */


const debug = require('debug')('botmatic:js-jwt')
const request = require('request')

const body = ({contentType}, data) => {
  switch (contentType) {
    default:
    case 'application/json':
      return { json: data }

    case 'application/x-www-form-urlencoded':
      return { form: data }
  }
}

const requestToken = (url, body, cb) => new Promise(resolve => {
    const options = Object.assign(body, {uri: url})
    request.post(options, (err, response) => {
      if (!err) {
        resolve(cb(response.body))
      }
      else {
        resolve()
      }
    })
  })

const getToken = async (params, authParams, headers, onResponse) => {
  debug('getToken', authParams, headers)
  // sends a request
  const postData = body(params, authParams)
  const token = await requestToken(params.url, postData, onResponse)
  debug(`got ${token}`)

  if (token) {
    return authHeaders(params, headers, token)
  }
  else {
    return {}
  }
}

const makeGetToken = (params, onResponse) => async (authParams, headers = {}) => {
  return getToken(params, authParams, headers, onResponse)
}

const authHeaders = ({headerName, headerPrefix}, headers, token) => {
  headers[headerName] = headerPrefix === '' ?
    token : headerPrefix + ' ' + token

  return headers
}

const init = ({authUrl, contentType, headerName, headerPrefix, onResponse}) => {
  if (!authUrl) throw 'js-jwt: authUrl must be defined'

  const params = {
    url: authUrl,
    contentType: contentType || 'application/json',
    headerName: headerName || 'Authorization',
    headerPrefix: headerPrefix || 'Bearer'
  }

  return {
    /**
     * @member auth
     * @description Performs the auhentication request and returns a Promise resolving to an object representing the authorization header
     * @function
     * @param {object}
     * @return {Promise<object|undefined>}
     */
    auth: makeGetToken(params, onResponse)
  }
}

module.exports = init