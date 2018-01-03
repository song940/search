const URI = require('url');

module.exports = (url, params) => {
  return new Promise((resolve, reject) => {
    params = Object.assign(URI.parse(url, true), params);
    const curl = require(params.protocol.slice(0, -1));
    const request = curl.request(params, response => {
      const buffer = []; response
        .on('error', reject)
        .on('data', buffer.push.bind(buffer))
        .on('end', () => {
          const data = Buffer.concat(buffer);
          response.blob = () => data;
          response.text = () => data.toString();
          response.json = () => JSON.parse(response.text());
          resolve(response);
        });
    });
    if(params.body) {
      if(typeof params.body === 'object'){
        params.body = JSON.stringify(params.body);
      }
      request.write(params.body);
    }
    request.end();
  });
};