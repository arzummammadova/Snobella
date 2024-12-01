import productURL from "./baseURL.js";
import { getDatas } from "./request.js";

async function loadFavorites() {
    const allProducts = await getDatas(productURL);
    let uniqueFavorites = [...new Set(favoriteProducts)];

    uniqueFavorites.forEach(id => {
        const product = allProducts.find(p => p.id === id);
        if (product) {
            createProductCard(product, cardContainer);
        }
    });
}

function createProductCard(product, cardContainer) {
    const card = document.createElement('div');
    card.classList.add('featuredproducts_cards_card');

    const cardTop = document.createElement('div');
    cardTop.classList.add('featuredproducts_cards_card_top');

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.title;
    figure.appendChild(img);
    cardTop.appendChild(figure);

    for (let i = 0; i < 5; i++) {
        const star = document.createElement('img');
        star.classList.add('star');
        star.src = './assets/icons/star.svg';
        star.alt = 'Star';
        cardTop.appendChild(star);
    }
    card.appendChild(cardTop);

    const productTitle = document.createElement('p');
    productTitle.textContent = product.title.length > 60 ? product.title.substring(0, 60) + '...' : product.title;
    card.appendChild(productTitle);

    const price = document.createElement('span');
    price.classList.add('price');
    price.textContent = `$${product.price.toFixed(2)}`;
    card.appendChild(price);

    const prevPrice = document.createElement('span');
    prevPrice.classList.add('prevprice');
    prevPrice.textContent = `From $${(product.price * 1.5).toFixed(2)}`;
    card.appendChild(prevPrice);

    const btnCard = document.createElement('div');
    btnCard.classList.add('btn-card');
    btnCard.textContent = 'Add to cart';
    card.appendChild(btnCard);

    btnCard.addEventListener('click', () => {
        addToCart(product);
    });

    const heartDiv = document.createElement('div');
    heartDiv.classList.add('heart', 'close');
    heartDiv.textContent = 'X';
    card.appendChild(heartDiv);

    heartDiv.addEventListener('click', () => {
        removeFromFavorites(product.id, heartDiv);
    });

    cardContainer.appendChild(card);
}

function removeFromFavorites(productId, heartDiv) {
    const updatedFavorites = favoriteProducts.filter(id => id !== productId);
    localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));

    heartDiv.closest('.featuredproducts_cards_card').remove();

    favoriteProducts = updatedFavorites;
}

function clearAllFavorites() {
    localStorage.removeItem('favoriteProducts');
    cardContainer.innerHTML = '';
    favoriteProducts = [];
}

let clearAllButton = document.querySelector('.clear-all-button');
clearAllButton.addEventListener('click', clearAllFavorites);

// async function addToCart(product) {
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];

//     if (!cart.some(item => item.id === product.id)) {
//         cart.push(product);
//     }

//     localStorage.setItem('cart', JSON.stringify(cart));

//     updateBasketCount();
// }
async function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        // If the product is already in the cart, increase its quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // If the product is not in the cart, add it with a quantity of 1
        product.quantity = 1;
        cart.push(product);
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the basket count
    updateBasketCount();
}


async function updateBasketCount() {
    const basketCount = document.querySelector('.basket-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Total items count, considering product quantity
    let totalItems = 0;

    // Get all products data
    const allProducts = await getDatas(productURL);

    // Loop through the cart and accumulate the quantity of each product
    cart.forEach(cartItem => {
        const product = allProducts.find(p => p.id === cartItem.id);
        if (product) {
            totalItems += cartItem.quantity; // Add quantity of the product in the cart
        }
    });

    // Update the basket count
    basketCount.textContent = totalItems;
}


document.addEventListener('DOMContentLoaded', updateBasketCount);

const cardContainer = document.querySelector('.featuredproducts_container');
let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
loadFavorites();



function toggleMenu() {
    const logo = document.getElementById('logo');
    const navItems = document.querySelectorAll('.nav_top .search-container, .nav_top .group, .nav_top .nav-link-pages, .basket-count');
    const burgerMenu = document.querySelector('.burger-menu');
    burgerMenu.addEventListener("click", () => {
      navItems.forEach(item => item.classList.toggle('none'));
      logo.classList.toggle('none');
    });
  
    if (window.innerWidth <= 992) {
      navItems.forEach(item => item.classList.add('none'));
      burgerMenu.classList.remove('none');
    } else {
      navItems.forEach(item => item.classList.remove('none'));
      burgerMenu.classList.add('none');
    }
  }
  
  window.addEventListener('resize', toggleMenu);
  toggleMenu();
  