import productURL from "./baseURL.js";
import { getDatas } from "./request.js";


async function loadFavorites() {
    const cardContainer = document.querySelector('.featuredproducts_container');
    if (!cardContainer) {
        console.error("Card container not found!");
        return;
    }

    const loggedInUser = getLoggedInUser();
    if (!loggedInUser || !loggedInUser.wishlist || loggedInUser.wishlist.length === 0) {
        console.log("No favorites found.");
        return;
    }

    const allProducts = await getDatas(productURL);
    let uniqueFavorites = [...new Set(loggedInUser.wishlist)];

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
    btnCard.addEventListener('click', () => addToCart(product));
    card.appendChild(btnCard);

    const heartDiv = document.createElement('div');
    heartDiv.classList.add('heart', 'close');
    heartDiv.textContent = 'X';
    heartDiv.addEventListener('click', () => removeFromFavorites(product.id, card));
    card.appendChild(heartDiv);

    cardContainer.appendChild(card);
}


function removeFromFavorites(productId, cardElement) {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser || !loggedInUser.wishlist) return;

    loggedInUser.wishlist = loggedInUser.wishlist.filter(id => id !== productId);
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    cardElement.remove();
}

function clearAllFavorites() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser || !loggedInUser.wishlist) return;

    loggedInUser.wishlist = [];
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    document.querySelector('.featuredproducts_container').innerHTML = '';
}

function addToCart(product) {
    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        alert("Please login!");
        return;
    }

    if (!loggedInUser.cart) loggedInUser.cart = [];

    const existingProductIndex = loggedInUser.cart.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
        loggedInUser.cart[existingProductIndex].quantity += 1;
    } else {
        product.quantity = 1;
        loggedInUser.cart.push(product);
    }

    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    updateBasketCount();
}

function updateBasketCount() {
    const basketCount = document.querySelector('.basket-count');
    const loggedInUser = getLoggedInUser();
    const totalItems = loggedInUser?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    basketCount.textContent = totalItems;
}

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    updateBasketCount();
});


document.querySelector('.clear-all-button').addEventListener('click', clearAllFavorites);

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
    })
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
