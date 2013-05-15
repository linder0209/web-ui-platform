/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path'),
     settings = require('./settings'),
    partials = require('express-partials');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//noinspection JSValidateTypes

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: settings.cookieSecret
}));
app.use(partials());//注意运用partials一定要放在  app.use(app.router);之前设置
app.use(app.routes);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/reg', routes.reg);
app.post('/reg', routes.submitReg);
app.get('/login', routes.login);
app.post('/login', routes.submitLogin);
app.get('/logout', routes.logout);
app.post('/post', routes.post);
app.get('/u/:user', routes.user);

//app.post('/post', routes.post);

//app.get('/login', routes.login);
//app.post('/login', routes.doLogin);
//app.get('/logout', routes.logout);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


function Foo() {
    var innerVar = 'hello';
    this.prop1 = 'BYVoid';
    this.func1 = function () {
        innerVar = '';
    };
}
Foo.prototype.prop2 = 'Carbo';
Foo.prototype.func2 = function () {
    console.log(this.prop2);
};
var foo1 = new Foo();
var foo2 = new Foo();
console.log(foo1.func1 == foo2.func1); // 输出 false
console.log(foo1.func2 == foo2.func2); // 输出 true

function SubFoo(){};

SubFoo.prototype = new Foo();
SubFoo.prototype.constructor = subFoo;

var subFoo1 = new SubFoo();

subFoo1.func2();