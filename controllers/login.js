const loginValidCtrl = require('../libs/login-valid');

module.exports.login = async (ctx) => {
  try {
    const msg = ctx.flash('msgslogin')[0];
    
    ctx.render('pages/login', {
      msgslogin: msg
    });
  } catch (err) {
    console.error('login-render error', err);
    ctx.render('pages/login');
  }
};

module.exports.auth = async (ctx) => {
  try {
    const result = await loginValidCtrl.loginValid(ctx.request.body);

    if (result && result.success) {
      ctx.session.isAdmin = true;
      return ctx.redirect('/admin');
    } else if (result && !result.success) {
      ctx.flash('msgslogin', result.message);
      return ctx.redirect('/login');
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error('login-form error', err);
    ctx.render('pages/login');
  }
};
