const skillsCtrl = require('./skills');
const productsCtrl = require('./products');

module.exports.admin = async (ctx) => {
  try {
    const msgfile = ctx.flash('msgfile')[0];
    const msgskill = ctx.flash('msgskill')[0];
  
    if (ctx.session.isAdmin) {
      ctx.render('pages/admin', {
        msgfile,
        msgskill
      });
    } else {
      ctx.redirect('/login');
    }
  } catch (err) {
    console.error('admin-render error', err);
    ctx.render('pages/login', {
      msgslogin: err.message
    });
  }
};

module.exports.changeIndexItems = async (ctx) => {
  try {
    switch (ctx.req.url) {
      case '/admin/upload':
        const result = await productsCtrl.addProduct(ctx.request);
      
        if (result) {
          ctx.flash('msgfile', result.message);
          ctx.redirect('/admin');
        } else {
          throw new Error();
        }
        break;
      case '/admin/skills':
        const resultSkill = await skillsCtrl.changeSkills(ctx.request.body);
        
        if (resultSkill) {
          ctx.flash('msgskill', resultSkill.message);
          ctx.redirect('/admin');
        } else {
          throw new Error();
        }
        break;
      default:
        console.error('admin-post error');
        throw new Error();
    }
  } catch (err) {
    console.error('admin-form error', err);
    ctx.render('pages/admin');
  }
};
