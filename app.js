const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pokemon',
  database: 'list_app'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM tasks',
    (error, results) => {
      res.render('top.ejs', {tasks: results});
    });
});

app.get('/complete-list', (req, res) => {
  connection.query(
    'SELECT * FROM completes',
    (error, results) => {
      res.render('complete-list.ejs', {completes: results});
    });
  });

app.post('/complete/:id', (req, res) => {
  connection.query(
    'INSERT into list_app.completes SELECT * from list_app.tasks WHERE id = ?',
    [req.params.id],
    (error, results) => {
      connection.query(
        'DELETE FROM tasks WHERE id = ?',
        [req.params.id],
        (error, results) => {
          res.redirect('/');
        });
    });
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO tasks(name) VALUES (?)',
    [req.body.taskName],
    (error, results) => {
      res.redirect('/');
    });
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM tasks WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/')});
});

app.post('/complete-list-delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM completes WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/complete-list');
  });
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM tasks WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {task: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'update tasks set name=? where id=?',
    [req.body.taskName, req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  );
});

app.listen(3000);
