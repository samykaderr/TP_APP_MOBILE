// script.js
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

const grid = document.getElementById("books-grid");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const addBookForm = document.getElementById("addBookForm");
const bookCount = document.getElementById("book-count");
const addBookModalEl = document.getElementById("addBookModal");
const addBookModal = addBookModalEl ? new bootstrap.Modal(addBookModalEl) : null;

function renderBooks(list, filterText = "") {
  const query = filterText.trim().toLowerCase();
  const filtered = query
    ? list.filter(({ title, author }) =>
        `${title} ${author}`.toLowerCase().includes(query)
      )
    : list;

  grid.innerHTML = "";

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning text-center empty-state" role="alert">
          Aucun livre ne correspond à votre recherche.
        </div>
      </div>`;
  } else {
    filtered.forEach((book) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${book.image || "https://placehold.co/400x600?text=Livre"}" class="card-img-top" alt="${book.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-1">${book.title}</h5>
            <p class="card-subtitle mb-2 text-muted text-ellipsis">${book.author}</p>
            <p class="card-text flex-grow-1">${book.description}</p>
            <button class="btn btn-outline-primary mt-2" type="button">Proposer un échange</button>
          </div>
        </div>`;
      grid.appendChild(col);
    });
  }

  bookCount.textContent = `${filtered.length} livre${filtered.length > 1 ? "s" : ""}`;
}

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  renderBooks(books, searchInput.value);
});

addBookForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (!addBookForm.checkValidity()) {
    addBookForm.classList.add("was-validated");
    return;
  }

  const formData = new FormData(addBookForm);
  const newBook = {
    title: formData.get("title").trim(),
    author: formData.get("author").trim(),
    description: formData.get("description").trim(),
    image: formData.get("image").trim() || "https://placehold.co/400x600?text=Livre",
  };

  books.push(newBook);
  addBookForm.reset();
  addBookForm.classList.remove("was-validated");
  renderBooks(books, searchInput.value);
  addBookModal?.hide();
});

// Function to fetch books from the backend
async function getBooksFromBackend() {
  try {
    const response = await fetch('/books', { method: 'GET' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fetchedBooks = await response.json();
    books.length = 0; // Clear the existing books array
    books.push(...fetchedBooks); // Populate with fetched books
    renderBooks(books); // Re-render the books on the page
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

// Call the function on page load
window.addEventListener('load', getBooksFromBackend);

// Render initial list
renderBooks(books);
