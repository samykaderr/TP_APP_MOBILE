let books = [];
const CACHE_DURATION_MS = 2 * 60 * 1000; // 2 minutes en millisecondes

/* --- Affichage conditionnel des sections --- */
function showShareForm() {
  document.getElementById("books-section").style.display = "none";
  document.getElementById("share-form-section").style.display = "block";
}

function showBooks() {
  document.getElementById("share-form-section").style.display = "none";
  document.getElementById("books-section").style.display = "block";
}

/* --- Affichage des livres dans la liste --- */
function displayBooks(list) {
  const listContainer = document.getElementById("books-list");
  listContainer.innerHTML = ""; // On vide avant de re-remplir
  list.forEach(book => {
    const bookCard = `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${book.image}" class="card-img-top" alt="Image du livre ${book.title}">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
            <p class="card-text">${book.description}</p>
          </div>
        </div>
      </div>
    `;
    listContainer.innerHTML += bookCard;
  });
}

/* --- Chargement des livres au démarrage --- */
window.onload = function () {
  getBooksFromBackend();
  startAutoRefresh();
};

async function getBooksFromBackend() {
    const lastDownloadTime = localStorage.getItem("lastDownloadTime");
    const now = Date.now(); // Timestamp actuel en ms depuis l'époque Unix
  
    // On vérifie si des données existent ET si elles ont moins de 2 minutes
    const cacheIsValid =
      lastDownloadTime && (now - parseInt(lastDownloadTime)) < CACHE_DURATION_MS;
  
    if (cacheIsValid) {
      // Les données sont encore fraîches — on les lit depuis localStorage
      const cachedBooks = localStorage.getItem("books");
      books = JSON.parse(cachedBooks); // localStorage ne stocke que des chaînes, d'où le parse
      console.log("📦 Livres chargés depuis le cache localStorage.");
      displayBooks(books);
      return; // On sort de la fonction sans faire d'appel réseau
    }
  
    // Le cache est vieux ou inexistant — on télécharge depuis le backend
    try {
      const response = await fetch("http://localhost:3000/books");
      if (!response.ok) throw new Error(`Erreur : ${response.status}`);
  
      books = await response.json();
  
      // On sauvegarde les données ET l'heure du téléchargement dans localStorage
      localStorage.setItem("books", JSON.stringify(books));
      localStorage.setItem("lastDownloadTime", now.toString());
  
      console.log("🌐 Livres téléchargés depuis le serveur et mis en cache.");
      displayBooks(books);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    }
  }

/* --- Interception de la soumission du formulaire --- */
function handleFormSubmit(event) {
  // On empêche le rechargement de la page (comportement natif du formulaire)
  event.preventDefault();
  submitNewBook();
}

/* --- Envoi du nouveau livre au back-end --- */
async function submitNewBook() {
  // On construit un objet JSON avec les valeurs du formulaire
  const newBook = {
    title:  document.getElementById("title").value,
    author: document.getElementById("author").value,
    year:   parseInt(document.getElementById("year").value),
    genre:  document.getElementById("genre").value,
    description: document.getElementById("description").value,
    image: document.getElementById("image").value || '/resource/EldenRing.png' // Default image
  };

  try {
    const response = await fetch("http://localhost:3000/books", {
      method: "POST",
      // On indique au serveur que le corps est du JSON
      headers: { "Content-Type": "application/json" },
      // On sérialise l'objet en chaîne JSON
      body: JSON.stringify(newBook),
    });

    if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);

    const result = await response.json();
    alert(`✅ Livre "${result.title}" ajouté avec succès !`);

    // On vide le cache pour forcer le téléchargement de la nouvelle liste
    localStorage.removeItem("lastDownloadTime");

    // On recharge la liste et on revient à la section principale
    await getBooksFromBackend();
    showBooks();
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    alert("❌ Impossible d'ajouter le livre.");
  }
}

window.addEventListener("beforeunload", function (event) {
    const lastDownloadTime = localStorage.getItem("lastDownloadTime");
  
    if (!lastDownloadTime) return; // Aucune donnée en cache, on laisse passer
  
    const elapsed = Date.now() - parseInt(lastDownloadTime);
  
    if (elapsed < CACHE_DURATION_MS) {
      const secondsAgo = Math.floor(elapsed / 1000);
  
      // Ce message s'affiche dans la boîte de dialogue native du navigateur
      const message = `⚠️ Les données ont été chargées il y a seulement ${secondsAgo} secondes. Voulez-vous vraiment actualiser ?`;
  
      // Pour que la boîte de dialogue apparaisse, il faut affecter event.returnValue
      event.returnValue = message; // Requis par la plupart des navigateurs modernes
      return message;              // Pour la compatibilité avec les anciens navigateurs
    }
  });

  function startAutoRefresh() {
    // setInterval exécute une fonction de façon répétée à l'intervalle donné (en ms)
    setInterval(async function () {
      console.log(`🔄 [${new Date().toLocaleTimeString()}] Vérification du cache et rafraîchissement automatique...`);
      await getBooksFromBackend();
    }, CACHE_DURATION_MS); // Toutes les 2 minutes (120 000 ms)
  }

