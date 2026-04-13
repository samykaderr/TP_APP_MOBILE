const express = require("express");

const path = require('path');
const app = express();

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/resource', express.static(path.join(__dirname, 'resource')));

// Middleware to parse JSON bodies
app.use(express.json());

// Route pour servir votre fichier index.html situé dans le dossier "front"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'front/index.html'));
});

// Route to handle GET requests for /books
app.get('/books', (req, res) => {
    const books = [
        {
            title: "Le Petit Prince",
            author: "Antoine de Saint-Exupéry",
            description: "Un conte philosophique sur l'amitié et l'amour",
            image: "/resource/EldenRing.png",
        },
        {
            title: "1984",
            author: "George Orwell",
            description: "Un roman dystopique sur la surveillance de masse",
            image: "/resource/img1.png",
        },
        {
            title: "L'Étranger",
            author: "Albert Camus",
            description: "Un roman sur l'absurdité de l'existence",
            image: "/resource/img2.png",
        },
        {
            title: "Les Misérables",
            author: "Victor Hugo",
            description: "L'histoire de Jean Valjean dans la France du XIXe siècle",
            image: "/resource/img3.png",
        },
        {
            title: "Le Rouge et le Noir",
            author: "Stendhal",
            description: "L'ascension sociale de Julien Sorel",
            image: "/resource/img4.png",
        },
        {
            title: "Madame Bovary",
            author: "Gustave Flaubert",
            description: "Le roman d'une femme insatisfaite",
            image: "/resource/img1.png",
        },
    ];

    res.json(books);
});

// Route to handle POST requests for /books
app.post('/books', (req, res) => {
    const newBook = req.body;

    if (!newBook.title || !newBook.author || !newBook.description) {
        return res.status(400).json({ error: 'Missing required fields: title, author, or description' });
    }

    console.log('New book received:', newBook);
    res.status(201).json({ message: 'Book added successfully', book: newBook });
});

// Lancement du serveur sur le port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log('Listening on http://localhost:' + PORT);
});