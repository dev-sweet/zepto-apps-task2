const booksContainer = document.getElementById("books");

const fetchBooks = async (searchQuery = "", filter = "") => {
  try {
    // at first show the loading element
    booksContainer.innerHTML = `<h4 class="books-loading">..Loading</h4>`;

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

  const carts = JSON.parse(localStorage.getItem("carts"));
  books.forEach((book) => {
    const bookCard = document.createElement("div");

    // handle click event on clicking card
    bookCard.addEventListener("click", (e) => {
      window.location.href = `/bookDetails.html?id=${book.id}`;
    });

    bookCard.classList.add("book-card");

    const image = book.formats["image/jpeg"];
    const author = book?.authors[0].name;
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
fetchBooks();

const handleSearch = () => {
  const searchText = document.getElementById("searchText").value;
  fetchBooks(searchText);
};

const filterBooks = (e) => {
  fetchBooks("", e.target.value);
};

// handle add to cart
const handleAddCart = (e, id) => {
  e.stopPropagation();

  const carts = JSON.parse(localStorage.getItem("carts")) || [];
  if (!carts.includes(id)) {
    carts.push(id);
    localStorage.setItem("carts", JSON.stringify(carts));
    // fetchBooks();
    alert(`${id} is added to cart`);
  } else {
    alert("This book is already in cart!");
  }
};

// remove book from cart
const removeCart = (e, id) => {
  e.stopPropagation();

  const carts = JSON.parse(localStorage.getItem("carts"));
  const newCarts = carts.filter((cartId) => cartId !== id);
  console.log(newCarts);
};
