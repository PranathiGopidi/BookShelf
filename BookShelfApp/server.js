var express = require('express');
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'pages')));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
const url = 'mongodb://localhost:27017';
const dbName = 'mydb';

mongoose.connect('mongodb://localhost/mydb');

var Schema = new mongoose.Schema({
    BookName: String,
    ISBN: String,
    AuthorName: String,
    YearPublished: String,
    ReadBooks:String
});

var book = mongoose.model('documents', Schema);

app.post('/new', function(req, res){
    new book({
        BookName:req.body.BookName,
        ISBN:req.body.ISBN,
        AuthorName:req.body.AuthorName,
        YearPublished:req.body.YearPublished,
        ReadBooks:req.body.ReadBooks,
    }).save(function(err, docs){
        if(err) res.json(err);
        else {
            res.redirect('/#/Home');
        }
    });
});

app.get('/view', function(req, res){
    book.find({}, function(err, docs){
        if(err) res.json(err);
        else    res.render('index', {books: docs});
    });
});


var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
})