const fs = require('fs');

module.exports = async (file) => {
  const fileName = `${file}/src/apiCall.js`
  const code = `
  import fetch from 'isomorphic-unfetch';
  const queryString = require('query-string');

  import { apiURL } from '../config';

  module.exports = ({ url, method, data, params = null }) => {
    // Default options are marked with *
    let stringified = "";
    if (params) {
      stringified = \`?\${queryString.stringify(params)}\`;
    }
    const fetchObject = {
      headers: {
        'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        // Authorization?
      },
      // credentials: 'include', // include, *same-origin, omit
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      mode: 'cors', // no-cors, cors, *same-origin
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
    }
    if (method) fetchObject.method = method;
    if (data) fetchObject.body = JSON.stringify(data);

    return fetch(\`\${apiURL}/\${url}\${stringified}\`, fetchObject)
    .then(response => response.json());
  }
  `;
  fs.writeFileSync(fileName, code);
};
