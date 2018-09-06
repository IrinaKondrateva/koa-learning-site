const skillsCtrl = require('./skills');
const productsCtrl = require('./products');
const sendEmailCtrl = require('./sendemail');

module.exports.index = async (ctx) => {
  try {
    const result = await Promise.all([skillsCtrl.getSkills(), productsCtrl.getProducts()]);
    const [ skills, products ] = result;
    const msg = ctx.flash('msgsemail')[0];

    ctx.render('pages/index', {
      skills: skills,
      products: products,
      msgsemail: msg
    });
  } catch (err) {
    console.error('index-render error', err);
    ctx.render('pages/index', {
      skills: [],
      products: []
    });
  }
};

module.exports.sendEmail = async (ctx) => {
  try {
    const result = await sendEmailCtrl.sendEmail(ctx.request.body);
    
    if (result) {
      ctx.flash('msgsemail', result.message);
      return ctx.redirect('/');
    } else {
      throw new Error('index-form error');
    }
  } catch (err) {
    console.error('index-form error', err);
    ctx.render('pages/index');
  }
};
