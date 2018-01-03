const request = require('../request');

module.exports = {
  name: 'google',
  search: async keyword => {
    return [];
    // return request(`https://www.google.com/search?q=${keyword}`)
    //   .then(res => res.text())
    //   .then(html => {
    //     console.log(html);
    //     return [];
    //   })
  }
};