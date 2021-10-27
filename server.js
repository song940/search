const fs = require('fs');
const pug = require('pug');
const path = require('path');
const render = require('kelp-render');
const static = require('kelp-static');
const { createServer, Response } = require('kelp-server');

const engines = fs
  .readdirSync(path.join(__dirname, './engines'))
  .map(file => path.join(__dirname, './engines', file))
  .map(file => require(file))

class Home {
  index({ query }) {
    const { q: keyword } = query;
    return Response
      .create()
      .html('index', { keyword, results: [] })
  }
  async search(req) {
    const { q } = req.query;
    const results = [];
    for (const { name, search } of engines) {
      try {
        const items = await search(q);
        results.push(...items);
      } catch (e) {
        console.log(name, e.name, e.message);
      }
    }
    return { results, query: q };
  }
}

const server = createServer({
  routes: [
    'get /       => Home#index',
    'get /search => Home#search',
  ],
  middlewares: [
    static('./public'),
    render({
      extension: 'pug',
      templates: 'views',
      renderer: pug.compileFile,
    })
  ],
  controllers: [Home]
});

server.listen(3000, () => {
  console.log('server is running at %s', server.address().port);
});