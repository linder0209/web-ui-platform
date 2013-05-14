/*
 * GET home page.
 */

//exports.index = function (req, res) {
// res.render('index.ejs', { title: 'Express' });
// };
// exports.user = function (req, res) {
// };
// exports.post = function (req, res) {
// };
// exports.reg = function (req, res) {
// };
// exports.doReg = function (req, res) {
// };
// exports.login = function (req, res) {
// };
// exports.doLogin = function (req, res) {
// };
// exports.logout = function (req, res) {
// };

var crypto = require('crypto');
var User = require('../models/user');

exports.index = function (req, res) {
    res.render('index', {
        title: '首页'
    });
};
exports.reg = function (req, res) {
    res.render('reg', {
        title: '用户注册'
    });
};

exports.submitReg = function (req, res) {
    //检验用户两次输入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) {
        return res.redirect('/reg');
    }
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
        name: req.body.username,
        password: password
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (user)
            err = 'Username already exists.';
        if (err) {
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        newUser.save(function (err) {
            if (err) {
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            res.redirect('/');
        });
    });
};
