import productURL from "./baseURL.js";
import { getDatas } from "./request.js";

let products = [];
let productId = new URLSearchParams(location.search).get("id");

getDatas(productURL)
  .then((data) => {
    console.log("Fetched products:", data);
    products = data;

    let findProduct = products.find(
      (product) => product.id === productId
    );

    if (findProduct) {
      let productContainer = document.querySelector(".product-container");
      let detailsSection = document.createElement("section");
      detailsSection.id = "details";

      let containerDiv = document.createElement("div");
      containerDiv.classList.add("container");

      let productInfoDiv = document.createElement("div");
      productInfoDiv.classList.add("product-info");

      let leftSideDiv = document.createElement("div");
      leftSideDiv.classList.add("left-side");

      let changeImageSliderDiv = document.createElement("div");
      changeImageSliderDiv.classList.add("change-image-slider");

      let upArrowDiv = document.createElement("div");
      upArrowDiv.classList.add("up-arrow");
      upArrowDiv.innerHTML = `
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 8L8 2L14 8" stroke="#212121" stroke-opacity="0.25" stroke-width="2" stroke-linecap="square"/>
        </svg>
      `;
      changeImageSliderDiv.appendChild(upArrowDiv);

      let changeImageDiv = document.createElement("div");
      changeImageDiv.classList.add("change-image");

      let images = [findProduct.image, findProduct.image, findProduct.image, findProduct.image];
      images.forEach((imgSrc, index) => {
        let img = document.createElement("img");
        img.src = imgSrc;
        img.alt = `Image ${index + 1}`;
        img.classList.add("changeimg");
        if (index === 0) img.classList.add("active-border");

        img.addEventListener("click", () => {
          let allImages = document.querySelectorAll(".changeimg");
          allImages.forEach((img) => img.classList.remove("active-border"));
          img.classList.add("active-border");
          mainImage.src = img.src;
          mainImage.style.transition = "all 0.5s ease";
          mainImage.style.opacity = "0";
          setTimeout(() => {
            mainImage.style.opacity = "1";
          }, 500);
        
        });

        

        changeImageDiv.appendChild(img);
      });

      changeImageSliderDiv.appendChild(changeImageDiv);

      let arrowDownDiv = document.createElement("div");
      arrowDownDiv.classList.add("arrow-down");
      arrowDownDiv.innerHTML = `
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2L8 8L14 2" stroke="black" stroke-width="2" stroke-linecap="square"/>
        </svg>
      `;
      changeImageSliderDiv.appendChild(arrowDownDiv);
      leftSideDiv.appendChild(changeImageSliderDiv);

      let mainImgDiv = document.createElement("div");
      mainImgDiv.classList.add("main-img");

      let heartIcon = document.createElement("img");
      heartIcon.classList.add("heart");
      heartIcon.src = "./assets/icons/hearticon.svg";
      heartIcon.alt = "Heart Icon";

      let discountText = document.createElement("p");
      discountText.classList.add("p__left__desc");
      discountText.innerText = "30% ";

      let mainImage = document.createElement("img");
      mainImage.classList.add("main");
      mainImage.src = findProduct.image;
      mainImage.alt = "Main Image";

      mainImgDiv.appendChild(heartIcon);
      mainImgDiv.appendChild(discountText);
      mainImgDiv.appendChild(mainImage);
      leftSideDiv.appendChild(mainImgDiv);

      let rightSideDiv = document.createElement("div");
      rightSideDiv.classList.add("right-side");

      let productTitle = document.createElement("div");
      productTitle.classList.add("product-title");
      productTitle.innerText = findProduct.title;


      

      let productPrice = document.createElement("div");
      productPrice.classList.add("product-price");
      productPrice.innerText = `$${findProduct.price}`;

      let addToCartButton = document.createElement("button");
      addToCartButton.classList.add("add-to-cart-btn");
      addToCartButton.innerText = "Add to Cart";
      const start=document.createElement("div");
      start.className="start";
    start.innerHTML = "elave edecem..";
      rightSideDiv.appendChild(start);
      rightSideDiv.appendChild(productTitle);
      rightSideDiv.appendChild(productPrice);
      rightSideDiv.appendChild(start);
      rightSideDiv.appendChild(addToCartButton);


      productInfoDiv.appendChild(leftSideDiv);
      productInfoDiv.appendChild(rightSideDiv);

      containerDiv.appendChild(productInfoDiv);

      detailsSection.appendChild(containerDiv);

      productContainer.appendChild(detailsSection);

      let currentImageIndex = 0;

      function updateMainImage() {
        let allImages = document.querySelectorAll(".changeimg");
        allImages.forEach((img, index) => {
          if (index === currentImageIndex) {
            img.classList.add("active-border");
            mainImage.src = img.src;
            mainImage.style.transition = "all 0.5s ease";
            mainImage.style.opacity = "0";
            setTimeout(() => {
              mainImage.style.opacity = "1";
            }, 500);
          } else {
            img.classList.remove("active-border");
          }
        });
        mainImage.src = images[currentImageIndex];
      }

      upArrowDiv.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateMainImage();
      });

      arrowDownDiv.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateMainImage();
      });
    } else {
      console.log("Product not found");
      document.querySelector(".container").innerHTML = "<p>Product not found</p>";
    }
  })
  .catch((error) => {
    console.error("Error fetching product data:", error);
    document.querySelector(".container").innerHTML = "<p>Error loading product data</p>";
  });

  function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "featuredproducts_cards_card";
    card.dataset.productId = product.id;
  
  
    const cardTop = document.createElement("div");
    cardTop.className = "featuredproducts_cards_card_top";
  
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    figure.appendChild(img);
  
    cardTop.appendChild(figure);
  
    

    for (let i = 0; i < 5; i++) {
      const star = document.createElement("img");
      star.className = "star";
      star.src = "./assets/icons/star.svg";
      star.alt = "Star";
      cardTop.appendChild(star);
    }
  
    card.appendChild(cardTop);
  
  
    const title = document.createElement("p");
    title.textContent = product.title.slice(0, 30) + "..."; 
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
    btnCard.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product);
    });
    card.appendChild(btnCard);
  
   
    const newButton = document.createElement("button");
    newButton.className = product.isNew ? "btn-lt btn-green" : "btn-lt btn-red";
    newButton.textContent = "NEW";
    card.appendChild(newButton);
  
   
    const heartDiv = document.createElement("div");
    heartDiv.className = "heart";
  
    const heartImg = document.createElement("img");
    heartImg.src = favoriteProducts.includes(product.id)
      ? "./assets/icons/hearticonfill.svg"
      : "./assets/icons/hearticon.svg";
  
    heartImg.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(product.id, heartImg);
    });
  
    heartDiv.appendChild(heartImg);
    card.appendChild(heartDiv);
  
    
    card.addEventListener("click", () => {
      window.location.href = `details.html?id=${product.id}`;
    });
  
    return card;
  }
  async function displayProductsByCategory(categoryId) {
    try {
      const products = await getDatas(productURL); // Məhsulları fetch etmək
      const filteredProducts = products.filter(
        (product) => product.category === categoryId
      );
  
      const container = document.querySelector(".featuredproducts_cards");
      container.innerHTML = ""; // Təmizləmək
  
      filteredProducts.slice(0, 3).forEach((product) => {
        const card = createProductCard(product);
        container.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }
  
  // Detallar səhifəsindən category ID götürmək
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get("category");
  if (categoryId) {
    displayProductsByCategory(categoryId);
  }
    




  $(document).ready(function(){
	
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

})
