const booksContainer = document.getElementById("books");

const fetchBooks = async () => {
  try {
    const res = await fetch("https://gutendex.com/books/");
    const data = await res.json();

    showBooks(data);
  } catch (err) {
    console.log(err);
  }
};
const showBooks = (books) => {
  //   show book lists

  books.results.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    console.log(book);
    const image = book.formats["image/jpeg"];

    bookCard.innerHTML = `
    <img class="book-img" src="${image}"/>
    <h1 class="book-title">${book.title}</h1>
    <p>author</p>
    <p>${book.summaries.slice(0, 2)}</p>
    `;

    booksContainer.appendChild(bookCard);
  });
};
fetchBooks();
