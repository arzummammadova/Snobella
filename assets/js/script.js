import productURL from "./baseURL.js";
import { deleteById, getDatas, postData } from "./request.js";

const slides = document.querySelectorAll('.hero');
const circles = document.querySelectorAll('.circle');
const container = document.querySelector('#hero');
let az = document.querySelector("#az");
let za = document.querySelector("#za");
let hightolow = document.querySelector("#hightolow");
let lowtohigh = document.querySelector("#lowtohigh");
let normal = document.querySelector("#normal");
let dropdown = document.querySelector(".dropdown");
let searchInput = document.querySelector('.search');
let searchButton = document.querySelector('.searchicon');

let currentIndex = 0;
let products = [];
let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

function changeSlide() {
    slides[currentIndex].classList.remove('active');
    circles[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
    circles[currentIndex].classList.add('active');
    const newBgColor = slides[currentIndex].getAttribute('data-bg');
    container.style.backgroundColor = newBgColor;
}

setInterval(changeSlide, 1000);

document.addEventListener("DOMContentLoaded", async () => {
    products = await getDatas(productURL);
    const savedSortOrder = localStorage.getItem('sortOrder') || 'normal';
    let sortedProducts = [...products];
    if (savedSortOrder !== 'normal') {
        sortedProducts = applySortOrder(savedSortOrder, sortedProducts);
    }
    updateProductDisplay(sortedProducts);
    const sections = ['#featuredproducts', '#sellingproducts', '#newproducts'];

    sections.forEach(async sectionId => {
        let section = document.querySelector(sectionId);
        if (!section) return;

        let productSubset = sortedProducts;
        if (sectionId === '#sellingproducts') {
            productSubset = sortedProducts.slice(0, 5);
        }

        const cardContainer = section.querySelector('.featuredproducts_cards');
        if (!cardContainer) return;

        cardContainer.innerHTML = '';
        productSubset.forEach(product => {
            createProductCard(product, cardContainer);
        });
        createArrows(cardContainer, sectionId);
        initSlider(cardContainer, productSubset);
    });
});
let cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;
function updateCartCount() {
    const basketCountElement = document.querySelector('.basket-count');
    basketCountElement.textContent = cartCount;
}


function addToCart(product) {
    cartCount += 1;
    localStorage.setItem('cartCount', JSON.stringify(cartCount));

    var toast = new Toasty();
    toast.info("Product added to basket !");
    updateCartCount();
}



updateCartCount();

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
    productTitle.textContent = product.title.substring(0, 60) + '...';
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
    heartDiv.classList.add('heart');
    const heartIcon = document.createElement('img');
    heartIcon.src = favoriteProducts.includes(product.id) ? './assets/icons/hearticonfill.svg' : './assets/icons/hearticon.svg';
    heartIcon.alt = 'Heart Icon';
    heartDiv.appendChild(heartIcon);
    card.appendChild(heartDiv);


    heartDiv.addEventListener('click', () => {
        toggleFavorite(product.id, heartIcon);
    });

    cardContainer.appendChild(card);
}


function toggleFavorite(productId, heartIcon) {
    if (favoriteProducts.includes(productId)) {
        favoriteProducts = favoriteProducts.filter(id => id !== productId);
        heartIcon.src = './assets/icons/hearticon.svg';
        var toast = new Toasty();
        toast.error("Product added to favorites");
    } else {
        favoriteProducts.push(productId);
        heartIcon.src = './assets/icons/hearticonfill.svg';
        var toast = new Toasty();
        toast.success("Product added to favorites");
    }
   
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
}

function createArrows(cardContainer, sectionId) {
    const leftArrow = document.createElement('div');
    leftArrow.classList.add('left-arrow');
    leftArrow.innerHTML = `<img src="./assets/icons/leftarrow.svg" alt="">`;
    const rightArrow = document.createElement('div');
    rightArrow.classList.add('right-arrow');
    rightArrow.innerHTML = `<img src="./assets/icons/rightarrow.svg" alt="">`;
    cardContainer.insertAdjacentElement('afterbegin', leftArrow);
    cardContainer.insertAdjacentElement('beforeend', rightArrow);
}

