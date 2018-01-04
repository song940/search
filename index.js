const fs     = require('fs');
const pug    = require('pug');
const path   = require('path');
const http   = require('http');
const kelp   = require('kelp');
const body   = require('kelp-body');
const send   = require('kelp-send');
const route  = require('kelp-route');
const logger = require('kelp-logger');
const render = require('kelp-render');
const static = require('kelp-static');

const engines = fs
  .readdirSync(path.join(__dirname, './engines'))
  .map(file => path.join(__dirname, './engines', file))
  .map(file => require(file))

const app = kelp();

app.use(send);
app.use(body);
app.use(logger);
app.use(static('./public'));
app.use(render({
  templates: 'views',
  extension: 'pug'  ,
  compiler : (content, filename) => {
    return pug.compileFile(filename);
  }
}));

app.use(route('get', '/', async (req, res, next) => {
  res.render('index');
}));

app.use(route('/search', async (req, res, next) => {
  const { q } = req.query;
  const results = await Promise
    .all(engines.map(engine => engine.search(q)))
    .then(results => {
      return results.reduce((cur, next) => {
        return [].concat.apply(cur, next);
      }, []);
    });
    res.render('search', { results, query: q });
}));

app.use((_, res) => res.send(404));
const server = http.createServer(app);
server.listen(3000, () => {
  console.log('server is running at %s', server.address().port);
});