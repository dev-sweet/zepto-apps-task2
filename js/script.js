const booksContainer = document.getElementById("books");

const fetchBooks = async (
  searchQuery = "",
  filter = "",
  currentURL = "https://gutendex.com/books/"
) => {
  const url = searchQuery
    ? `${currentURL}?search=${encodeURIComponent(searchQuery)}`
    : currentURL;

  try {
    // at first show the loading element
    booksContainer.innerHTML = `<h4 class="books-loading">..Loading</h4>`;

    // fetch the data by searchquery
    const res = await fetch(url);
    const data = await res.json();
    let books = data.results;

    const topics = [];

    // get all topics in a single array
    books?.forEach((book) =>
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

      if (topic === filter) {
        option.selected = true;
      }
      bookFilter.appendChild(option);
    });

    if (filter) {
      books = data.results.filter((book) => book.subjects.includes(filter));
    }

    showBooks(books);
    updatePaginationButtons(data.next, data.previous, filter);
    savePreferences(searchQuery, filter);
  } catch (err) {
    console.log(err);
  }
};

// show books after fetch
const showBooks = (books) => {
  booksContainer.innerHTML = "";

  // if no books found
  if (!books.length) {
    booksContainer.innerHTML = `<h1>No result matches</h1>`;
  }

  //   show book lists
  const carts = JSON.parse(localStorage.getItem("carts"));
  books.forEach((book) => {
    const bookCard = document.createElement("div");

    // handle click event on clicking card
    bookCard.addEventListener("click", (e) => {
      window.location.href = `/bookDetails.html?id=${book.id}`;
    });

    bookCard.classList.add("book-card");

    const image = book?.formats["image/jpeg"];
    const author = book?.authors[0]?.name;
    const genres = book?.subjects.slice(0, 2).join(",");

    bookCard.innerHTML = `
   <img class="book-img" src="${image}"/>
    <div class="book-info">

    <p class="book-id">#${book.id}</p>
    <h2 class="book-title">${book.title}</h2>
    <p>By: ${author}</p>
    <p class="genres">Topics: ${genres}</p>
    
    
      ${
        !carts?.includes(book.id)
          ? ` <button  onclick="handleAddCart(event,${book.id})" class="cart-btn">
          <i class="far fa-heart"></i>
        </button>`
          : ` <button onclick="removeCart(event,${book.id})" class="cart-btn">
          <i class="fa fa-heart"></i>
        </button>`
      }
  
    </div>
    `;

    booksContainer.appendChild(bookCard);
  });
};

// update the pagination button
const updatePaginationButtons = (next, previous, filter) => {
  const nextBtn = document.getElementById("next-page");
  const prevBtn = document.getElementById("prev-page");

  nextBtn.disabled = !next || filter;
  prevBtn.disabled = !previous || filter;

  if (next) {
    nextBtn.onclick = () => fetchBooks("", "", next);
  }
  if (previous) {
    prevBtn.onclick = () => fetchBooks("", "", previous);
  }
};

// save preferences
const savePreferences = (search, filter) => {
  localStorage.setItem("search", search);

  localStorage.setItem("filter", filter);
};
// load freferences
const loadPreferences = () => {
  const search = localStorage.getItem("search");
  const filter = localStorage.getItem("filter") || "";

  if (search) {
    document.getElementById("searchText").value = search;
  }

  document.getElementById("bookFilter").value = filter;
  fetchBooks(search, filter);
};
loadPreferences();
// event function

// handle events when type
document.getElementById("searchText").addEventListener("input", (e) => {
  const search = e.target.value;
  const filter = document.getElementById("bookFilter").value;

  fetchBooks(search, filter);
});

// search books by clicking
const handleSearch = () => {
  const search = document.getElementById("searchText").value;
  const filter = document.getElementById("bookFilter").value;

  fetchBooks(search, filter);
};

// filter books
const filterBooks = (e) => {
  const search = document.getElementById("searchText").value;
  const filter = e.target.value;
  fetchBooks(search, filter);
};

// handle add to cart
const handleAddCart = (e, id) => {
  e.stopPropagation();

  const carts = JSON.parse(localStorage.getItem("carts")) || [];
  if (!carts.includes(id)) {
    carts.push(id);
    localStorage.setItem("carts", JSON.stringify(carts));

    const button = e.target.closest("button");
    button.outerHTML = `
      <button class="cart-btn" onclick="removeCart(event, ${id})">
        <i class="fa fa-heart"></i> <!-- Liked State -->
      </button>
    `;

    alert(`${id} is added to cart`);
  } else {
    alert("This book is already in cart!");
  }
};

// remove book from cart
const removeCart = (e, id) => {
  e.stopPropagation();
  const carts = JSON.parse(localStorage.getItem("carts"));
  const newCarts = carts?.filter((cartId) => cartId !== id);
  localStorage.setItem("carts", JSON.stringify(newCarts));

  // Change button dynamically
  const button = e.target.closest("button");
  button.outerHTML = `
      <button class="cart-btn" onclick="handleAddCart(event, ${id})">
        <i class="far fa-heart"></i> <!-- Liked State -->
      </button>
    `;

  alert(`${id} is removed from cart`);
};
