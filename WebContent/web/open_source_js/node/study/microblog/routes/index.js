/*
 * GET home page.
 */

/*exports.index = function (req, res) {
 res.render('index.ejs', { title: 'Express' });
 };
 exports.user = function (req, res) {
 };
 exports.post = function (req, res) {
 };
 exports.reg = function (req, res) {
 };
 exports.doReg = function (req, res) {
 };
 exports.login = function (req, res) {
 };
 exports.doLogin = function (req, res) {
 };
 exports.logout = function (req, res) {
 };*/

var crypto = require('crypto');
var User = require('../models/user.js');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {
            title: '首页'
        });
    });
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '用户注册'
        });
    });

    app.post('/reg', function (req, res) {
        //检验用户两次输入的口令是否一致
        if (req.body['password-repeat'] != req.body['password']) { //req.body 就是 POST 请求信息解析过后的对象
            /**
             * req.flash Express 提供的一个奇妙的工具，通过它保存的变量只会在用户当前
             和下一次的请求中被访问，之后会被清除，通过它我们可以很方便地实现页面的通知
             和错误信息显示功能。
             */
            req.flash('error', '两次输入的口令不一致');
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
                req.flash('error', err);
                return res.redirect('/reg');
            }
            //如果不存在则新增用户
            newUser.save(function (err) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.flash('success', '注册成功');
                res.redirect('/');
            });
        });
    });
};