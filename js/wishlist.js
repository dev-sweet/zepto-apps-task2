const cartContainer = document.getElementById("cartContainer");
const totalWishlist = document.getElementById("totalWishlist");
const fetchCarts = async () => {
  cartContainer.innerHTML = `<h4 class="cart-loading">..Loading</h4>`;
  const cartIds = JSON.parse(localStorage.getItem("carts")).join(",");

  if (!cartIds) {
    cartContainer.innerHTML = `<div><h1>Your wishlist is empty</h1> <p>Please <a href="/">Add books</a> to your cart</p></div>`;
  } else if (cartIds) {
    const res = await fetch(`https://gutendex.com/books?ids=${cartIds}`);
    const data = await res.json();

    // set wishlists total
    totalWishlist.innerText = `Your Wishlist (${data.count || 0})`;

    showCarts(data.results);
  }
};

const showCarts = (books) => {
  cartContainer.innerHTML = `<div class="cart">
      <h4>#ID</h4>
      <h4 class="cart-img">Image</h4>
      <h4>Title</h4>
      <h4>Authors</h4>

      <h4 >
        Action
      </h4>
    </div>`;
  //   show book lists

  books.forEach((book) => {
    const cartElement = document.createElement("div");
    cartElement.classList.add("cart");

    const image = book.formats["image/jpeg"];
    const author = book?.authors[0].name;

    cartElement.innerHTML = `
     <p class="cart-id">#${book.id}</p>
      <img class="cart-img" src="${image}"/>
     
      <h4 class="cart-title">${book.title}</h4>
      <p class="cart-author"> ${author}</p>
     
      <button class="remove-cart" onclick="handleRemoveCart(${book.id})">  <i class="fa fa-trash"></i></button>
      `;

    cartContainer.appendChild(cartElement);
  });
};
fetchCarts();

const handleRemoveCart = (id) => {
  const carts = [...JSON.parse(localStorage.getItem("carts"))];
  console.log(carts);
  const newCart = carts.filter((cartItem) => cartItem !== id);
  localStorage.setItem("carts", JSON.stringify(newCart));

  fetchCarts();
};
