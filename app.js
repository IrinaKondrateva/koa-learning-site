const Koa = require('koa');
const app = new Koa();
const statickoa = require('koa-static');
const session = require('koa-session');
const Pug = require('koa-pug');
const pug = new Pug({
  viewPath: './views',
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app
});
const fs = require('fs');
const flash = require('koa-better-flash');
const config = require('./config');
const errorHandler = require('./libs/error');

app.use(statickoa('./public'));

const router = require('./routes');

app.use(errorHandler);
app
  .use(session(config.session, app))
  .use(flash())
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', (err, ctx) => {
  console.error(err);
  ctx.render('error', {
    status: ctx.response.status,
    msg: ctx.response.message
  });
});

app.listen(3000, () => {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log('Server start 3000');
});

module.exports = app;
