import productURL from "./baseURL.js";
import { deleteById, getDatas, putById, postData } from "./request.js";

let products = await getDatas(productURL);

const createTable = async () => {
    products.forEach(product => {
        let tableRow = document.createElement("tr");

        let tdId = document.createElement("td");
        tdId.classList.add("product-id");

        let tdImage = document.createElement("td");
        let img = document.createElement("img");
        img.classList.add("product-image");
        tdImage.appendChild(img);

        let tdTitle = document.createElement("td");
        tdTitle.classList.add("product-title");

        let tdCategory = document.createElement("td");
        tdCategory.classList.add("product-category");

        let tdPrice = document.createElement("td");
        tdPrice.classList.add("product-price");

        let actions = document.createElement("td");

        let editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            editProduct(product.id);
        });

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteProduct(product.id);
        });

        tdId.textContent = product.id;
        img.src = product.image;
        tdTitle.textContent = product.title;
        tdCategory.textContent = product.category;
        tdPrice.textContent = product.price;

        actions.append(editButton, deleteButton);

        tableRow.append(tdId, tdImage, tdTitle, tdCategory, tdPrice, actions);

        let tbody = document.querySelector("tbody");
        tbody.appendChild(tableRow);
    });
};

const editProduct = async (productId) => {
    let product = products.find(p => p.id === productId);
    openModal();

    document.querySelector("#image").value = product.image;
    document.querySelector("#title").value = product.title;
    
    document.querySelector("#category").value = product.category;
    document.querySelector("#price").value = product.price;

    let updateButton = document.querySelector(".btnd");
    updateButton.textContent = "Update";
    updateButton.onclick = async () => {
        await updateProduct(productId);
    };
    updateButton.style.display = "inline-block";
  
};

const updateProduct = async (productId) => {
    let image = document.querySelector("#image").value.trim().toLowerCase();
    let title = document.querySelector("#title").value.trim().toLowerCase();
    let category = document.querySelector("#category").value.trim().toLowerCase();
    let price = document.querySelector("#price").value.trim().toLowerCase();

    let updatedProduct = { image, title, category, price };

    await putById(productURL, productId, updatedProduct);

    let productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
    }
    toast("product updated successfully");
    createTable();
    closeModal();
};

const addProduct = async (e) => {
    e.preventDefault();
    let image = document.querySelector("#image").value.trim().toLowerCase();
    let title = document.querySelector("#title").value.trim().toLowerCase();
    let category = document.querySelector("#category").value.trim().toLowerCase();
    let price = document.querySelector("#price").value.trim().toLowerCase();

    let newProduct = {
        id: uuidv4(),
        image,
        title,
        category,
        price,
    };

    toast("Product created");

    await postData(productURL, newProduct);
    createTable();
    closeModal();
};

let form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
    if (document.querySelector(".btnd").textContent === "Update") {
        e.preventDefault();
    } else {
        addProduct(e);
    }
});

const deleteProduct = async (productId) => {
    await deleteById(productURL, productId);
    toast("Product deleted");
};

const openModal = () => {
    let modal = document.querySelector(".row");
    let cover = document.querySelector(".cover");
    modal.style.display = "flex";
    cover.style.display = "block";
};

let addButton = document.querySelector(".add-btn");
addButton.addEventListener("click", openModal);

const closeModal = () => {
    let cover = document.querySelector(".cover");
    let modal = document.querySelector(".row");
    modal.style.display = "none";
    cover.style.display = "none";
};

let closeBtn = document.querySelector(".close");
closeBtn.addEventListener("click", closeModal);

createTable();

function toast(text) {
    localStorage.setItem("toastMessage", text);
    Toastify({
        text: `${text}`,
        duration: 1000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            color: "white",
            paddingLeft: "100px",
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () {}
    }).showToast();
};


window.addEventListener('load', () => {
    const toastMessage = localStorage.getItem("toastMessage");
    if (toastMessage) {
        toast(toastMessage); 
        localStorage.removeItem("toastMessage");  
    }
})


const logoutButton = document.getElementById('logout-button');
const wishlistButton = document.getElementById('wishlist-button');

logoutButton.addEventListener('click', () => {
    wishlistButton.style.display = 'block';
});
