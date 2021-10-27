const cheerio = require('cheerio');
const request = require('../request');

module.exports = {
  name: 'baidu',
  search: async keyword => {
    return request(`http://www.baidu.com/s?wd=${encodeURIComponent(keyword)}&pn=1`)
      .then(res => res.text())
      .then(html => {
        const results = [];
        const $ = cheerio.load(html);
        $('div.c-container').each(function (counter, element) {
          var linkElem = $(element).find('h3.t a')
          var descElem = $(element).find('div.c-abstract')
          var item = {
            title: $(linkElem).first().text(),
            link: $(linkElem).attr('href'),
            description: null
          }
          $(descElem).find('div').remove()
          item.description = $(descElem).text()

          results.push(item)
        })
        return results;
      })
  }
};