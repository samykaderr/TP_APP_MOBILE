const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Middleware pour parser le JSON entrant
app.use(express.json());
// CORS nécessaire pour autoriser les requêtes depuis le front-end (autre origine)
app.use(cors());
// Serveur statique pour le dossier front-end
app.use(express.static(path.join(__dirname, 'front')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/resource', express.static(path.join(__dirname, 'resource')));

// Données simulées (en Série 1 Exo 3, ceci viendrait d'une vraie base de données)
let books = [
  { id: 1, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", year: 1943, genre: "Fiction", description: "Un conte poétique et philosophique sous l'apparence d'une histoire pour enfants.", image: "/resource/EldenRing.png" },
  { id: 2, title: "1984",            author: "George Orwell",             year: 1949, genre: "Dystopie", description: "Un roman d'anticipation décrivant une société totalitaire et la manipulation de la vérité.", image: "/resource/img1.png"  },
  { id: 3, title: "L'Étranger",      author: "Albert Camus",              year: 1942, genre: "Absurde", description: "Un homme indifférent au monde qui l'entoure, jusqu'au meurtre.", image: "/resource/img2.png" },
  { id: 4, title: "Dune",            author: "Frank Herbert",             year: 1965, genre: "Science-Fiction", description: "Une saga de science-fiction politique et écologique sur une planète désertique.", image: "/resource/img3.png" },
  { id: 5, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien",    year: 1954, genre: "Fantasy", description: "Une quête épique pour détruire un anneau de pouvoir et sauver la Terre du Milieu.", image: "/resource/img4.png" },
];

// Route GET /books — répond avec la liste complète des livres
app.get("/books", (req, res) => {
  // On renvoie le tableau au format JSON avec le code 200 (OK)
  res.status(200).json(books);
});

app.post("/books", (req, res) => {
  const newBook = req.body; // Express a déjà parsé le JSON grâce à express.json()

  // Affichage dans la console du serveur — c'est l'objectif de cet exercice
  console.log("📖 Nouveau livre reçu :", newBook);

  // On lui assigne un ID simple et on l'ajoute à notre tableau
  newBook.id = books.length + 1;
  books.push(newBook);

  // On répond avec le livre créé et le code 201 (Created)
  res.status(201).json(newBook);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
});

app.listen(3000, () => console.log("Serveur démarré sur http://localhost:3000"));