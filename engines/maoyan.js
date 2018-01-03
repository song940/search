const request = require('../request');

module.exports = {
  search: async keyword => {
    return request(`http://api.maoyan.com/mmdb/search/integrated/keyword/list.json?almtype=1&ci=0&keyword=${encodeURIComponent(keyword)}`)
      .then(res => res.json())
      .then(res => res.data[0].list)
      .then(results => {
        return results ? results.map(result => {
          return {
            title: result.nm,
            description: [ result.cat, result.star, result.pubDesc].filter(Boolean).join(' / '),
            link: `http://maoyan.com/films/${result.id}`
          };
        }) : []
      })
  }
};