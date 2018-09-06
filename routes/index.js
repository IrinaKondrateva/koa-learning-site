const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const indexCtrl = require('../controllers/index');
const loginCtrl = require('../controllers/login');
const adminCtrl = require('../controllers/admin');

router.get('/', indexCtrl.index);
router.post('/', koaBody(), indexCtrl.sendEmail);

router.get('/login', loginCtrl.login);
router.post('/login', koaBody(), loginCtrl.auth);

router.get('/admin', adminCtrl.admin);
router.post('/admin/:id', koaBody({
  multipart: true,
  formidable: {
    uploadDir: process.cwd() + '/public/upload'
  }
}), adminCtrl.changeIndexItems);

module.exports = router;
