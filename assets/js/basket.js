import productURL from "./baseURL.js";
import { getDatas } from "./request.js";

let products = [];
let cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;
let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

async function loadBasket() {
  try {
    const response = await getDatas(productURL);

    if (Array.isArray(response)) {
      products = response.slice(0, cartCount);

      document.querySelector(".basket-count").textContent = cartCount; 

      displayProducts(products);

      if (products.length === 0) {
        var toast = new Toasty();
        toast.warning("Basket is empty :DDDDD");
      }
    } else {
      console.error("Məlumatlar düzgün formatda alınmadı");
    }
  } catch (error) {
    console.error("Məlumatlar alınarkən xəta baş verdi: ", error);
  }
}

function displayProducts(products) {
  const basketSection = document.getElementById("basket");

  if (!basketSection) {
    console.error("basket elementi tapılmadı!");
    return;
  }

  const basketBuyContainer = basketSection.querySelector(".basket-buy");

  basketBuyContainer.innerHTML = "";

  if (products.length === 0) {
    console.log("basket is empty!");
  } else {
    products.forEach(product => {
      const basketBuyLeft = document.createElement("div");
      basketBuyLeft.classList.add("basket-buy-left");

      const imageDiv = document.createElement("div");
      imageDiv.classList.add("image");
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.title;
      imageDiv.appendChild(img);

      const descDiv = document.createElement("div");
      descDiv.classList.add("desc");

      const descHeader = document.createElement("div");
      descHeader.classList.add("desc-header");
      const h4 = document.createElement("h4");
      h4.textContent = product.title;
      const pPrice = document.createElement("p");
      pPrice.textContent = `USD $${product.price}`;
      descHeader.appendChild(h4);
      descHeader.appendChild(pPrice);

      const quantityDiv = document.createElement("div");
      quantityDiv.classList.add("quantity");

      const quantityLabel = document.createElement("p");
      quantityLabel.textContent = `Quantity: ${product.quantity || 1}`;
      const decrementButton = document.createElement("button");
      decrementButton.classList.add("decrement");
      decrementButton.textContent = "-";
      decrementButton.onclick = () => updateQuantity(product.id, -1);

      const incrementButton = document.createElement("button");
      incrementButton.classList.add("increment");
      incrementButton.textContent = "+";
      incrementButton.onclick = () => updateQuantity(product.id, 1);

    
      quantityDiv.appendChild(quantityLabel);
      quantityDiv.appendChild(incrementButton);
      quantityDiv.appendChild(decrementButton);

      const movementDiv = document.createElement("div");
      movementDiv.classList.add("movement");

      const addFavorite = document.createElement("div");
      addFavorite.classList.add("addfavorte");
      addFavorite.innerHTML = `<i class="bi bi-heart"></i> Favorite`;
      addFavorite.onclick = () => addToFavorites(product);

      const removeDiv = document.createElement("div");
      removeDiv.classList.add("remove");
      removeDiv.innerHTML = `<i class="bi bi-trash"></i> Remove`;
      removeDiv.onclick = () => removeFromBasket(product.id);

      movementDiv.appendChild(addFavorite);
      movementDiv.appendChild(removeDiv);

      descDiv.appendChild(descHeader);
      descDiv.appendChild(quantityDiv);
      descDiv.appendChild(movementDiv);

      basketBuyLeft.appendChild(imageDiv);
      basketBuyLeft.appendChild(descDiv);

      basketBuyContainer.appendChild(basketBuyLeft);
    });
  }

  updateTotalPrice();
}

function updateTotalPrice() {
  const totalPriceElement = document.getElementById("total-price");
  let totalPrice = 0;

  products.forEach(product => {
    if (product.quantity > 0) {
      totalPrice += (product.price * product.quantity);
    }
  });

  totalPriceElement.textContent = totalPrice > 0 ? `${totalPrice} AZN` : "0 AZN";
}

function updateCartCount() {
  cartCount = products.reduce((total, p) => total + (p.quantity || 0), 0);
  localStorage.setItem('cartCount', JSON.stringify(cartCount));
  document.querySelector(".basket-count").textContent = cartCount;
}

function removeFromBasket(productId) {
  products = products.filter(product => product.id !== productId);
  updateCartCount();
  displayProducts(products);
}

function addToFavorites(product) {
  if (!favoriteProducts.some(p => p.id === product.id)) {
    favoriteProducts.push(product);
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
    var toast = new Toasty();
    toast.error("Product already have a favorite");
  } else {
    var toast = new Toasty();
    toast.error("Product added to favorites");
  }
}

function updateQuantity(productId, change) {
  const product = products.find(p => p.id === productId);
  if (product) {
    product.quantity = (product.quantity || 1) + change;

    if (product.quantity <= 0) {
      removeFromBasket(productId);
    } else {
      updateCartCount();
      displayProducts(products);
    }
  }
}

document.querySelector(".deleteall").addEventListener("click", () => {
  products = [];
  cartCount = 0;
  localStorage.setItem('cartCount', JSON.stringify(cartCount));
  document.querySelector(".basket-count").textContent = cartCount; 
  displayProducts(products);
  var toast = new Toasty();
  toast.warning("All items have been deleted from the basket.");
});

document.querySelector(".make").addEventListener("click", () => {
  if (products.length === 0) {
    var toast = new Toasty();
    toast.warning("Basket is empty! Please add items to the basket.");
  } else {
    console.log("Products in the basket:", products);
  }
});

loadBasket();
