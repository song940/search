const fs     = require('fs');
const path   = require('path');
const http   = require('http');
const kelp   = require('kelp');
const body   = require('kelp-body');
const send   = require('kelp-send');
const logger = require('kelp-logger');

const engines = fs
  .readdirSync(path.join(__dirname, './engines'))
  .map(file => path.join(__dirname, './engines', file))
  .map(file => require(file))

const app = kelp();

app.use(send);
app.use(body);
app.use(logger);

app.use(async (req, res, next) => {
  if(!req.path.startsWith('/search')) 
    return next();
  const { q } = req.query;
  const results = await Promise
    .all(engines.map(engine => engine.search(q)))
    .then(results => {
      return results.reduce((cur, next) => {
        return [].concat.apply(cur, next);
      }, []);
    });
    res.send(render(results));
});

app.use((_, res) => res.send(404));
const server = http.createServer(app);
server.listen(3000, () => {
  console.log('server is running at %s', server.address().port);
});

const renderItem = ({ title, description, link }) => {
  return `
    <div class="result" >
      <a href="${link}">
        <h3>${title}</h3>
        <p>${description}</p>
        <p class="result-link" >${link}</p>
      </a>
    </div>
  `;
};

const render = results => {
  return `
  <!doctype html>
  <html>
    <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8">
      <title></title>
      <style>
      body{
        background: #efefef;
      }
      .container{
        width: 50%;
        margin: auto;
        overflow: hidden;
      }
      .container > h1{
        text-align: center;
      }
      .result{
        padding: 10px;
        background: #fff;
        border: 1px solid #ececec;
      }
      .result > a {
        color: #333;
        text-decoration: none;
      }
      .result-link{
        color: #999;
        font-size: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Web Search</h1>
        <form action="/search">
          <input name="q" >
        </form>
        <div>
          ${results.map(renderItem).join('<br />')}
        </div>
      </div>
    </body>
  </html>
  `;
};