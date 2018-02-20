# JS JWT
A simple JWT module to authenticate an integration to external services

## Initialisation
```javascript
// Initialisation
const jwt = require('js-jwt')({
  url: 'https://my.external-api.com/authorize',
  contentType: 'application/json',
  headerName: 'Authorization',
  headerPrefix: 'Bearer',
  onResponse: body => body.token || false
})
 ```
 #### Initialisation parameters
 parameters | type | attributes | description
 ---------- | ---- | ---------- | ---
 url        | string | required | url on an external service to obtain a JSON Web Token
 onResponse | `function(object) -> string or false` | required | receives the response body to the call to `url` and returns the token it contains
 contentType | string | optional, default = `"application/json"` | Content-Type for the request sent to `url`
 headerName  | string | optional, default = `"Authorization"`| Name for the Authorization header
 headerPrefix | string | optional, default = `"Bearer"` | Will be prefix to the token in the Authorization header
 
 ### Obtaining a token
 ```javascript
// using async / await
const header = await jwt.auth({user: "name", pass: "word"})
// header == {"Authorization": "Bearer <YOUR_TOKEN>"}

// using Promises
jwt.auth({user: "name", pass: "word"})
  .then(header => {
    // header == {"Authorization": "Bearer <YOUR_TOKEN>"}
  })
```