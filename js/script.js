const booksContainer = document.getElementById("books");

const fetchBooks = async (searchQuery = "", filter = "") => {
  try {
    // at first show the loading element
    booksContainer.innerHTML = "<h4>..Loading</h4>";

    // fetch the data by searchquery
    const res = await fetch(
      `https://gutendex.com/books/?search=${encodeURIComponent(searchQuery)}`
    );
    const data = await res.json();
    let books = data.results;

    const topics = [];

    // get all topics in a single array
    books.forEach((book) =>
      book?.subjects?.forEach(
        (subject) => !topics.includes(subject) && topics.push(subject)
      )
    );

    // set topics in filter option
    const bookFilter = document.getElementById("bookFilter");
    topics.forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic;
      option.innerText = topic;

      bookFilter.appendChild(option);
    });

    if (filter) {
      books = data.results.filter((book) => book.subjects.includes(filter));
    }

    // show the books
    showBooks(books);
  } catch (err) {
    console.log(err);
  }
};
const showBooks = (books) => {
  booksContainer.innerHTML = "";
  //   show book lists

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    const image = book.formats["image/jpeg"];
    const author = book?.authors[0].name;
    const genres = book?.subjects.join(",");

    bookCard.innerHTML = `
    <img class="book-img" src="${image}"/>
    <div class="book-info">

    <p class="book-id">#${book.id}</p>
    <h2 class="book-title">${book.title}</h2>
    <p>By: ${author}</p>
    <p class="genres">${genres}</p>
    <button onclick="handleAddCart(${book.id})" class="cart-btn"> <i class="far fa-heart"></i></button>
    </div>
    `;

    booksContainer.appendChild(bookCard);
  });
};
fetchBooks();

const handleSearch = () => {
  const searchText = document.getElementById("searchText").value;
  fetchBooks(searchText);
};

const filterBooks = (e) => {
  fetchBooks("", e.target.value);
};

// handle add to cart
const handleAddCart = (id) => {
  const carts = JSON.parse(localStorage.getItem("carts")) || [];
  if (!carts.includes(id)) {
    carts.push(id);
    localStorage.setItem("carts", JSON.stringify(carts));
    alert(`${id} is added to cart`);
  } else {
    alert("This book is already in cart!");
  }
};
