const cheerio = require('cheerio');
const request = require('../request');

module.exports = {
  name: 'google',
  search: async keyword => {
    return request(`https://www.google.com.hk/search?hl=en&q=${encodeURIComponent(keyword)}&start=0&sa=N&num=10&ie=UTF-8&oe=UTF-8&gws_rd=ssl`)
      .then(res => res.text())
      .then(html => {
        const links = [];
        const $ = cheerio.load(html);
        $('div.g').each(function (i, elem) {
          var linkElem = $(elem).find('h3.r a')
          var descElem = $(elem).find('div.s')
          $(descElem).find('div').remove()
          const title = $(linkElem).first().text();
          const link = $(linkElem).attr('href');

          if(title && link){
            links.push({
              title,
              link: link.replace('/url?q=', ''),
              description: $(descElem).text(),
            });
          }
        })
        return links;
      })
  }
};