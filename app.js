const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const { name } = require('ejs');

const app = express();
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users'
});

connection.connect((err) =>{
    if(err){
        console.error("Terjadi kesalahan dalam kondisi ke MySQL:", err.stack);
    }
    console.log("Koneksi MySQL berhasil dengan id" + connection.threadId)
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        res.render('index', {users: results});
    });
});

app.post('/add', (req, res) =>{
    const {name, email, phone} = req.body;
    const query = 'INSERT INTO users (name, email, phone) VALUES (?,?,?)';
    connection.query(query, [name, email, phone], (err, result) =>{
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) =>{
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if(err) throw err;
        res.render('edit', {user: result[0]});
    });
});

app.post('/update/:id', (req, res) =>{
    const {name, email, phone} = req.body;
    const query = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
    connection.query(query, [name, email, phone, req.params.id], (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) =>{
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [req.params.id], (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.listen(3000, () =>{
    console.log("Server berjalan diport 3000, buka web melalui http://localhost:3000")
});