function initSlider(cardContainer, productSubset) {
    const cards = cardContainer.querySelectorAll('.featuredproducts_cards_card');
    const totalCards = cards.length;
    let currentIndex = 0;

    function updateSlider() {
        cards.forEach((card, index) => {
            card.style.display = (index >= currentIndex && index < currentIndex + 3) ? 'block' : 'none';
        });
    }

    cardContainer.querySelector('.left-arrow').addEventListener('click', () => {
        currentIndex = (currentIndex - 3 + totalCards) % totalCards;
        updateSlider();
    });

    cardContainer.querySelector('.right-arrow').addEventListener('click', () => {
        currentIndex = (currentIndex + 3) % totalCards;
        updateSlider();
    });

    updateSlider();

}

// function toast(text) {
//     Toastify({

//         text: text,
//         duration: 4500,
//         gravity: "top",
//         position: "left center",
//         style: {
//             position:"sticky",

//             color: "white",

//             paddingLeft: "100px",
//             background: "linear-gradient(to right, #F0B5AE, #CC397B)",
//         },
//     }).showToast();
// }

function sortAZ(products) {
    var toast = new Toasty();

    toast.success("Featured products Sorted from A to Z");

    return products.sort((a, b) => a.title.localeCompare(b.title));
}

function sortZA(products) {
    var toast = new Toasty();
    toast.success("Featured products Sorted from Z to A");

    return products.sort((a, b) => b.title.localeCompare(a.title));
}

function sortHighToLow(products) {
    var toast = new Toasty();
    toast.success("Featured products Sorted from High to Low");
    return products.sort((a, b) => b.price - a.price);
}

function sortLowToHigh(products) {
    var toast = new Toasty();
    toast.success("Featured products Sorted from Low to High");
   
    return products.sort((a, b) => a.price - b.price);
}

function applySortOrder(order, products) {
    let sortedProducts;
    switch (order) {
        case 'az':
            sortedProducts = sortAZ(products);
            break;
        case 'za':
            sortedProducts = sortZA(products);
            break;
        case 'hightolow':
            sortedProducts = sortHighToLow(products);
            break;
        case 'lowtohigh':
            sortedProducts = sortLowToHigh(products);
            break;
        default:
            sortedProducts = products;
    }
    return sortedProducts;
}

az.addEventListener("click", () => {
    const sortedProducts = applySortOrder('az', [...products]);
    localStorage.setItem('sortOrder', 'az');
    updateProductDisplay(sortedProducts);
});

za.addEventListener("click", () => {
    const sortedProducts = applySortOrder('za', [...products]);
    localStorage.setItem('sortOrder', 'za');
    updateProductDisplay(sortedProducts);
});

hightolow.addEventListener("click", () => {
    const sortedProducts = applySortOrder('hightolow', [...products]);
    localStorage.setItem('sortOrder', 'hightolow');
    updateProductDisplay(sortedProducts);
});

lowtohigh.addEventListener("click", () => {
    const sortedProducts = applySortOrder('lowtohigh', [...products]);
    localStorage.setItem('sortOrder', 'lowtohigh');
    updateProductDisplay(sortedProducts);
});

normal.addEventListener("click", () => {
    localStorage.removeItem('sortOrder');
    updateProductDisplay([...products]);


});

function updateProductDisplay(sortedProducts) {
    const sections = ['#featuredproducts', '#sellingproducts', '#newproducts'];
    sections.forEach(sectionId => {
        let section = document.querySelector(sectionId);
        if (!section) return;

        const cardContainer = section.querySelector('.featuredproducts_cards');
        if (!cardContainer) return;

        cardContainer.innerHTML = '';
        sortedProducts.forEach(product => {
            createProductCard(product, cardContainer);
        });

        createArrows(cardContainer, sectionId);
        initSlider(cardContainer, sortedProducts);
    });
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



$(document).ready(function () {
    $(".button").click(function () {
        $(".arrow").toggleClass("open");
        $(".dropdown").toggleClass("open");
    });

    $(".dropdown a").click(function () {
        $(".dropdown a").removeClass("clicked");
        $(".dropdown a").children("span").removeClass("clicked");
        $(this).addClass("clicked");
        $(this).children("span").addClass("clicked");
    });
});







window.onscroll = function () { stickyHeader() };

var header = document.querySelector(".header-bottom");
var sticky = header.offsetTop;
const navList = document.querySelector(".nav_list");
const dropdownList = document.querySelector(".control-panel");

function stickyHeader() {
    if (window.pageYOffset > sticky) {
        navList.classList.add("none");
        dropdownList.classList.add("none")
        header.classList.add("fixed-header");
    } else {
        dropdownList.classList.remove("none")
        navList.classList.remove("none");
        header.classList.remove("fixed-header");
    }
}


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
