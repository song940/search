const request = require('../request');

module.exports = {
  name: 'npm',
  search: async keyword => {
    return [];
    return request(`https://registry.npmjs.com/${encodeURIComponent(keyword)}`)
      .then(res => res.json())
      .then(package => {
        return package.name ? [
          {
            title      : package.name,
            description: package.description,
            link       : `https://npmjs.org/${package.name}`
          }
        ] : [];
      })
  }
};