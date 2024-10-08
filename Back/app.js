const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
let mysql = require("mysql");

const app = express();
const port = process.env.PORT || 1234;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Utilisation du middleware CORS
app.use(cors());

// MySQL Code goes here
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookings',
  port: 8889
});

app.get("/", (req, res) => res.send("Express running"));

// Route pour récupérer les données
app.get('/bookings', (req, res) => {
  pool.query("SELECT * FROM bookings", (err, rows) => {
    if (err) {
      console.error("Erreur lors de la récupération des données:", err);
      return res.status(500).send("Erreur serveur");
    }
    console.log("Les données de la table bookings : \n", rows);
    res.json(rows); 
  });
});

app.get(`/bookings/:date`, (req, res) => {
  const date = req.params.date;
  pool.query("SELECT * FROM bookings WHERE date = ?", [date], (err, rows) => {
    if(err) {
      console.error("Erreur lors de la récupération des données:", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(rows);
  })
})

app.get('/opening/dayopen', (req, res) => {
  pool.query("SELECT * FROM opening_hours", (err, rows) => {
    if(err) {
      console.error("Erreur lors de la récupération des données:", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(rows);
  })
})

app.get('/opening/dayopen/:day', (req, res) => {
  const day = req.params.day;
  pool.query("SELECT * FROM opening_hours WHERE day_of_week = ?", [day], (err, rows) => {
    if(err) {
      console.error("Erreur lors de la récupération des données:", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(rows);
  })
})

app.post('/bookings', (req, res) => {
  const nameForm = req.body.name;
  const hourForm = req.body.hour;
  const dateForm = req.body.date;
  const emailForm = req.body.email;

  const sqlInsert = `INSERT INTO bookings (date, email, name, hour) VALUES (?, ?, ?, ?)`;

  pool.query(sqlInsert, [dateForm, emailForm, nameForm, hourForm], (err, rows) => {
    if(err) {
      console.error("Erreur lors de l'envoi des données:", err);
      return res.status(500).send("Erreur serveur");
    }
    res.json(rows);
  })
  /*return res.json({
    name: nameForm,
    hour: hourForm,
    date: dateForm,
    email: emailForm
  });*/
})

app.listen(port, () => console.log(`Serveur en écoute sur le port ${port}`));

module.exports = app;