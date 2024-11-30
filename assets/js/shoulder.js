import productURL from "./baseURL.js";
import { getDatas } from "./request.js";

let products = [];
let searchInput = document.querySelector('.search');
let searchButton = document.querySelector('.searchicon');
let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
let cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;

function applySortOrder(sortOrder, products) {
  switch (sortOrder) {
    case 'az':
      return products.sort((a, b) => a.title.localeCompare(b.title));
    case 'za':
      return products.sort((a, b) => b.title.localeCompare(a.title));
    case 'hightolow':
      return products.sort((a, b) => b.price - a.price);
    case 'lowtohigh':
      return products.sort((a, b) => a.price - b.price);
    default:
      return products;
  }
}

function createProductCard(product, container) {
  const card = document.createElement("div");
  card.className = "featuredproducts_cards_card shoulderproducts";

  const topDiv = document.createElement("div");
  topDiv.className = "featuredproducts_cards_card_top";

  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.title;
  figure.appendChild(img);
  topDiv.appendChild(figure);

  for (let i = 0; i < 5; i++) {
    const star = document.createElement("img");
    star.className = "star";
    star.src = "./assets/icons/star.svg";
    star.alt = "Star";
    topDiv.appendChild(star);
  }

  card.appendChild(topDiv);

  const title = document.createElement("p");
  title.textContent = product.title.slice(0, 23) + "....";
  card.appendChild(title);

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = `$${product.price}`;
  card.appendChild(price);

  if (product.prevPrice) {
    const prevPrice = document.createElement("span");
    prevPrice.className = "prevprice";
    prevPrice.textContent = `From $${product.prevPrice}`;
    card.appendChild(prevPrice);
  }

  const btnCard = document.createElement("div");
  btnCard.className = "btn-card";
  btnCard.textContent = "Add to cart";
  btnCard.addEventListener("click", () => addToCart(product));
  card.appendChild(btnCard);

  const newButton = document.createElement("button");
  newButton.className = "btn-lt btn-green";
  newButton.textContent = "NEW";
  card.appendChild(newButton);

  const heartDiv = document.createElement("div");
  heartDiv.className = "heart";
  const heartImg = document.createElement("img");
  heartImg.src = "./assets/icons/hearticon.svg";
  heartImg.alt = "Heart";
  heartDiv.appendChild(heartImg);

  heartImg.addEventListener("click", () => toggleFavorite(product, heartImg));

  card.appendChild(heartDiv);

  container.appendChild(card);
}

function toggleFavorite(product, heartImg) {
  const index = favoriteProducts.findIndex(favProduct => favProduct.id === product.id);
  if (index === -1) {
    favoriteProducts.push(product);
    heartImg.src = "./assets/icons/hearticonfill.svg";  
    var toast = new Toasty();
    toast.info("Added to favorites!");
  } else {
    favoriteProducts.splice(index, 1);
    heartImg.src = "./assets/icons/hearticon.svg";  
    var toast = new Toasty();
    toast.error("Removed from favorites!");
  }

  localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
}

function updateCartCount() {
  const basketCountElement = document.querySelector('.basket-count');
  basketCountElement.textContent = cartCount;
}

function addToCart(product) {
  cartCount += 1;
  localStorage.setItem('cartCount', JSON.stringify(cartCount));
  var toast = new Toasty();
  toast.info("Product added to basket!");
  updateCartCount();
}

searchInput.addEventListener('input', () => {
  const searchValue = searchInput.value.toLowerCase();
  const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchValue));
  updateProductDisplay(filteredProducts);
});

searchButton.addEventListener('click', () => {
  const searchValue = searchInput.value.toLowerCase();
  const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchValue));
  updateProductDisplay(filteredProducts);
});

function updateProductDisplay(sortedProducts) {
  const container = document.querySelector(".featuredproducts_cards");
  container.innerHTML = "";
  sortedProducts.forEach(product => {
    createProductCard(product, container);
  });
}

function handleSortChange(event) {
  const sortOrder = event.target.value;
  localStorage.setItem('sortOrder', sortOrder);
  const sortedProducts = applySortOrder(sortOrder, products);
  updateProductDisplay(sortedProducts);
}

async function createCards() {
  try {
    products = await getDatas(`${productURL}`);
    const limitedProducts = products.slice(0, 12);

    const savedSortOrder = localStorage.getItem('sortOrder') || 'normal';
    const sortedProducts = applySortOrder(savedSortOrder, limitedProducts);

    updateProductDisplay(sortedProducts);

    const sortSelect = document.querySelector("#sort-select");
    sortSelect.addEventListener("change", handleSortChange);

    sortSelect.value = savedSortOrder;

  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();

  products = await getDatas(productURL);
  const savedSortOrder = localStorage.getItem('sortOrder') || 'normal';
  let sortedProducts = [...products];
  if (savedSortOrder !== 'normal') {
    sortedProducts = applySortOrder(savedSortOrder, sortedProducts);
  }

  const limitedProducts = sortedProducts.slice(0, 12);
  updateProductDisplay(limitedProducts);

  const sections = ['#featuredproducts', '#sellingproducts', '#newproducts'];

  sections.forEach(async sectionId => {
    let section = document.querySelector(sectionId);
    if (!section) return;

    let productSubset = limitedProducts;
    if (sectionId === '#sellingproducts') {
      productSubset = limitedProducts.slice(0, 5);
    }

    const cardContainer = section.querySelector('.featuredproducts_cards');
    if (!cardContainer) return;

    cardContainer.innerHTML = '';
    productSubset.forEach(product => {
      createProductCard(product, cardContainer);
    });
  });
});

function toggleMenu() {
  const logo = document.getElementById('logo');
  const navItems = document.querySelectorAll('.nav_top .search-container, .nav_top .group, .nav_top .nav-link-pages,.basket-count');
  const burgerMenu = document.querySelector('.burger-menu');
  burgerMenu.addEventListener("click", () => {
    navItems.forEach(item => {
      item.classList.toggle('none');
      item.style.display = 'flex';
    });
    logo.classList.toggle('none');
  });
  if (window.innerWidth <= 992) {
    navItems.forEach(item => {
      item.classList.add('none');
    });
    burgerMenu.classList.remove('none');
  } else {
    navItems.forEach(item => {
      item.classList.remove('none');
    });
    burgerMenu.classList.add('none');
  }
}

window.addEventListener('resize', toggleMenu);
toggleMenu();

document.addEventListener("DOMContentLoaded", createCards);
