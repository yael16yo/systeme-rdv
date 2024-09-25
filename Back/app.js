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

app.post('/')

app.listen(port, () => console.log(`Serveur en écoute sur le port ${port}`));