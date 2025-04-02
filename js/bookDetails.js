const bookDetailsDiv = document.getElementById("bookDetails");

const fetchBookById = async () => {
  const urlParams = window.location.search;
  const bookId = urlParams.split("=")[1];

  const res = await fetch(`https://gutendex.com/books/${bookId}`);
  const book = await res.json();

  showDetails(book);
};

const showDetails = (book) => {
  const image = book.formats["image/jpeg"];
  console.log(book);
  const author = book?.authors.map((author) => author.name);
  console.log(book.authors);
  const genres = book?.subjects.join(",");
  bookDetailsDiv.innerHTML = `
    <div class="img-container">
        <img class="img" src="${image}" />
    </div>
    <div class="divider"></div>
    <div class="details">
        <h2 class="title">${book.title}</h2>
        <p><span>Book ID:</span> ${book.id}</p>
        <p class="authors"><span>Authors:</span> ${author}</p>
        <p><span>Genres:</span> ${genres}</p>
        <p><span>Summaries:</span> ${book.summaries}</p>
        <p><span>Genres:</span> ${genres}</p>
        <p><span>Summaries:</span> ${book.summaries}</p>
    </div>
  `;
};
fetchBookById();
