/*
    server.js
    main server script for our task list web service
*/

var express = require('express'); //load express
var sqlite = require('sqlite3'); //load sqlite
var bodyParser = require('body-parser');

var app = express(); //make express app

var port = 8000;

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());

// app.get('/', function(req, res, next) {
//     res.send('<h1>Hello world!</h1>');
// });

app.get('/api/tasks', function(req, res, next) {
    var sql = 'select rowid, title, done, createdOn from tasks where done != 1';
    db.all(sql, function(err, rows) {
        if(err) {
            return next(err);
        }

        res.json(rows);

    });
});

app.post('/api/tasks', function(req, res, next) {

    var newTask = {
        title: req.body.title || 'Unnamed Task',
        done: false,
        createdOn: new Date()
    };

    var sql = 'insert into tasks(title, done, createdOn) values (?,?,?)';
    db.run(sql, [newTask.title, newTask.done, newTask.createdOn], function(err) {
        if(err) {
            return next(err);
        }

        newTask.rowid = this.lastID; //gets the last number from the database

        res.status(201)
            .location('/api/tasks/' + newTask.rowid)
            .json(newTask);
    });
});

app.put('/api/tasks/:rowid', function(req, res, next) {
    var sql = 'update tasks set done = ? where rowid = ?';
    db.run(sql, [req.body.done, req.params.rowid], function(err) {
        if(err) {
            return next(err);
        }
        //res.status(200);
        res.json({});
    });
});

var db = new sqlite.Database(__dirname + '/data/tasks.db', function(err) {
    if(err) {
        throw err;
    }
    var sql = 'create table if not exists tasks(title string, done int, createdOn datetime)';
    db.run(sql, function(err) {
        if(err) {
            throw err;
        }

        //start listening
        app.listen(port, function() {
            console.log('Server is listening on ' + port);
        });

    });

});

