document.addEventListener("DOMContentLoaded", function () {
  loadHomePage(); // Load home page by default
});

function loadHomePage() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <h2>Welcome to Book Rental</h2>
    <p>Explore our collection and start renting books today!</p>
    <button onclick="loadBooksPage()">Explore Books</button>
    <h3>Featured Books</h3>
    <div id="featuredBooks" class="books-container"></div>
  `;

  // Fetch 6 books from the Google Books API for the home page
  fetchBooks("javascript", 15, "featuredBooks");
}

function loadBooksPage() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <h2>Explore Books</h2>
    <div id="exploreBooks" class="books-container"></div>
  `;

  // Fetch 12 books from the Google Books API for the Explore Books page
  fetchBooks("programming", 30, "exploreBooks");
}

function rentBook(bookTitle) {
  openRentModal(bookTitle);
}

function openRentModal(bookTitle) {
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <h2>Rent Book</h2>
    <p>Please provide your details to rent the book "${bookTitle}".</p>
    <form onsubmit="return handleRent('${bookTitle}')">
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" name="firstName" required>

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" name="lastName" required>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>

      <label for="address">Address:</label>
      <textarea id="address" name="address" required></textarea>

      <button type="submit">Rent</button>
    </form>
  `;

  const rentModal = document.getElementById("rentModal");
  rentModal.style.display = "block";
}

function closeRentModal() {
  const rentModal = document.getElementById("rentModal");
  rentModal.style.display = "none";
}

const apiUrl = 'http://localhost:3000'; // Update with your actual backend URL

function handleRent(bookTitle) {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;

  // Validate the form fields (you can add more validation as needed)

  // Create an object representing the rented book
  const rentedBook = {
    bookTitle,
    firstName,
    lastName,
    email,
    address,
  };

  // Send a POST request to the backend
  fetch(`${apiUrl}/rent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rentedBook),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Display a confirmation message
      alert(`Book "${bookTitle}" rented successfully by ${firstName} ${lastName}!`);

      // Close the modal after submitting the form
      closeRentModal();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });

  // Prevent the form from actually submitting (we're handling it here)
  return false;
}


function fetchBooks(query, maxResults, containerId) {
  // Replace 'YOUR_API_KEY' with your actual API key
  const apiKey = "AIzaSyAT7ABLxyJP5msDnFVJzuXGzEvZH6Ysk9w";

  // Fetch books from the Google Books API
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const booksContainer = document.getElementById(containerId);

      data.items.forEach((book) => {
        const bookInfo = book.volumeInfo;
        const bookHTML = `
          <div class="book">
            <img src="${bookInfo.imageLinks.thumbnail}" alt="Book Cover">
            <h4>${
              bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown Author"
            }</h4>
            <p>Title: ${bookInfo.title}</p>
            <button onclick="rentBook('${bookInfo.title}')">Rent</button>
          </div>
        `;
        booksContainer.innerHTML += bookHTML;
      });
    })
    .catch((error) => console.error(`Error fetching books: ${error}`));
}
