const bookDetailsDiv = document.getElementById("bookDetails");

const fetchBookById = async () => {
  const urlParams = window.location.search;
  const bookId = urlParams.split("=")[1];

  const res = await fetch(`https://gutendex.com/books/${bookId}`);
  const book = await res.json();

  showDetails(book);
};

const showDetails = (book) => {
  const cartIds = JSON.parse(localStorage.getItem("carts"));

  const author = book?.authors.map((author) => author.name);
  const genres = book?.subjects.join(",");
  console.log(book);
  const image = book.formats["image/jpeg"];
  bookDetailsDiv.innerHTML = `
    <div class="img-container">
        <img class="img" src="${image}" />
    </div>
    <div class="divider"></div>
    <div class="details">
        <h2 class="title">${book.title}</h2>
        <p><span>Book ID:</span> ${book.id}</p>
        ${
          !cartIds?.includes(book.id)
            ? ` <button  onclick="handleAddCart(event,${book.id})" class="cart-btn">
          <i class="far fa-heart"></i>
        </button>`
            : ` <button onclick="removeCart(event,${book.id})" class="cart-btn">
          <i class="fa fa-heart"></i>
        </button>`
        }
        <p class="authors"><span>By:</span> ${author}</p>
        <p><span>Genres:</span> ${genres}</p>
        <p><span>Summaries:</span> ${book.summaries}</p>
        <p><span>Genres:</span> ${genres}</p>
        <p><span>Summaries:</span> ${book.summaries}</p>
    </div>
  `;
};
fetchBookById();

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
